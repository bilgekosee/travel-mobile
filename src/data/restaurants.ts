// Haritada gösterilen yemek durakları: ünlü restoranlar, yemek sokakları ve pazarlar.
// Not: Koordinatlar yaklaşıktır ve restoranlar zamanla kapanabilir/taşınabilir;
// gerçek bir uygulamada bu veri güncel bir kaynaktan (API) gelmeli.

import type { City, Coordinates } from '@/data/places';

export type Restaurant = {
  id: string;
  name: string;
  japaneseName: string;
  city: City;
  cuisine: string; // Ne yenir: "Ramen", "Okonomiyaki"…
  summary: string;
  coordinates: Coordinates;
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'tokyo-ramen-street',
    name: 'Tokyo Ramen Street',
    japaneseName: '東京ラーメンストリート',
    city: 'Tokyo',
    cuisine: 'Ramen',
    summary: 'Tokyo İstasyonu’nun altında, ünlü ramen dükkanlarının yan yana dizildiği sokak.',
    coordinates: { latitude: 35.68, longitude: 139.768 },
  },
  {
    id: 'omoide-yokocho',
    name: 'Omoide Yokochō',
    japaneseName: '思い出横丁',
    city: 'Tokyo',
    cuisine: 'Yakitori',
    summary: 'Shinjuku’da dar bir ara sokak; küçük tezgâhlarda kömürde şiş tavuk (yakitori).',
    coordinates: { latitude: 35.693, longitude: 139.6995 },
  },
  {
    id: 'sushizanmai-tsukiji',
    name: 'Sushizanmai Tsukiji',
    japaneseName: 'すしざんまい 築地',
    city: 'Tokyo',
    cuisine: 'Sushi',
    summary: 'Tsukiji pazarının yanında, gece geç saate kadar açık uygun fiyatlı sushi zinciri.',
    coordinates: { latitude: 35.6655, longitude: 139.7708 },
  },
  {
    id: 'nishiki-market',
    name: 'Nishiki Pazarı',
    japaneseName: '錦市場',
    city: 'Kyoto',
    cuisine: 'Sokak lezzetleri',
    summary: '“Kyoto’nun mutfağı”: 400 yıllık kapalı çarşıda turşu, tamagoyaki ve deniz ürünleri.',
    coordinates: { latitude: 35.005, longitude: 135.7648 },
  },
  {
    id: 'pontocho',
    name: 'Pontochō',
    japaneseName: '先斗町',
    city: 'Kyoto',
    cuisine: 'Kaiseki',
    summary: 'Kamo Nehri kıyısında fenerli dar sokak; geleneksel Kyoto restoranları.',
    coordinates: { latitude: 35.0065, longitude: 135.771 },
  },
  {
    id: 'kuromon-market',
    name: 'Kuromon Pazarı',
    japaneseName: '黒門市場',
    city: 'Osaka',
    cuisine: 'Deniz ürünleri',
    summary: 'Izgara deniz tarağı, taze sushi ve wagyu şişlerinin satıldığı canlı pazar.',
    coordinates: { latitude: 34.6655, longitude: 135.5066 },
  },
  {
    id: 'shinsekai',
    name: 'Shinsekai',
    japaneseName: '新世界',
    city: 'Osaka',
    cuisine: 'Kushikatsu',
    summary: 'Tsūtenkaku kulesinin çevresinde kızarmış şiş (kushikatsu) dükkanları. Sosa iki kez batırmak yasak!',
    coordinates: { latitude: 34.6522, longitude: 135.5059 },
  },
  {
    id: 'nakatanidou',
    name: 'Nakatanidō',
    japaneseName: '中谷堂',
    city: 'Nara',
    cuisine: 'Mochi',
    summary: 'Hızlı mochi dövme gösterisiyle ünlü dükkân; sıcak yomogi mochi.',
    coordinates: { latitude: 34.6823, longitude: 135.8279 },
  },
  {
    id: 'okonomimura',
    name: 'Okonomimura',
    japaneseName: 'お好み村',
    city: 'Hiroshima',
    cuisine: 'Okonomiyaki',
    summary: 'Üç kata yayılmış onlarca okonomiyaki tezgâhı; Hiroşima usulü, erişteli.',
    coordinates: { latitude: 34.392, longitude: 132.4614 },
  },
  {
    id: 'owakudani',
    name: 'Ōwakudani',
    japaneseName: '大涌谷',
    city: 'Hakone',
    cuisine: 'Kuro-tamago',
    summary: 'Volkanik vadide kükürtlü suda kararan “siyah yumurta”; birinin ömrü 7 yıl uzattığına inanılır.',
    coordinates: { latitude: 35.244, longitude: 139.0196 },
  },
];
