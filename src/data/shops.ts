// Alışveriş noktaları: nereden ne alınır, oraya nasıl gidilir.
// Not: Koordinatlar ve ulaşım bilgileri yaklaşıktır; gerçek bir uygulamada güncel kaynaktan doğrulanmalı.

import type { SymbolViewProps } from 'expo-symbols';

import type { City, Coordinates } from '@/data/places';

// Alınabilecek bir şey ve etiketinde görünen ikonu.
// icon: ios = SF Symbols adı, android = Material ikon adı
export type ShopItem = { name: string; icon: SymbolViewProps['name'] };

export type Shop = {
  id: string;
  name: string;
  japaneseName: string;
  city: City;
  specialty: string; // Kısaca ne için gidilir: "Elektronik", "Seramik"…
  summary: string;
  items: ShopItem[]; // Orada alınabilecek şeyler
  access: string; // Nasıl gidilir: en yakın istasyon, hat, çıkış
  coordinates: Coordinates;
};

export const SHOPS: Shop[] = [
  {
    id: 'akihabara',
    name: 'Akihabara',
    japaneseName: '秋葉原電気街',
    city: 'Tokyo',
    specialty: 'Elektronik & anime',
    summary: '“Elektrik Şehri”: elektronik mağazaları, anime/manga dükkanları ve retro oyun salonları.',
    items: [
      { name: 'Kamera ve elektronik', icon: { ios: 'camera.fill', android: 'photo_camera' } },
      { name: 'Anime figürleri', icon: { ios: 'figure.stand', android: 'person' } },
      { name: 'Manga', icon: { ios: 'book.fill', android: 'menu_book' } },
      { name: 'Retro oyunlar', icon: { ios: 'gamecontroller.fill', android: 'sports_esports' } },
      { name: 'Gachapon oyuncakları', icon: { ios: 'capsule.fill', android: 'toys' } },
    ],
    access: 'JR Yamanote hattı, Akihabara İstasyonu, “Electric Town” çıkışı.',
    coordinates: { latitude: 35.6984, longitude: 139.7731 },
  },
  {
    id: 'takeshita',
    name: 'Takeshita Dōri',
    japaneseName: '竹下通り',
    city: 'Tokyo',
    specialty: 'Moda',
    summary: 'Harajuku’nun renkli caddesi: “kawaii” sokak modası, aksesuar ve krep tezgâhları.',
    items: [
      { name: 'Sokak modası', icon: { ios: 'tshirt.fill', android: 'checkroom' } },
      { name: 'Aksesuar', icon: { ios: 'sparkles', android: 'diamond' } },
      { name: 'Kawaii hediyelikler', icon: { ios: 'gift.fill', android: 'redeem' } },
      { name: 'Krep (yerinde yemek için)', icon: { ios: 'birthday.cake.fill', android: 'bakery_dining' } },
    ],
    access: 'JR Yamanote hattı, Harajuku İstasyonu, Takeshita çıkışının tam karşısı.',
    coordinates: { latitude: 35.6716, longitude: 139.7031 },
  },
  {
    id: 'kappabashi',
    name: 'Kappabashi Dōgu-gai',
    japaneseName: 'かっぱ橋道具街',
    city: 'Tokyo',
    specialty: 'Mutfak',
    summary: 'Restoran malzemecilerinin caddesi; Japon bıçakları ve plastik yemek maketleri burada.',
    items: [
      { name: 'Japon mutfak bıçakları', icon: { ios: 'fork.knife', android: 'restaurant' } },
      { name: 'Seramik kaseler', icon: { ios: 'cup.and.saucer.fill', android: 'coffee' } },
      { name: 'Plastik yemek maketleri', icon: { ios: 'takeoutbag.and.cup.and.straw.fill', android: 'fastfood' } },
      { name: 'Bento kutuları', icon: { ios: 'square.grid.2x2.fill', android: 'grid_view' } },
    ],
    access: 'Tokyo Metro Ginza hattı, Tawaramachi İstasyonu, 5 dk yürüme. Sensō-ji’ye de yakın.',
    coordinates: { latitude: 35.7139, longitude: 139.7883 },
  },
  {
    id: 'ninenzaka',
    name: 'Sannenzaka & Ninenzaka',
    japaneseName: '三年坂・二年坂',
    city: 'Kyoto',
    specialty: 'Seramik',
    summary: 'Kiyomizu-dera’ya çıkan taş döşeli yokuşlar; geleneksel dükkanlar ve çay evleri.',
    items: [
      { name: 'Kiyomizu-yaki seramik', icon: { ios: 'cup.and.saucer.fill', android: 'coffee' } },
      { name: 'Yelpaze', icon: { ios: 'wind', android: 'air' } },
      { name: 'Matcha tatlıları', icon: { ios: 'leaf.fill', android: 'eco' } },
      { name: 'Yatsuhashi (Kyoto kurabiyesi)', icon: { ios: 'birthday.cake.fill', android: 'cake' } },
    ],
    access: 'Kyoto İstasyonu’ndan 206 veya 100 numaralı otobüs, Kiyomizu-michi durağı, 10 dk yürüme.',
    coordinates: { latitude: 34.9965, longitude: 135.781 },
  },
  {
    id: 'ippodo',
    name: 'Ippodō Çay',
    japaneseName: '一保堂茶舗',
    city: 'Kyoto',
    specialty: 'Çay',
    summary: '1717’den beri açık çay dükkânı; yanındaki salonda çayı demleyip tadabilirsiniz.',
    items: [
      { name: 'Matcha', icon: { ios: 'leaf.fill', android: 'eco' } },
      { name: 'Gyokuro', icon: { ios: 'leaf.fill', android: 'eco' } },
      { name: 'Hōjicha', icon: { ios: 'flame.fill', android: 'local_fire_department' } }, // Kavrulmuş çay
      { name: 'Çay setleri', icon: { ios: 'cup.and.saucer.fill', android: 'emoji_food_beverage' } },
    ],
    access: 'Tōzai metro hattı, Kyoto Shiyakusho-mae İstasyonu, 5 dk yürüme (Teramachi caddesi).',
    coordinates: { latitude: 35.013, longitude: 135.7672 },
  },
  {
    id: 'shinsaibashi',
    name: 'Shinsaibashi-suji',
    japaneseName: '心斎橋筋商店街',
    city: 'Osaka',
    specialty: 'Kozmetik & moda',
    summary: '600 metrelik kapalı alışveriş caddesi; Dōtonbori’ye kadar uzanır.',
    items: [
      { name: 'Japon kozmetiği', icon: { ios: 'sparkles', android: 'auto_awesome' } },
      { name: 'Eczane ürünleri', icon: { ios: 'cross.case.fill', android: 'medication' } },
      { name: 'Moda', icon: { ios: 'tshirt.fill', android: 'checkroom' } },
      { name: 'KitKat çeşitleri', icon: { ios: 'gift.fill', android: 'redeem' } },
    ],
    access: 'Midōsuji metro hattı, Shinsaibashi İstasyonu, 5–6 numaralı çıkışlar.',
    coordinates: { latitude: 34.673, longitude: 135.5014 },
  },
  {
    id: 'den-den-town',
    name: 'Den Den Town',
    japaneseName: '日本橋でんでんタウン',
    city: 'Osaka',
    specialty: 'Elektronik & anime',
    summary: 'Osaka’nın Akihabara’sı: elektronik, figür ve oyun dükkanları.',
    items: [
      { name: 'Elektronik', icon: { ios: 'desktopcomputer', android: 'computer' } },
      { name: 'Anime figürleri', icon: { ios: 'figure.stand', android: 'person' } },
      { name: 'Retro oyunlar', icon: { ios: 'gamecontroller.fill', android: 'sports_esports' } },
      { name: 'Maket', icon: { ios: 'hammer.fill', android: 'build' } },
    ],
    access: 'Sakaisuji metro hattı, Ebisuchō İstasyonu, 1A çıkışı.',
    coordinates: { latitude: 34.66, longitude: 135.506 },
  },
  {
    id: 'higashimuki',
    name: 'Higashimuki Çarşısı',
    japaneseName: '東向商店街',
    city: 'Nara',
    specialty: 'Yöresel ürünler',
    summary: 'İstasyondan Nara Parkı’na giderken yol üstündeki kapalı çarşı.',
    items: [
      { name: 'Nara-zuke turşusu', icon: { ios: 'carrot.fill', android: 'eco' } },
      { name: 'Sumi mürekkebi ve fırça', icon: { ios: 'paintbrush.pointed.fill', android: 'brush' } },
      { name: 'Geyik temalı hediyelikler', icon: { ios: 'pawprint.fill', android: 'pets' } },
    ],
    access: 'Kintetsu Nara İstasyonu’nun 2 numaralı çıkışından hemen sonra başlar.',
    coordinates: { latitude: 34.6838, longitude: 135.8287 },
  },
  {
    id: 'miyajima-omotesando',
    name: 'Miyajima Omotesandō',
    japaneseName: '宮島表参道商店街',
    city: 'Hiroshima',
    specialty: 'Hediyelik',
    summary: 'Feribot iskelesinden Itsukushima Tapınağı’na uzanan çarşı.',
    items: [
      { name: 'Momiji manjū (akçaağaç yaprağı kek)', icon: { ios: 'leaf.fill', android: 'eco' } },
      { name: 'Shakushi (tahta pirinç kepçesi)', icon: { ios: 'fork.knife', android: 'restaurant' } },
      { name: 'Izgara istiridye', icon: { ios: 'flame.fill', android: 'outdoor_grill' } },
    ],
    access: 'JR Miyajimaguchi İstasyonu’ndan feribot (10 dk, JR Pass geçerli), iskeleden 5 dk yürüme.',
    coordinates: { latitude: 34.2985, longitude: 132.3215 },
  },
  {
    id: 'hakone-yumoto',
    name: 'Hakone-Yumoto Çarşısı',
    japaneseName: '箱根湯本商店街',
    city: 'Hakone',
    specialty: 'El sanatları',
    summary: 'Onsen kasabasının ana caddesi; Hakone’nin geleneksel el sanatları.',
    items: [
      { name: 'Yosegi-zaiku (kakma ahşap kutu)', icon: { ios: 'square.grid.3x3.fill', android: 'grid_on' } },
      { name: 'Onsen manjū', icon: { ios: 'birthday.cake.fill', android: 'cake' } },
      { name: 'Hakone bambusu ürünler', icon: { ios: 'leaf.fill', android: 'eco' } },
    ],
    access: 'Odakyū Romancecar ile Shinjuku’dan ~85 dk, Hakone-Yumoto İstasyonu çıkışında.',
    coordinates: { latitude: 35.2327, longitude: 139.105 },
  },
];

export function getShopsInCity(city: City) {
  return SHOPS.filter((s) => s.city === city);
}
