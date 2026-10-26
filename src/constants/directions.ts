// Yol tarifi ve mesafe yardımcıları (Harita sekmesi, günün haritası).
import { Platform } from 'react-native';

import type { Coordinates } from '@/data/places';

// Telefonun kendi harita uygulamasında yol tarifini açan adres.
// from verilmezse "bulunduğun yerden"; transit: toplu taşıma modunda aç (Japonya'da şehir içi ulaşımın çoğu tren/metro)
export function directionsUrl(to: Coordinates, from?: Coordinates, transit = false) {
  const point = (c: Coordinates) => `${c.latitude},${c.longitude}`;
  if (Platform.OS === 'ios') {
    // saddr: başlangıç, daddr: varış, dirflg=r: toplu taşıma (Apple Haritalar'ın adres parametreleri)
    return `https://maps.apple.com/?${from ? `saddr=${point(from)}&` : ''}daddr=${point(to)}${transit ? '&dirflg=r' : ''}`;
  }
  return `https://www.google.com/maps/dir/?api=1${from ? `&origin=${point(from)}` : ''}&destination=${point(to)}${transit ? '&travelmode=transit' : ''}`;
}

// İki nokta arası kuş uçuşu mesafe (km). Haversine formülü: dünyanın yuvarlaklığını hesaba katar.
export function distanceKm(a: Coordinates, b: Coordinates) {
  const R = 6371; // Dünyanın yarıçapı (km)
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DETOUR = 1.3; // Sokaklar dümdüz gitmiyor: gerçek yol kuş uçuşundan ~%30 uzun (yaygın kestirim)
const WALK_KMH = 4.5; // Ortalama yürüme hızı
const MAX_WALK_KM = 2.5; // Bundan uzunsa yürümek yerine tren/metro öner

// "1,2 km · ~17 dk yürüme" ya da "3,4 km · tren/metro". walk: yürünebilir mi (ikon seçmek için)
export function legSummary(from: Coordinates, to: Coordinates) {
  const km = distanceKm(from, to) * DETOUR;
  // 1 km altı metre (50'ye yuvarlı: "350 m"), üstü virgüllü km ("1,2 km")
  const distance =
    km < 1
      ? `${Math.round((km * 1000) / 50) * 50} m`
      : `${km.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} km`;
  if (km > MAX_WALK_KM) return { walk: false, text: `${distance} · tren/metro` };
  const minutes = Math.max(1, Math.round((km / WALK_KMH) * 60));
  return { walk: true, text: `${distance} · ~${minutes} dk yürüme` };
}
