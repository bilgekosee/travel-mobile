// Şehir sayfasındaki rehber bölümlerinin verisi (hızlı bilgi, rota, yemek, pratik bilgi).
// Not: Ulaşım süreleri ve kurallar yaklaşık/genel bilgidir; gerçek bir uygulamada resmi kaynaklardan doğrulanmalı.

import type { DaySlot } from '@/constants/day-slots';
import type { Photo } from '@/data/places';

export type Food = {
  name: string;
  japaneseName: string;
  description: string;
  ingredients: string[];
  image: Photo;
};

export type DayPlanStep = {
  time: DaySlot; // 'Sabah' | 'Öğle' | 'Akşam' (Planım ile ortak)
  title: string;
  placeId?: string; // Uygulamada detay sayfası varsa oraya bağlanır
};

export type CityGuide = {
  bestTime: string;
  duration: string;
  access: string;
  dayPlan: DayPlanStep[];
  foods: Food[];
  tips: string[];
};

// Anahtar = CityInfo.id
export const CITY_GUIDES: Record<string, CityGuide> = {
  tokyo: {
    bestTime: 'Mart–Nisan, Ekim–Kasım',
    duration: '3–4 gün',
    access: 'Haneda’dan trenle ~30 dk, Narita’dan ~1 saat',
    dayPlan: [
      { time: 'Sabah', title: 'Asakusa’da Sensō-ji', placeId: 'sensoji' },
      {
        time: 'Öğle',
        title: 'Tsukiji Dış Pazarı’nda deniz ürünleri',
        placeId: 'tsukiji',
      },
      {
        time: 'Akşam',
        title: 'Shibuya Kavşağı’nın ışıkları',
        placeId: 'shibuya',
      },
    ],
    foods: [
      {
        name: 'Sushi',
        japaneseName: '寿司',
        description: 'Edo-mae tarzı sushi Tokyo’da doğdu.',
        ingredients: ['Sirkeli pirinç', 'Çiğ balık (ton, somon…)', 'Nori (deniz yosunu)', 'Wasabi', 'Soya sosu'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/960px-Sushi_platter.jpg',
          author: 'chidorian from Japan',
          license: 'CC BY-SA 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sushi_platter.jpg',
        },
      },
      {
        name: 'Monjayaki',
        japaneseName: 'もんじゃ焼き',
        description: 'Sacda pişen, akışkan bir hamur yemeği; Tsukishima’da meşhur.',
        ingredients: ['Dashi (balık-yosun suyu)', 'Un', 'Lahana', 'Mentaiko ya da deniz ürünleri', 'Worcester sosu'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Monja_After_DSCN2754_20111028.JPG/960px-Monja_After_DSCN2754_20111028.JPG',
          author: 'Ogiyoshisan',
          license: 'CC BY-SA 3.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Monja_After_DSCN2754_20111028.JPG',
        },
      },
      {
        name: 'Ramen',
        japaneseName: 'ラーメン',
        description: 'Tokyo usulü soya soslu (shōyu) ramen.',
        ingredients: [
          'Buğday eriştesi',
          'Soya soslu et suyu',
          'Chāshū (domuz eti)',
          'Menma (bambu filizi)',
          'Narutomaki (balık keki)',
          'Yeşil soğan',
        ],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg/960px-Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg',
          author: 'Quercus acuta',
          license: 'CC BY-SA 4.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg',
        },
      },
    ],
    tips: [
      'Suica veya PASMO IC kartı metroda, trenlerde ve marketlerde geçer.',
      'JR Pass, JR Yamanote hattında geçerlidir ama metroda geçmez.',
      'Sabah 8–9 arası banliyö trenleri çok kalabalıktır.',
    ],
  },
  kyoto: {
    bestTime: 'Mart–Nisan (sakura), Kasım (sonbahar yaprakları)',
    duration: '2–3 gün',
    access: 'Tokyo’dan Shinkansen ile ~2 saat 15 dk',
    dayPlan: [
      {
        time: 'Sabah',
        title: 'Kalabalık başlamadan Fushimi Inari',
        placeId: 'fushimi-inari',
      },
      { time: 'Öğle', title: 'Altın Köşk: Kinkaku-ji', placeId: 'kinkakuji' },
      { time: 'Akşam', title: 'Gion’un taş sokaklarında yürüyüş' },
    ],
    foods: [
      {
        name: 'Yudofu',
        japaneseName: '湯豆腐',
        description: 'Sıcak suda pişirilen yumuşak tofu; tapınak mutfağından.',
        ingredients: ['Tofu', 'Kombu (deniz yosunu) suyu', 'Ponzu ya da soya sosu', 'Yeşil soğan'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Yud%C5%8Dfu_001.jpg/960px-Yud%C5%8Dfu_001.jpg',
          author: 'Flickr user cobacco(hiro kobashi)',
          license: 'CC BY 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yud%C5%8Dfu_001.jpg',
        },
      },
      {
        name: 'Matcha tatlıları',
        japaneseName: '抹茶',
        description: 'Yakındaki Uji bölgesinin yeşil çayıyla yapılan tatlılar.',
        ingredients: [
          'Matcha (toz yeşil çay)',
          'Dondurma ya da krema',
          'Anko (tatlı kırmızı fasulye)',
          'Shiratama (pirinç unu topları)',
        ],
        image: {
          uri: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Tokyo_Parfait_-_lots_of_matcha_with_adzuki_hidden_on_the_bottom._%2814226988754%29.jpg',
          author: 'Arnold Gatilao from Oakland, CA, USA',
          license: 'CC BY 2.0',
          sourceUrl:
            'https://commons.wikimedia.org/wiki/File:Tokyo_Parfait_-_lots_of_matcha_with_adzuki_hidden_on_the_bottom._(14226988754).jpg',
        },
      },
      {
        name: 'Kaiseki',
        japaneseName: '懐石',
        description: 'Mevsimlik malzemelerle çok tabaklı geleneksel yemek.',
        ingredients: ['Mevsimlik sebzeler', 'Sashimi', 'Izgara balık', 'Tofu', 'Pirinç', 'Miso çorbası'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Jisaku_Kaiseki_Ryori_01.jpg/960px-Jisaku_Kaiseki_Ryori_01.jpg',
          author: '',
          license: 'CC BY-SA 3.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jisaku_Kaiseki_Ryori_01.jpg',
        },
      },
    ],
    tips: [
      'Şehir içinde metro sınırlı; otobüs ve yürüyüş en yaygın ulaşım.',
      'Popüler tapınakları sabah erken saatlerde ziyaret edin.',
      'Gion’da geyşaları izinsiz fotoğraflamak hoş karşılanmaz.',
    ],
  },
  osaka: {
    bestTime: 'Mart–Mayıs, Ekim–Kasım',
    duration: '1–2 gün',
    access: 'Tokyo’dan Shinkansen ile ~2,5 saat; Kyoto’dan trenle ~30 dk',
    dayPlan: [
      {
        time: 'Sabah',
        title: 'Osaka Kalesi ve parkı',
        placeId: 'osaka-castle',
      },
      { time: 'Öğle', title: 'Kuromon Pazarı’nda sokak lezzetleri' },
      { time: 'Akşam', title: 'Dōtonbori’nin neonları', placeId: 'dotonbori' },
    ],
    foods: [
      {
        name: 'Takoyaki',
        japaneseName: 'たこ焼き',
        description: 'İçinde ahtapot olan top şeklinde hamur; sıcak yenir!',
        ingredients: [
          'Un',
          'Dashi',
          'Ahtapot',
          'Tenkasu (tempura kırıntısı)',
          'Takoyaki sosu',
          'Katsuobushi (balık pulu)',
          'Mayonez',
        ],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Takoyaki_is_served%3B_November_2010.jpg/960px-Takoyaki_is_served%3B_November_2010.jpg',
          author: 'gaku.',
          license: 'CC BY 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Takoyaki_is_served;_November_2010.jpg',
        },
      },
      {
        name: 'Okonomiyaki',
        japaneseName: 'お好み焼き',
        description: 'Lahana ve hamurla yapılan, sacda pişen “Japon pizzası”.',
        ingredients: [
          'Un',
          'Yumurta',
          'Lahana',
          'Domuz eti ya da deniz ürünleri',
          'Okonomiyaki sosu',
          'Mayonez',
          'Katsuobushi',
        ],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Okonomiyaki_001.jpg/960px-Okonomiyaki_001.jpg',
          author: 'ume-y',
          license: 'CC BY 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Okonomiyaki_001.jpg',
        },
      },
      {
        name: 'Kushikatsu',
        japaneseName: '串カツ',
        description: 'Kızarmış şişler. Ortak sosa iki kez batırmak yasaktır.',
        ingredients: ['Et, deniz ürünü ve sebze şişleri', 'Panko (ekmek kırıntısı)', 'Worcester bazlı sos'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/KushikatsuDaruma01.jpg/960px-KushikatsuDaruma01.jpg',
          author: 'Aiko99ann',
          license: 'CC BY-SA 3.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:KushikatsuDaruma01.jpg',
        },
      },
    ],
    tips: [
      'Osaka’da yürüyen merdivende sağda durulur (Tokyo’da solda).',
      'Kansai bölgesinde ICOCA kartı kullanılır; Suica da geçerlidir.',
      'Osaka “kuidaore” şehridir: “yiye yiye iflas et” anlamına gelir.',
    ],
  },
  nara: {
    bestTime: 'Mart–Nisan, Kasım',
    duration: 'Yarım gün – 1 gün',
    access: 'Kyoto veya Osaka’dan trenle ~35–50 dk',
    dayPlan: [
      { time: 'Sabah', title: 'Nara Parkı ve Tōdai-ji', placeId: 'nara-park' },
      { time: 'Öğle', title: 'Fenerleriyle ünlü Kasuga Taisha' },
      { time: 'Akşam', title: 'Kyoto veya Osaka’ya dönüş' },
    ],
    foods: [
      {
        name: 'Kakinoha-zushi',
        japaneseName: '柿の葉寿司',
        description: 'Hurma yaprağına sarılmış sushi.',
        ingredients: ['Sirkeli pirinç', 'Tuzlanmış uskumru ya da somon', 'Hurma (kaki) yaprağı'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Kakinoha_%28persimmon_leaf%29_sushi_in_Nara.jpg/960px-Kakinoha_%28persimmon_leaf%29_sushi_in_Nara.jpg',
          author: 'ZhengZhou',
          license: 'CC BY-SA 4.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kakinoha_(persimmon_leaf)_sushi_in_Nara.jpg',
        },
      },
      {
        name: 'Kuzumochi',
        japaneseName: '葛餅',
        description: 'Kudzu nişastasından yapılan jöle kıvamında tatlı.',
        ingredients: ['Kudzu nişastası', 'Şeker', 'Kinako (kavrulmuş soya unu)', 'Kuromitsu (esmer şeker şurubu)'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Kuzumochi_001.jpg/960px-Kuzumochi_001.jpg',
          author: 'Ocdp',
          license: 'CC0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kuzumochi_001.jpg',
        },
      },
      {
        name: 'Miwa sōmen',
        japaneseName: '三輪素麺',
        description: 'Sōmen’in doğduğu yer olarak bilinen Miwa’nın ince eriştesi; yazın soğuk yenir.',
        ingredients: ['İnce buğday eriştesi', 'Soğuk tsuyu sosu', 'Yeşil soğan', 'Zencefil'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Miwa_somen_01.jpg/960px-Miwa_somen_01.jpg',
          author: 'ちぃこ',
          license: 'CC BY 2.1 jp',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Miwa_somen_01.jpg',
        },
      },
    ],
    tips: [
      'Geyik krakerleri (shika senbei) parkta satılır; geyikler selam verir gibi eğilir.',
      'Geyikler yiyecek kokusu alınca ısrarcı olabilir; kağıt ve poşetleri saklayın.',
      'Önemli yerlerin çoğu yürüme mesafesindedir.',
    ],
  },
  hiroshima: {
    bestTime: 'Mart–Mayıs, Ekim–Kasım',
    duration: '1–2 gün',
    access: 'Osaka’dan Shinkansen ile ~1,5 saat; Tokyo’dan ~4 saat',
    dayPlan: [
      {
        time: 'Sabah',
        title: 'Barış Anıtı Parkı ve Müzesi',
        placeId: 'peace-park',
      },
      {
        time: 'Öğle',
        title: 'Feribotla Miyajima adasına geçiş',
        placeId: 'miyajima',
      },
      {
        time: 'Akşam',
        title: 'Itsukushima torii’sinde gün batımı',
        placeId: 'miyajima',
      },
    ],
    foods: [
      {
        name: 'Hiroshima usulü okonomiyaki',
        japaneseName: '広島風お好み焼き',
        description: 'Osaka’dakinden farklı: katmanlı ve içinde erişte var.',
        ingredients: [
          'İnce krep hamuru',
          'Lahana',
          'Soba ya da udon eriştesi',
          'Domuz eti',
          'Yumurta',
          'Okonomiyaki sosu',
          'Yeşil soğan',
        ],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Okonomiyaki_in_Hiroshima_style_%285808057511%29.jpg/960px-Okonomiyaki_in_Hiroshima_style_%285808057511%29.jpg',
          author: 'pelican from Tokyo, Japan',
          license: 'CC BY-SA 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Okonomiyaki_in_Hiroshima_style_(5808057511).jpg',
        },
      },
      {
        name: 'İstiridye',
        japaneseName: '牡蠣',
        description: 'Hiroshima körfezi Japonya’nın istiridye merkezi.',
        ingredients: ['Taze istiridye', 'Soya sosu', 'Limon ya da yuzu', 'Panko (kızartması için)'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Grilled_oysters_-_Food_in_Miyajima_-_DSC02187.JPG/960px-Grilled_oysters_-_Food_in_Miyajima_-_DSC02187.JPG',
          author: 'Daderot',
          license: 'Public domain',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Grilled_oysters_-_Food_in_Miyajima_-_DSC02187.JPG',
        },
      },
      {
        name: 'Momiji manjū',
        japaneseName: 'もみじ饅頭',
        description: 'Akçaağaç yaprağı şeklinde, Miyajima’nın meşhur keki.',
        ingredients: ['Un', 'Yumurta', 'Şeker', 'Anko (tatlı kırmızı fasulye)'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Momiji_Manju_Hiroshima.JPG/960px-Momiji_Manju_Hiroshima.JPG',
          author: 'NY066',
          license: 'CC BY-SA 3.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Momiji_Manju_Hiroshima.JPG',
        },
      },
    ],
    tips: [
      'Miyajima feribotlarından biri JR’ye aittir ve JR Pass ile kullanılabilir.',
      'Torii gelgitte suyun içinde görünür, cezirde yürüyerek yanına gidilebilir.',
      'Miyajima’ya girişte küçük bir ziyaretçi vergisi alınır.',
    ],
  },
  hakone: {
    bestTime: 'Nisan–Mayıs, Ekim–Kasım (Fuji için kış en net)',
    duration: '1–2 gün',
    access: 'Tokyo Shinjuku’dan Romancecar treniyle ~1,5 saat',
    dayPlan: [
      { time: 'Sabah', title: 'Dağ treniyle (Tozan) yukarı çıkış' },
      { time: 'Öğle', title: 'Teleferikle Ōwakudani’ye' },
      { time: 'Akşam', title: 'Ashi Gölü ve onsen keyfi', placeId: 'hakone' },
    ],
    foods: [
      {
        name: 'Kuro-tamago',
        japaneseName: '黒たまご',
        description: 'Kükürtlü suda kararan yumurta; ömrü uzattığına inanılır.',
        ingredients: ['Tavuk yumurtası', 'Kükürtlü volkanik kaynak suyu'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Kuro-Tamago.JPG/960px-Kuro-Tamago.JPG',
          author: 'AmwayIsACult',
          license: 'CC BY-SA 3.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kuro-Tamago.JPG',
        },
      },
      {
        name: 'Soba',
        japaneseName: 'そば',
        description: 'Karabuğday eriştesi; dağ suyu ile ünlü.',
        ingredients: ['Karabuğday unu', 'Tsuyu (daldırma sosu)', 'Wasabi', 'Yeşil soğan', 'Nori'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Zaru_soba_by_spinachdip.jpg/960px-Zaru_soba_by_spinachdip.jpg',
          author: 'spinachdip from Minamikiso, Nagano',
          license: 'CC BY-SA 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zaru_soba_by_spinachdip.jpg',
        },
      },
      {
        name: 'Yuba',
        japaneseName: '湯葉',
        description: 'Soya sütünün kaymağı; Hakone’de pilav üstünde servis edilir.',
        ingredients: ['Soya sütü kaymağı', 'Dashi ya da soya sosu'],
        image: {
          uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yuba_-_Tofu_Skin_%288748788819%29.jpg/960px-Yuba_-_Tofu_Skin_%288748788819%29.jpg',
          author: 'Veganbaking.net from USA',
          license: 'CC BY-SA 2.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yuba_-_Tofu_Skin_(8748788819).jpg',
        },
      },
    ],
    tips: [
      'Hakone Free Pass bölgedeki tren, teleferik ve teknelerin çoğunu kapsar.',
      'Onsen’e girmeden önce mutlaka yıkanılır; mayo ile girilmez.',
      'Bazı onsenler dövmeli misafirleri kabul etmeyebilir, önceden kontrol edin.',
    ],
  },
};

export function getCityGuide(cityId: string) {
  return CITY_GUIDES[cityId];
}
