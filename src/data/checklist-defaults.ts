// Japonya gezisi hazırlık listesinin hazır maddeleri. Kullanıcı işaretler, siler, kendi maddesini ekler.
// hint: maddenin neden listede olduğunu bir satırda anlatır.
// Not: Kurallar değişebilir (giriş işlemleri, ulaşım kartları); gerçek bir uygulamada resmi kaynaklardan doğrulanmalı.
export type ChecklistItem = { id: string; text: string; hint?: string; done?: boolean };

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'passport', text: 'Pasaport', hint: 'Gezi boyunca geçerli olmalı' },
  { id: 'flights', text: 'Uçak biletleri', hint: 'Planım’da Kalkış ve Dönüş’e ekleyebilirsin' },
  { id: 'hotels', text: 'Otel rezervasyonları', hint: 'Her günün 🛏 satırına adresiyle ekle' },
  { id: 'vjw', text: 'Visit Japan Web kaydı', hint: 'Giriş ve gümrük için QR kodu; uçmadan önce doldur' },
  { id: 'insurance', text: 'Seyahat sağlık sigortası' },
  { id: 'esim', text: 'eSIM ya da pocket Wi-Fi', hint: 'Harita ve çeviri için internet' },
  { id: 'ic-card', text: 'Suica / PASMO', hint: 'Tren, metro, market; telefon cüzdanına da eklenebiliyor' },
  { id: 'jr-pass', text: 'JR Pass (gerekiyorsa)', hint: 'Çok şehir gezilecekse fiyatını tek biletlerle karşılaştır' },
  { id: 'cash', text: 'Nakit yen', hint: 'Küçük dükkan ve tapınaklarda hâlâ nakit isteniyor' },
  { id: 'adapter', text: 'Priz adaptörü', hint: 'Japonya’da A tipi priz, 100 V' },
  { id: 'shoes', text: 'Rahat yürüyüş ayakkabısı', hint: 'Günde 15–20 bin adım normal' },
  { id: 'bag', text: 'Küçük havlu ve çöp poşeti', hint: 'Sokakta çöp kutusu az, tuvaletlerde kurutucu olmayabilir' },
];
