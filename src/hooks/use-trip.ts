// Gezi planı: günler (tarihleriyle) ve her günün sabah/öğle/akşam durakları. Telefona kaydedilir.
// Birden çok ekran (Planım, "Plana ekle" sayfası, yer sayfaları) aynı veriyi görür; biri değiştirince hepsi güncellenir.

// Webdeki localStorage'ın mobil karşılığını etkinleştirir (arkada küçük bir SQLite veritabanına yazar).
// localStorage'a ilk erişimden önce yüklensin diye onu kullanan dosyanın en üstünde.
import 'expo-sqlite/localStorage/install';

import { useSyncExternalStore } from 'react';

import { DAY_SLOTS, type DaySlot, slotForTime } from '@/constants/day-slots';
import { type Attachment, deleteAttachmentFiles } from '@/data/attachments';
import type { Coordinates } from '@/data/places';

// Uygulamanın listesinde olmayan, kullanıcının kendi eklediği yer (arkadaşın önerdiği izakaya gibi)
export type CustomPlace = { name: string; address?: string; coordinates?: Coordinates };

// Bir durak: kendi id'si + haritadaki biçimde yer id'si ("place-sensoji", "restaurant-…", "shop-…") + günün hangi dilimi.
// Kendi id'si şart: durak başka güne/dilime taşınabiliyor, "gün + dilim + yer" üçlüsü değişse de aynı durak kalmalı.
// done/note sonradan eklendi; "?" sayesinde eski kayıtlar da bu tipe uyuyor.
// custom: kendi eklenen yer. O zaman itemId "custom-…" olur ve yerin bilgileri listeden değil buradan okunur.
export type TripStop = {
  id: string;
  itemId: string;
  slot: DaySlot;
  done?: boolean;
  note?: string;
  custom?: CustomPlace;
  time?: string; // "10:30": bilet, rezervasyon gibi belli saati olan duraklar
  remindBefore?: number; // Saatinden kaç dakika önce bildirim gelsin (yoksa hatırlatma kapalı)
  files?: Attachment[]; // Bilet, QR kod, rezervasyon belgesi
  memory?: Memory; // Gidildikten sonra: his, kısa not, fotoğraflar (gezi defteri)
};

export const MOODS = ['😍', '🙂', '😐'] as const;
export type Memory = { mood?: (typeof MOODS)[number]; text?: string; photos?: Attachment[] };

// Defterde gösterilecek bir şeyi var mı?
export function hasMemory(stop: TripStop) {
  const m = stop.memory;
  return !!(m && (m.mood || m.text?.trim() || m.photos?.length));
}
// Tarih metin olarak "2027-04-15": localStorage sadece metin saklar; saat dilimi kaymasına da yol açmaz.
// Bir harcama: ne için + kaç yen (tam sayı: yenin kuruşu yok)
export type Expense = { id: string; label: string; yen: number };

// stay: o gece kalınan yer (otel adı), stayAddress: adresi (taksiciye göstermek için), stayFiles: rezervasyon belgeleri
export type TripDay = {
  id: string;
  date: string;
  stops: TripStop[];
  stay?: string;
  stayAddress?: string;
  stayFiles?: Attachment[];
  expenses?: Expense[];
};

// Günün (ya da günlerin) toplam harcaması, yen
export function totalYen(days: TripDay[]) {
  return days.reduce((sum, day) => sum + (day.expenses ?? []).reduce((s, e) => s + e.yen, 0), 0);
}

const STORAGE_KEY = 'trip';

// --- Tarih yardımcıları ---
// Date → "2027-04-15" (telefonun yerel günü; toISOString UTC'ye çevirip günü kaydırabilirdi)
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// "2027-04-15" → Date (öğlen 12'de: saat dilimi farkı günü değiştiremesin)
export function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

// "2027-04-15" → "15 Nisan Perşembe". Intl tarih biçimlendirme, webdeki gibi mobilde de çalışıyor.
export function formatDateKey(key: string) {
  return fromDateKey(key).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

function nextDateKey(key: string) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + 1);
  return toDateKey(date);
}

// Bugünün anahtarı: "bugün" vurgusu, geri sayım ve gezi durumu bunu temel alır
export function todayKey() {
  return toDateKey(new Date());
}

// İki tarih arasındaki gün farkı ("2027-04-15" → "2027-04-18" = 3). Öğlen saatleri arasında ölçüp yuvarlıyoruz:
// yaz saati geçişinde bir gün 23 ya da 25 saat sürebiliyor.
export function daysBetween(from: string, to: string) {
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / 86_400_000);
}

