// Gezilecek yerler, restoranlar ve dükkanlar farklı şekilde veriler. Harita hepsini tek bir listede,
// aynı şekle çevrilmiş halde kullanıyor; "kind" alanı hangisi olduğunu söylüyor.
import { type City, type Coordinates, PLACES } from '@/data/places';
import { RESTAURANTS } from '@/data/restaurants';
import { SHOPS } from '@/data/shops';

export type MapItem = {
  id: string; // Haritada benzersiz anahtar
  sourceId: string; // Asıl listedeki id: /place/[id] adresinde kullanılır
  kind: 'place' | 'restaurant' | 'shop';
  name: string;
  japaneseName: string;
  city: City;
  label: string; // Kartta küçük etiket: "Tapınak", "Ramen"…
  summary: string;
  coordinates: Coordinates;
  items?: string[]; // ? = isteğe bağlı: sadece dükkanlarda var (ne alınır)
  access?: string; // Sadece dükkanlarda: nasıl gidilir
};

export const MAP_ITEMS: MapItem[] = [
  ...PLACES.map(
    (p): MapItem => ({
      // Aynı id iki listede de olabilir (ör. "hakone"), ön ek ile benzersiz yapıyoruz
      id: `place-${p.id}`,
      sourceId: p.id,
      kind: 'place',
      name: p.name,
      japaneseName: p.japaneseName,
      city: p.city,
      label: p.category,
      summary: p.summary,
      coordinates: p.coordinates,
    }),
  ),
  ...RESTAURANTS.map(
    (r): MapItem => ({
      id: `restaurant-${r.id}`,
      sourceId: r.id,
      kind: 'restaurant',
      name: r.name,
      japaneseName: r.japaneseName,
      city: r.city,
      label: r.cuisine,
      summary: r.summary,
      coordinates: r.coordinates,
    }),
  ),
  ...SHOPS.map(
    (s): MapItem => ({
      id: `shop-${s.id}`,
      sourceId: s.id,
      kind: 'shop',
      name: s.name,
      japaneseName: s.japaneseName,
      city: s.city,
      label: s.specialty,
      summary: s.summary,
      coordinates: s.coordinates,
      items: s.items,
      access: s.access,
    }),
  ),
];
