// Yedek al / yedekten geri yükle. Plan sadece telefonda duruyor: uygulama silinirse ya da telefon değişirse gider.
// Yedek tek bir .json dosyası: plan + gezi bilgisi (uçuş, hazırlık, kur) + bütün belge ve fotoğraflar (base64).
// Tek dosya olduğu için iCloud Drive'a kaydetmek, AirDrop'la ya da WhatsApp'tan göndermek kolay.
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { type Attachment, attachmentFile } from '@/data/attachments';
import { getDays, replaceTrip, todayKey, type TripDay } from '@/hooks/use-trip';
import { getTripInfo, markBackedUp, replaceTripInfo, type TripInfo } from '@/hooks/use-trip-info';

const APP = 'japonya-gezi';
const VERSION = 1;

type Backup = {
  app: string;
  version: number;
  createdAt: number;
  trip: TripDay[];
  info: Partial<TripInfo>;
  files?: Record<string, string>; // dosya adı → içeriği (base64)
};

export type BackupPreview = { backup: Backup; days: number; stops: number; files: number; createdAt: number };

// Plandaki bütün belgeler: durak belgeleri, otel belgeleri, anı fotoğrafları, biniş kartları
function allAttachments(days: TripDay[], info: Partial<TripInfo>): Attachment[] {
  return [
    ...days.flatMap((day) => [
      ...(day.stayFiles ?? []),
      ...day.stops.flatMap((s) => [...(s.files ?? []), ...(s.memory?.photos ?? [])]),
    ]),
    ...Object.values(info.flights ?? {}).flatMap((f) => f.files ?? []),
  ];
}

// --- Yedek al ---
// Dosyayı parça parça yazıyoruz (append): fotoğrafları tek bir dev metinde birleştirseydik çok fotoğraflı
// yedekte bellek yetmeyebilirdi. Sonra telefonun paylaşım menüsü açılır: "Dosyalar'a kaydet", AirDrop…
export async function exportBackup() {
  const days = getDays();
  const info = getTripInfo();
  const file = new File(Paths.cache, `japonya-gezi-yedek-${todayKey()}.json`);
  if (file.exists) file.delete();
  file.create();

  const head = { app: APP, version: VERSION, createdAt: Date.now(), trip: days, info };
  // Son "}" olmadan yaz, files alanını parça parça ekle
  file.write(`${JSON.stringify(head).slice(0, -1)},"files":{`);
  let first = true;
  for (const attachment of allAttachments(days, info)) {
    const source = attachmentFile(attachment.fileName);
    if (!source.exists) continue;
    file.write(`${first ? '' : ','}${JSON.stringify(attachment.fileName)}:"`, { append: true });
    file.write(await source.base64(), { append: true }); // base64 karakterleri JSON metninde güvenli
    file.write('"', { append: true });
    first = false;
  }
  file.write('}}', { append: true });

  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Gezi yedeği' });
  markBackedUp();
}

// --- Yedekten geri yükle ---
// 1) Dosyayı seç ve oku, gerçekten bizim yedeğimiz mi diye bak, özetini çıkar (onay sormak için).
// Hata durumunda kullanıcıya gösterilecek Türkçe mesajla Error fırlatır. İptal edilirse null.
export async function pickBackup(): Promise<BackupPreview | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', '*/*'] });
  if (result.canceled) return null;

  let backup: Backup;
  try {
    backup = JSON.parse(await new File(result.assets[0].uri).text());
  } catch {
    throw new Error('Bu dosya okunamadı. Bir gezi yedeği seçtiğinden emin ol.');
  }
  if (backup?.app !== APP || !Array.isArray(backup.trip)) {
    throw new Error('Bu dosya bir Japonya gezisi yedeği değil.');
  }
  if (backup.version > VERSION) {
    throw new Error('Bu yedek uygulamanın daha yeni bir sürümüyle alınmış. Önce uygulamayı güncelle.');
  }
  return {
    backup,
    days: backup.trip.length,
    stops: backup.trip.reduce((n, day) => n + day.stops.length, 0),
    files: Object.keys(backup.files ?? {}).length,
    createdAt: backup.createdAt,
  };
}

// Dosya adı sadece harf, rakam, nokta, tire, alt çizgi olabilir: yedekteki "../" gibi bir ad uygulamanın
// klasörünün dışına yazamasın
const SAFE_NAME = /^[\w.-]+$/;

// 2) Onaydan sonra: önce yedekteki dosyaları yaz, sonra planı değiştir, en son artık kullanılmayan eski dosyaları sil.
// Bu sırayla yarıda kalırsa plan bozulmaz (en kötü ihtimalle fazladan dosya kalır).
export function restoreBackup(backup: Backup) {
  const before = allAttachments(getDays(), getTripInfo()).map((a) => a.fileName);

  for (const [name, base64] of Object.entries(backup.files ?? {})) {
    if (!SAFE_NAME.test(name)) continue;
    const file = attachmentFile(name);
    if (!file.exists) file.create();
    file.write(base64, { encoding: 'base64' });
  }

  replaceTrip(backup.trip);
  replaceTripInfo(backup.info ?? {});

  const kept = new Set(allAttachments(backup.trip, backup.info ?? {}).map((a) => a.fileName));
  for (const name of before) {
    if (kept.has(name)) continue;
    const file = attachmentFile(name);
    if (file.exists) file.delete();
  }
}