// Günün durakları Sabah → Öğle → Akşam sırasıyla; dilim içinde dizideki sıra korunur.
// Dizideki sıra tek doğru kaynak: kullanıcı sürükleyerek sıralayabiliyor, saat verilince durak saatine göre
// yerleştiriliyor (setStopTime). Burada yeniden sıralasaydık sürüklenen durak eski yerine geri zıplardı.
export function orderedStops(day: TripDay) {
  return DAY_SLOTS.flatMap((slot) => day.stops.filter((s) => s.slot === slot));
}

// Kısa, büyük ihtimalle benzersiz bir id: zaman damgası + rastgele 4 karakter
function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// --- React'in dışında duran küçük bir "store" ---
function load(): TripDay[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed: TripDay[] = saved ? JSON.parse(saved) : [];
    // Eski kayıtlarda durakların id'si yok: yüklerken veriyoruz (küçük bir "migration")
    return parsed.map((day) => ({ ...day, stops: day.stops.map((s) => (s.id ? s : { ...s, id: newId() })) }));
  } catch {
    return []; // Kayıt bozulduysa uygulama çökmesin, boş planla başlasın
  }
}

let days: TripDay[] = load();
const listeners = new Set<() => void>();

// Her değişiklik buradan geçer: günleri tarihe göre sırala, kaydet, abonelere haber ver.
// Yeni bir dizi veriyoruz (eskisini değiştirmek yerine): React değişikliği ancak böyle fark eder.
function update(next: TripDay[]) {
  days = [...next].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  listeners.forEach((listener) => listener());
}

function mapDay(dayId: string, change: (day: TripDay) => TripDay) {
  update(days.map((day) => (day.id === dayId ? change(day) : day)));
}

// --- İşlemler ---
// Tarih verilmezse: son günün ertesi günü, plan boşsa bugün. Çoğu zaman tarih seçmeye gerek kalmaz.
export function addDay(date?: string) {
  let key = date ?? (days.length > 0 ? nextDateKey(days[days.length - 1].date) : toDateKey(new Date()));
  while (days.some((day) => day.date === key)) key = nextDateKey(key); // Aynı tarihte iki gün olmasın
  const id = newId();
  update([...days, { id, date: key, stops: [] }]);
  return id;
}

export function removeDay(dayId: string) {
  // Günle birlikte giden belgelerin dosyalarını da sil (otel belgesi + durakların belgeleri)
  const day = days.find((d) => d.id === dayId);
  deleteAttachmentFiles(day?.stayFiles);
  day?.stops.forEach((s) => {
    deleteAttachmentFiles(s.files);
    deleteAttachmentFiles(s.memory?.photos);
  });
  update(days.filter((day) => day.id !== dayId));
}

export function addExpense(dayId: string, label: string, yen: number) {
  const expense = { id: newId(), label: label.trim() || 'Harcama', yen };
  mapDay(dayId, (day) => ({ ...day, expenses: [...(day.expenses ?? []), expense] }));
}

export function removeExpense(dayId: string, expenseId: string) {
  mapDay(dayId, (day) => ({ ...day, expenses: day.expenses?.filter((e) => e.id !== expenseId) }));
}

export function addStayFiles(dayId: string, files: Attachment[]) {
  mapDay(dayId, (day) => ({ ...day, stayFiles: [...(day.stayFiles ?? []), ...files] }));
}

export function removeStayFile(dayId: string, file: Attachment) {
  deleteAttachmentFiles([file]);
  mapDay(dayId, (day) => ({ ...day, stayFiles: day.stayFiles?.filter((f) => f.id !== file.id) }));
}

// Aynı tarihte iki gün olmasın (addDay'deki kural): tarih başka bir güne aitse değiştirmez, false döner
export function setDayDate(dayId: string, date: string) {
  if (days.some((day) => day.id !== dayId && day.date === date)) return false;
  mapDay(dayId, (day) => ({ ...day, date }));
  return true;
}

// Boş metin = otel bilgisini sil (ad silinince adres de gider)
export function setDayStay(dayId: string, stay: string, address = '') {
  const name = stay.trim() || undefined;
  mapDay(dayId, (day) => ({ ...day, stay: name, stayAddress: (name && address.trim()) || undefined }));
}

export function addStop(dayId: string, slot: DaySlot, itemId: string) {
  mapDay(dayId, (day) =>
    day.stops.some((s) => s.slot === slot && s.itemId === itemId)
      ? day // Aynı yer aynı dilimde zaten varsa tekrar ekleme
      : { ...day, stops: [...day.stops, { id: newId(), slot, itemId }] },
  );
}

// Bir rotanın adımı: uygulamadaki bir yer (itemId) ya da listede olmayan bir adım (name → kendi yerin olarak eklenir)
export type RouteStep = { slot: DaySlot; itemId?: string; name: string };

