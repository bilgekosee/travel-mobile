// Haritadaki her türün rengi, ikonu ve adı. Pin, kart ve filtre düğmeleri buradan okur;
// bir rengi değiştirmek istersek tek bir yeri değiştirmemiz yeterli.
import type { SymbolViewProps } from 'expo-symbols';

import type { MapItem } from '@/data/map-items';

type KindTheme = {
  label: string; // Filtre düğmesindeki yazı
  color: string; // Pinin zemini ve kartın düğmesi
  icon: SymbolViewProps['name']; // ios: SF Symbols adı, android: Material ikon adı
};

// Record<A, B>: "A'nın her değeri için bir B" demek. Yeni bir tür eklersek
// TypeScript burayı da doldurmamızı ister, unutamayız.
export const MAP_KINDS: Record<MapItem['kind'], KindTheme> = {
  place: { label: 'Gezilecek', color: '#C8102E', icon: { ios: 'camera.fill', android: 'photo_camera' } },
  restaurant: { label: 'Restoran', color: '#B5650A', icon: { ios: 'fork.knife', android: 'restaurant' } },
  shop: { label: 'Alışveriş', color: '#2E4A7D', icon: { ios: 'bag.fill', android: 'shopping_bag' } },
};
