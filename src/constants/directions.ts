// Telefonun kendi harita uygulamasında yol tarifini açan adres (Harita sekmesi ve günün haritası kullanıyor)
import { Platform } from 'react-native';

import type { Coordinates } from '@/data/places';

export function directionsUrl({ latitude, longitude }: Coordinates) {
  return Platform.OS === 'ios'
    ? `https://maps.apple.com/?daddr=${latitude},${longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