// Şehir rehberindeki "1 günde" rotasını bir güne tek seferde ekler (tek kayıt, tek yeniden çizim).
// Aynı yer (ya da aynı adlı kendi yerin) aynı dilimde zaten varsa atlanır: rota iki kez eklenirse çoğalmaz.
// Kaç durak eklendiğini döndürür.
export function addRoute(dayId: string, steps: RouteStep[]) {
  let added = 0;
  mapDay(dayId, (day) => {
    const stops = [...day.stops];
    for (const step of steps) {
      const exists = stops.some((s) =>
        step.itemId ? s.itemId === step.itemId && s.slot === step.slot : s.custom?.name === step.name && s.slot === step.slot,
      );
      if (exists) continue;
      const id = newId();
      stops.push(
        step.itemId
          ? { id, itemId: step.itemId, slot: step.slot }
          : { id, itemId: `custom-${id}`, slot: step.slot, custom: { name: step.name } },
      );
      added++;
    }
    return { ...day, stops };
  });
  return added;
}

// Kendi yerini ekler; yeni durağın id'sini döndürür (ekledikten hemen sonra durak sayfasını açmak için)
export function addCustomStop(dayId: string, slot: DaySlot, name: string) {
  const id = newId();
  mapDay(dayId, (day) => ({
    ...day,
    stops: [...day.stops, { id, itemId: `custom-${id}`, slot, custom: { name: name.trim() } }],
  }));
  return id;
}

// Kendi eklenen yerin adını, adresini ya da konumunu değiştirir (sadece verilen alanlar değişir)
export function updateCustomPlace(stopId: string, changes: Partial<CustomPlace>) {
  mapStop(stopId, (stop) => (stop.custom ? { ...stop, custom: { ...stop.custom, ...changes } } : stop));
}

export function removeStop(stopId: string) {
  const stop = days.flatMap((day) => day.stops).find((s) => s.id === stopId);
  deleteAttachmentFiles(stop?.files);
  deleteAttachmentFiles(stop?.memory?.photos);
  update(days.map((day) => ({ ...day, stops: day.stops.filter((s) => s.id !== stopId) })));
}

// Anının sadece verilen alanları değişir (his, not)
export function updateMemory(stopId: string, changes: Omit<Memory, 'photos'>) {
  mapStop(stopId, (stop) => ({ ...stop, memory: { ...stop.memory, ...changes } }));
}

export function addMemoryPhotos(stopId: string, photos: Attachment[]) {
  mapStop(stopId, (stop) => ({
    ...stop,
    memory: { ...stop.memory, photos: [...(stop.memory?.photos ?? []), ...photos] },
  }));
}

export function removeMemoryPhoto(stopId: string, photo: Attachment) {
  deleteAttachmentFiles([photo]);
  mapStop(stopId, (stop) => ({
    ...stop,
    memory: { ...stop.memory, photos: stop.memory?.photos?.filter((p) => p.id !== photo.id) },
  }));
}

export function addStopFiles(stopId: string, files: Attachment[]) {
  mapStop(stopId, (stop) => ({ ...stop, files: [...(stop.files ?? []), ...files] }));
}

export function removeStopFile(stopId: string, file: Attachment) {
  deleteAttachmentFiles([file]);
  mapStop(stopId, (stop) => ({ ...stop, files: stop.files?.filter((f) => f.id !== file.id) }));
}

// Durağın hangi günde olduğunu bilmeden onu değiştirir
function mapStop(stopId: string, change: (stop: TripStop) => TripStop) {
  update(days.map((day) => ({ ...day, stops: day.stops.map((s) => (s.id === stopId ? change(s) : s)) })));
}

// Gittim / gitmedim
export function toggleStopDone(stopId: string) {
  mapStop(stopId, (stop) => ({ ...stop, done: !stop.done }));
}

// Saat ver ya da sil (undefined). Saat girilince durak o saatin dilimine geçer (10:00 → Sabah).
// Saat silinince hatırlatma da kapanır: saatsiz durağa hatırlatma kurulamaz.
// Saat verilince durak saatine göre yerleşir: aynı dilimde daha geç saatli ya da saatsiz ilk durağın önüne.
export function setStopTime(stopId: string, time: string | undefined) {
  update(
    days.map((day) => {
      const stop = day.stops.find((s) => s.id === stopId);
      if (!stop) return day;
      const changed: TripStop = {
        ...stop,
        time,
        slot: time ? slotForTime(time) : stop.slot,
        remindBefore: time ? stop.remindBefore : undefined,
      };
      if (!time) return { ...day, stops: day.stops.map((s) => (s.id === stopId ? changed : s)) };

      const others = day.stops.filter((s) => s.id !== stopId);
      const index = others.findIndex((s) => s.slot === changed.slot && (!s.time || s.time > time));
      // Öyle bir durak yoksa: dilimin son durağının arkasına (o da yoksa sona)
      const lastInSlot = others.map((s) => s.slot).lastIndexOf(changed.slot);
      const at = index >= 0 ? index : lastInSlot + 1 || others.length;
      return { ...day, stops: [...others.slice(0, at), changed, ...others.slice(at)] };
    }),
  );
}

