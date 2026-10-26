// Gezinin bütününe ait bilgiler (günlere değil): gidiş ve dönüş uçuşu. Telefona kaydedilir.
// use-trip ile aynı desen: React'in dışında duran küçük bir store + useSyncExternalStore.
import 'expo-sqlite/localStorage/install';

import { useSyncExternalStore } from 'react';

import { type Attachment, deleteAttachmentFiles } from '@/data/attachments';
import { type ChecklistItem, DEFAULT_CHECKLIST } from '@/data/checklist-defaults';

// Hepsi serbest metin: "TK 52", "13:45", "İstanbul (IST)". Saat dilimi farkları, aktarmalar… kullanıcı nasıl isterse.
export type Flight = {
  number?: string;
  time?: string;
  from?: string;
  to?: string;
  note?: string;
  files?: Attachment[]; // Biniş kartı, e-bilet
};
export type FlightLeg = 'outbound' | 'return'; // Gidiş / dönüş

// tryPer100Yen: 100 yen kaç TL (kullanıcı girer; internetsiz çalışsın diye kur çekmiyoruz)
// checklist: hazırlık listesi. Hiç dokunulmadıysa yok → hazır maddeler gösterilir; ilk değişiklikte kaydedilir.
// lastBackupAt: son yedeğin zamanı (ms); menüde "Son yedek: …" diye hatırlatmak için
export type TripInfo = {
  flights: Record<FlightLeg, Flight>;
  tryPer100Yen?: number;
  checklist?: ChecklistItem[];
  lastBackupAt?: number;
};

const STORAGE_KEY = 'trip-info';
const EMPTY: TripInfo = { flights: { outbound: {}, return: {} } };

function load(): TripInfo {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // { ...EMPTY, ...kayıt }: sonradan eklenen alanlar eski kayıtta yoksa varsayılanı gelsin
    return saved ? { ...EMPTY, ...JSON.parse(saved) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

let info: TripInfo = load();
const listeners = new Set<() => void>();

function update(next: TripInfo) {
  info = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  listeners.forEach((listener) => listener());
}

function mapFlight(leg: FlightLeg, change: (flight: Flight) => Flight) {
  update({ ...info, flights: { ...info.flights, [leg]: change(info.flights[leg]) } });
}

// --- İşlemler ---
// Sadece verilen alanlar değişir. Boş metin = alanı sil.
export function updateFlight(leg: FlightLeg, changes: Partial<Omit<Flight, 'files'>>) {
  const cleaned = Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v?.trim() || undefined]));
  mapFlight(leg, (flight) => ({ ...flight, ...cleaned }));
}

export function addFlightFiles(leg: FlightLeg, files: Attachment[]) {
  mapFlight(leg, (flight) => ({ ...flight, files: [...(flight.files ?? []), ...files] }));
}

export function removeFlightFile(leg: FlightLeg, file: Attachment) {
  deleteAttachmentFiles([file]);
  mapFlight(leg, (flight) => ({ ...flight, files: flight.files?.filter((f) => f.id !== file.id) }));
}

export function setExchangeRate(tryPer100Yen: number | undefined) {
  update({ ...info, tryPer100Yen });
}

// Hazırlık listesi: kayıtlı liste ya da (hiç dokunulmadıysa) hazır maddeler
export function checklistOf(tripInfo: TripInfo) {
  return tripInfo.checklist ?? DEFAULT_CHECKLIST;
}

function mapChecklist(change: (items: ChecklistItem[]) => ChecklistItem[]) {
  update({ ...info, checklist: change(checklistOf(info)) });
}

export function toggleChecklistItem(id: string) {
  mapChecklist((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
}

export function addChecklistItem(text: string) {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  mapChecklist((items) => [...items, { id, text: text.trim() }]);
}

export function removeChecklistItem(id: string) {
  mapChecklist((items) => items.filter((item) => item.id !== id));
}

// Yedekten geri yükleme: bütün bilgiyi değiştirir (eksik alanlar varsayılandan gelir)
export function replaceTripInfo(next: Partial<TripInfo>) {
  update({ ...EMPTY, ...next });
}

export function markBackedUp() {
  update({ ...info, lastBackupAt: Date.now() });
}

// Güncel bilgi, hook olmadan (yedek alırken okumak için)
export function getTripInfo() {
  return info;
}

// --- Hook ---
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTripInfo() {
  return useSyncExternalStore(subscribe, () => info);
}

// "¥12.300" ve kur girildiyse "≈ ₺2.768". Türkçe sayı biçimi: binlik ayıracı nokta.
export function formatYen(yen: number) {
  return `¥${yen.toLocaleString('tr-TR')}`;
}

export function formatTry(yen: number, tryPer100Yen?: number) {
  if (!tryPer100Yen) return '';
  return `≈ ₺${Math.round((yen * tryPer100Yen) / 100).toLocaleString('tr-TR')}`;
}

// "TK 52 · 13:45 · İstanbul → Haneda": dolu alanlardan kısa özet (Planım'daki satır için). Hiçbiri yoksa boş.
export function flightSummary(flight: Flight) {
  const route = flight.from || flight.to ? `${flight.from ?? '?'} → ${flight.to ?? '?'}` : '';
  return [flight.number, flight.time, route].filter(Boolean).join(' · ');
}
