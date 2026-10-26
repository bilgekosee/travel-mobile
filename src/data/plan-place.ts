// Bir durağın ekranda görünen hali. Uygulamadaki yerler MAP_ITEMS'tan, kullanıcının kendi eklediği yerler
// durağın içinden (stop.custom) gelir. Ekranlar hangisi olduğunu bilmeden aynı şekilde gösterir.
import type { SymbolViewProps } from 'expo-symbols';

import { MAP_KINDS } from '@/constants/map-kinds';
import { MAP_ITEMS, type MapItem } from '@/data/map-items';
import type { City, Coordinates } from '@/data/places';
import type { TripStop } from '@/hooks/use-trip';

export type PlanPlace = {
  name: string;
  meta: string; // Adın altındaki küçük satır: "Tapınak · Kyoto" ya da adres
  city?: City;
  color: string; // İkon zemininin rengi
  icon: SymbolViewProps['name'];
  coordinates?: Coordinates; // Kendi eklenen yerde konum seçilmemiş olabilir
  japaneseName?: string;
  address?: string;
  item?: MapItem; // Uygulamadaki yerse kendisi (detay sayfası, harita için); kendi yerinde yok
};

// Kendi eklenen yerler: zeytin yeşili iğne. Uygulamanın kırmızı/turuncu/lacivertinden ayrışsın.
export const CUSTOM_PLACE_THEME = {
  color: '#4D6B4F',
  icon: { ios: 'mappin', android: 'place' },
} as const;

export function placeOf(stop: TripStop): PlanPlace | null {
  if (stop.custom) {
    return {
      name: stop.custom.name,
      meta: stop.custom.address || 'Kendi eklediğin yer',
      ...CUSTOM_PLACE_THEME,
      coordinates: stop.custom.coordinates,
      address: stop.custom.address,
    };
  }
  const item = MAP_ITEMS.find((i) => i.id === stop.itemId);
  if (!item) return null; // Veriden kaldırılmış bir yer
  const kind = MAP_KINDS[item.kind];
  return {
    name: item.name,
    meta: `${item.label} · ${item.city}`,
    city: item.city,
    color: kind.color,
    icon: kind.icon,
    coordinates: item.coordinates,
    japaneseName: item.japaneseName,
    item,
  };
}