// Sıralama sayfasından: günün yeni sırası ve her durağın (belki değişen) dilimi.
// Dilimi değişen durağın saati yeni dilimle çelişiyorsa silinir (taşımadaki kural).
export function reorderStops(dayId: string, order: { id: string; slot: DaySlot }[]) {
  mapDay(dayId, (day) => ({
    ...day,
    stops: order.flatMap(({ id, slot }) => {
      const stop = day.stops.find((s) => s.id === id);
      if (!stop) return [];
      const time = stop.time && slotForTime(stop.time) === slot ? stop.time : undefined;
      return [{ ...stop, slot, time, remindBefore: time ? stop.remindBefore : undefined }];
    }),
  }));
}

// Kaç dakika önce hatırlatılsın; undefined = kapalı
export function setStopReminder(stopId: string, minutes: number | undefined) {
  mapStop(stopId, (stop) => ({ ...stop, remindBefore: minutes }));
}

export function setStopNote(stopId: string, note: string) {
  mapStop(stopId, (stop) => ({ ...stop, note: note || undefined }));
}

// Durağı başka bir güne ve/veya dilime taşır (notu ve "gittim" işareti de onunla gider).
// Hedefte aynı yer aynı dilimde zaten varsa taşımaz, false döner.
export function moveStop(stopId: string, toDayId: string, slot: DaySlot) {
  const stop = days.flatMap((day) => day.stops).find((s) => s.id === stopId);
  const target = days.find((day) => day.id === toDayId);
  if (!stop || !target) return false;
  if (target.stops.some((s) => s.id !== stopId && s.itemId === stop.itemId && s.slot === slot)) return false;

  update(
    days.map((day) => {
      const stops = day.stops.filter((s) => s.id !== stopId); // Önce olduğu yerden çıkar…
      // Saat yeni dilimle çelişiyorsa sil (10:00'daki durak Akşam'a taşındıysa); saatle birlikte hatırlatma da gider,
      // yoksa sonra yeni saat verilince eski hatırlatma kendiliğinden geri gelirdi (setStopTime'daki kural)
      const time = stop.time && slotForTime(stop.time) === slot ? stop.time : undefined;
      const moved = { ...stop, slot, time, remindBefore: time ? stop.remindBefore : undefined };
      return day.id === toDayId ? { ...day, stops: [...stops, moved] } : { ...day, stops }; // …hedefin sonuna ekle
    }),
  );
  return true;
}

// --- Hook'lar ---
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener); // Bileşen ekrandan kalkınca aboneliği bırak
}

// Yedekten geri yükleme: bütün planı tek seferde değiştirir. update'ten geçtiği için kaydedilir, ekranlar
// yenilenir, hatırlatmalar yeniden kurulur. Eski yedekte durak id'si yoksa yüklemedeki gibi verilir.
export function replaceTrip(next: TripDay[]) {
  update(next.map((day) => ({ ...day, stops: day.stops.map((s) => (s.id ? s : { ...s, id: newId() })) })));
}

// Güncel günler, hook olmadan: olay işleyicisinde (onPress) bir değişiklikten hemen sonraki hali okumak için.
// Ekranda göstermek için değil; bileşenler useTrip kullanır (yoksa değişince yeniden çizilmezler).
export function getDays() {
  return days;
}

// useSyncExternalStore: React'in dışındaki bir veriyi bileşenlere bağlar (webdeki React ile aynı)
export function useTrip() {
  return useSyncExternalStore(subscribe, () => days);
}

// Tek bir durak ve içinde bulunduğu gün (durak sayfası için). Durak taşınınca da bulunur: id değişmiyor.
export function useStop(stopId: string) {
  const days = useTrip();
  for (const day of days) {
    const stop = day.stops.find((s) => s.id === stopId);
    if (stop) return { day, stop };
  }
  return null;
}

// Bu yer planın herhangi bir gününde var mı? ("Plana ekle" düğmesi "Planda" olarak görünsün diye)
export function useIsInPlan(itemId: string) {
  return useTrip().some((day) => day.stops.some((s) => s.itemId === itemId));
}
