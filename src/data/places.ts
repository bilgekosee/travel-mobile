// Uygulamanın verisi. Gerçek bir projede bu veri genelde bir API'den gelir.
// TypeScript "type" ile verinin şeklini tanımlıyoruz; yanlış alan yazarsak editör uyarır.

export type City = 'Tokyo' | 'Kyoto' | 'Osaka' | 'Nara' | 'Hiroshima' | 'Hakone';

// Wikimedia Commons fotoğrafı. Creative Commons lisansları fotoğrafçının adını ve lisansı
// belirtmeyi şart koşar (CC0 hariç); ekranda gösteriyoruz.
export type Photo = {
  uri: string;
  author: string;
  license: string;
  sourceUrl: string;
};

export type Place = {
  id: string;
  name: string;
  japaneseName: string;
  city: City;
  category: 'Tapınak' | 'Şehir' | 'Doğa' | 'Yemek' | 'Tarih';
  image: Photo;
  color: string; // Fotoğraf yüklenene kadar görünen zemin rengi
  summary: string;
  description: string;
  tips: string[];
  duration: string;
};

export type CityInfo = {
  id: string; // Adreste kullanılır: /city/kyoto
  name: City;
  japaneseName: string;
  tagline: string;
  image: Photo;
};

export const CITIES: CityInfo[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    japaneseName: '東京',
    tagline: 'Neon ışıkların ve asırlık tapınakların buluştuğu dev metropol.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Tokyo_Tower_2023.jpg/960px-Tokyo_Tower_2023.jpg',
      author: 'Akonnchiroll',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tokyo_Tower_2023.jpg',
    },
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    japaneseName: '京都',
    tagline: 'Bin yıllık imparatorluk başkenti: tapınaklar, bahçeler ve taş sokaklar.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg/960px-Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg',
      author: 'Basile Morin',
      license: 'CC BY-SA 4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_(Hokan-ji_Temple),_Kyoto,_Japan.jpg',
    },
  },
  {
    id: 'osaka',
    name: 'Osaka',
    japaneseName: '大阪',
    tagline: 'Japonya’nın mutfağı: sokak lezzetleri ve canlı gece hayatı.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Osaka_Dotonbori_Ebisu_Bridge.jpg/960px-Osaka_Dotonbori_Ebisu_Bridge.jpg',
      author: 'Type specimen',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Osaka_Dotonbori_Ebisu_Bridge.jpg',
    },
  },
  {
    id: 'nara',
    name: 'Nara',
    japaneseName: '奈良',
    tagline: 'Japonya’nın ilk kalıcı başkenti; dev Buda heykeli ve serbest dolaşan geyikler.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/T%C5%8Ddai-ji_Kon-d%C5%8D.jpg/960px-T%C5%8Ddai-ji_Kon-d%C5%8D.jpg',
      author: 'Wiiii',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:T%C5%8Ddai-ji_Kon-d%C5%8D.jpg',
    },
  },
  {
    id: 'hiroshima',
    name: 'Hiroshima',
    japaneseName: '広島',
    tagline: 'Barışın simgesi olan şehir ve denizde yüzüyormuş gibi duran torii kapısı.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Itsukushima_Shrine_Torii_Gate_%2813890465459%29.jpg/960px-Itsukushima_Shrine_Torii_Gate_%2813890465459%29.jpg',
      author: 'redlegsfan21',
      license: 'CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Itsukushima_Shrine_Torii_Gate_(13890465459).jpg',
    },
  },
  {
    id: 'hakone',
    name: 'Hakone',
    japaneseName: '箱根',
    tagline: 'Fuji manzarası, sıcak su kaynakları (onsen) ve dağ gölleri.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/260505_Moto-Hakone_Hakone_Japan01s3.jpg/960px-260505_Moto-Hakone_Hakone_Japan01s3.jpg',
      author: '663highland',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:260505_Moto-Hakone_Hakone_Japan01s3.jpg',
    },
  },
];

export const PLACES: Place[] = [
  {
    id: 'sensoji',
    name: 'Sensō-ji',
    japaneseName: '浅草寺',
    city: 'Tokyo',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Sensoji_2023.jpg/960px-Sensoji_2023.jpg',
      author: 'Akonnchiroll',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sensoji_2023.jpg',
    },
    color: '#C8102E',
    summary: "Tokyo'nun en eski Budist tapınağı, Asakusa'da.",
    description:
      "7. yüzyıla dayanan Sensō-ji, dev kırmızı fenerli Kaminarimon kapısıyla ünlü. Kapıdan tapınağa uzanan Nakamise caddesi geleneksel atıştırmalık ve hediyelik dükkanlarıyla dolu.",
    tips: [
      'Kalabalıktan kaçmak için sabah erken ya da akşam ışıklandırma saatinde gidin.',
      "Nakamise'de ningyō-yaki ve kaminari-okoshi tatlılarını deneyin.",
      "Yakındaki Sumida Nehri'nden Tokyo Skytree'yi görebilirsiniz.",
    ],
    duration: '1–2 saat',
  },
  {
    id: 'shibuya',
    name: 'Shibuya Kavşağı',
    japaneseName: '渋谷スクランブル交差点',
    city: 'Tokyo',
    category: 'Şehir',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Shibuya_Crossing%2C_Aerial.jpg/960px-Shibuya_Crossing%2C_Aerial.jpg',
      author: 'David Kernan',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shibuya_Crossing,_Aerial.jpg',
    },
    color: '#1F4E79',
    summary: 'Dünyanın en kalabalık yaya geçitlerinden biri.',
    description:
      "Her yeşil ışıkta yüzlerce kişi aynı anda her yönden karşıya geçer. İstasyon çıkışındaki sadık köpek Hachikō heykeli de buluşma noktası olarak ünlüdür.",
    tips: [
      'Kavşağı yukarıdan izlemek için Shibuya Sky seyir terasına çıkabilirsiniz.',
      'Akşam neon ışıkları yandığında daha etkileyici.',
    ],
    duration: '1 saat',
  },
  {
    id: 'meiji',
    name: 'Meiji Jingū',
    japaneseName: '明治神宮',
    city: 'Tokyo',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Meiji_Jingu_2023-3.jpg/960px-Meiji_Jingu_2023-3.jpg',
      author: 'Akonnchiroll',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Meiji_Jingu_2023-3.jpg',
    },
    color: '#5B7F3A',
    summary: 'Harajuku yanında, ormanla çevrili Şinto tapınağı.',
    description:
      "İmparator Meiji ve İmparatoriçe Shōken'e adanmış tapınak, şehrin ortasında yüz binden fazla ağaçtan oluşan bir ormanın içinde. Dev torii kapılarından geçerek ulaşılır.",
    tips: [
      'Hafta sonları geleneksel Şinto düğünlerine denk gelebilirsiniz.',
      'Çıkışta Takeshita Sokağı ve Omotesandō caddesine yürüyebilirsiniz.',
    ],
    duration: '1–1,5 saat',
  },
  {
    id: 'tsukiji',
    name: 'Tsukiji Dış Pazarı',
    japaneseName: '築地場外市場',
    city: 'Tokyo',
    category: 'Yemek',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Tsukiji_Outer_Market_-02.jpg/960px-Tsukiji_Outer_Market_-02.jpg',
      author: 'Aimaimyi',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tsukiji_Outer_Market_-02.jpg',
    },
    color: '#E07A1F',
    summary: 'Taze deniz ürünleri ve sokak lezzetleri pazarı.',
    description:
      "Toptan balık pazarı Toyosu'ya taşınsa da dış pazar hâlâ canlı. Taze suşi, tamagoyaki, deniz kestanesi ve daha fazlasını tezgahlarda tadabilirsiniz.",
    tips: [
      'Sabah erken gidin; birçok dükkan öğleden sonra kapanır.',
      'Bazı dükkanlar pazar ve çarşamba günleri kapalı olabilir.',
    ],
    duration: '1–2 saat',
  },
  {
    id: 'fushimi-inari',
    name: 'Fushimi Inari Taisha',
    japaneseName: '伏見稲荷大社',
    city: 'Kyoto',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg/960px-Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg',
      author: 'Basile Morin',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg',
    },
    color: '#E4572E',
    summary: 'Binlerce turuncu torii kapısıyla ünlü tapınak.',
    description:
      "Pirinç ve bereket tanrısı Inari'ye adanmış bu tapınağın arkasındaki Inari Dağı'na binlerce torii kapısından oluşan patikalar tırmanır. Tepeye çıkıp inmek 2–3 saat sürebilir.",
    tips: [
      '7/24 açık: sabahın erken saatlerinde neredeyse boş olur.',
      'Yolun ortalarındaki Yotsutsuji kavşağından Kyoto manzarası harika.',
      'Rahat ayakkabı giyin, çok merdiven var.',
    ],
    duration: '2–3 saat',
  },
  {
    id: 'kinkakuji',
    name: 'Kinkaku-ji',
    japaneseName: '金閣寺',
    city: 'Kyoto',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg/960px-Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg',
      author: 'Nacaru',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg',
    },
    color: '#AD8A1A', // Beyaz yazı okunsun diye koyu altın (kontrast 3.27:1)
    summary: 'Gölün üzerinde parlayan Altın Köşk.',
    description:
      'Üst iki katı altın varakla kaplı Zen tapınağı, önündeki göle yansımasıyla Japonya’nın en çok fotoğraflanan yerlerinden biri.',
    tips: [
      'Güneşli günlerde yansıma çok daha etkileyici.',
      "Yakındaki Ryōan-ji'nin taş bahçesiyle birlikte gezilebilir.",
    ],
    duration: '1 saat',
  },
  {
    id: 'arashiyama',
    name: 'Arashiyama Bambu Ormanı',
    japaneseName: '嵐山竹林',
    city: 'Kyoto',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Bamboo_Grove%2C_Arashiyama%2C_Kyoto%2C_Japan.jpg/960px-Bamboo_Grove%2C_Arashiyama%2C_Kyoto%2C_Japan.jpg',
      author: 'Basile Morin',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bamboo_Grove,_Arashiyama,_Kyoto,_Japan.jpg',
    },
    color: '#3E8E41',
    summary: 'Yükselen bambuların arasından geçen patika.',
    description:
      "Kyoto'nun batısındaki Arashiyama bölgesinde, gökyüzüne uzanan bambuların arasında yürüyüş. Yakındaki Tenryū-ji tapınağı ve Togetsukyō köprüsü de görülmeye değer.",
    tips: [
      'Gündüz çok kalabalık; sabah 8’den önce gitmeyi deneyin.',
      "Tepedeki Iwatayama Maymun Parkı'ndan şehir manzarası görülür.",
    ],
    duration: 'Yarım gün',
  },
  {
    id: 'dotonbori',
    name: 'Dōtonbori',
    japaneseName: '道頓堀',
    city: 'Osaka',
    category: 'Yemek',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/960px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dotonbori,_Osaka,_at_night,_November_2016.jpg',
    },
    color: '#D7263D',
    summary: "Osaka'nın neon ışıklı yemek ve eğlence caddesi.",
    description:
      "Kanal kenarındaki bu cadde dev tabelaları, ünlü Glico koşucusu reklamı ve sokak yemekleriyle meşhur. Osaka'ya 'Japonya'nın mutfağı' denmesinin nedenini burada anlarsınız.",
    tips: [
      'Takoyaki ve okonomiyaki mutlaka denenmeli.',
      'Akşamları ışıklar yandığında gidin.',
    ],
    duration: '2–3 saat',
  },
  {
    id: 'osaka-castle',
    name: 'Osaka Kalesi',
    japaneseName: '大阪城',
    city: 'Osaka',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Osaka_Castle_03bs3200.jpg/960px-Osaka_Castle_03bs3200.jpg',
      author: '663highland',
      license: 'CC BY 2.5',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Osaka_Castle_03bs3200.jpg',
    },
    color: '#2E5E4E',
    summary: 'Geniş bir parkın içindeki tarihi kale.',
    description:
      "16. yüzyılda Toyotomi Hideyoshi tarafından yaptırılan kalenin bugünkü kulesi bir yeniden yapım; içinde şehrin tarihini anlatan bir müze var. Çevresindeki park bahar aylarında kiraz çiçekleriyle dolar.",
    tips: [
      'Kulenin tepesindeki gözlem katından Osaka manzarası görülür.',
      'Hendeklerde tekne turu yapılabiliyor.',
    ],
    duration: '2 saat',
  },
  {
    id: 'nara-park',
    name: 'Nara Parkı ve Tōdai-ji',
    japaneseName: '奈良公園・東大寺',
    city: 'Nara',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Deer_at_Todaiji_%282%29.jpg/960px-Deer_at_Todaiji_%282%29.jpg',
      author: 'Immanuel Giel',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Deer_at_Todaiji_(2).jpg',
    },
    color: '#8B5E34',
    summary: 'Serbest dolaşan geyikler ve dev Buda heykeli.',
    description:
      "Nara Parkı'nda yüzlerce geyik serbestçe dolaşır. Parkın içindeki Tōdai-ji tapınağı, dünyanın en büyük bronz Buda heykellerinden birine ev sahipliği yapar.",
    tips: [
      'Geyik krakerini (shika senbei) parktaki tezgahlardan alabilirsiniz; geyikler selam verir gibi eğilir.',
      "Kyoto ya da Osaka'dan günübirlik gezi olarak kolayca gidilir.",
    ],
    duration: 'Yarım gün',
  },
  {
    id: 'peace-park',
    name: 'Barış Anıtı Parkı',
    japaneseName: '平和記念公園',
    city: 'Hiroshima',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/20181111_Hiroshima_Memorial_Cenotaph-1.jpg/960px-20181111_Hiroshima_Memorial_Cenotaph-1.jpg',
      author: 'Balon Greyjoy',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:20181111_Hiroshima_Memorial_Cenotaph-1.jpg',
    },
    color: '#4A6FA5',
    summary: "1945 atom bombasının anısına kurulan park ve müze.",
    description:
      'Park, Atom Bombası Kubbesi (Genbaku Dome), Barış Anıtı Müzesi ve anıtları kapsar. Ziyaretçilere savaşın yıkıcılığını ve barışın önemini hatırlatan etkileyici bir yer.',
    tips: [
      'Müze için en az 1,5–2 saat ayırın.',
      "Buradan feribotla Miyajima adasına geçebilirsiniz.",
    ],
    duration: 'Yarım gün',
  },
  {
    id: 'miyajima',
    name: 'Miyajima – Itsukushima',
    japaneseName: '厳島神社',
    city: 'Hiroshima',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Miyajima_Island.jpg/960px-Miyajima_Island.jpg',
      author: 'Bernard Gagnon',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Miyajima_Island.jpg',
    },
    color: '#B22222',
    summary: 'Denizin üzerinde "yüzen" dev torii kapısı.',
    description:
      "Hiroshima yakınındaki Miyajima adasında bulunan Itsukushima tapınağının torii kapısı, gelgitte suyun üzerinde yüzüyormuş gibi görünür. Adada serbest dolaşan geyikler de var.",
    tips: [
      'Gelgit saatlerine bakın: yüksek suda yüzen görüntü, alçak suda kapıya yürüme imkanı.',
      "Misen Dağı'na teleferikle çıkabilirsiniz.",
    ],
    duration: '1 gün',
  },
  {
    id: 'hakone',
    name: 'Hakone ve Ashi Gölü',
    japaneseName: '箱根・芦ノ湖',
    city: 'Hakone',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Owakudani_-_Hakone_%2827369344357%29.jpg/960px-Owakudani_-_Hakone_%2827369344357%29.jpg',
      author: 'Ajay Suresh from New York, NY, USA',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Owakudani_-_Hakone_(27369344357).jpg',
    },
    color: '#2A7F9E',
    summary: 'Kaplıcalar, göl ve açık havada Fuji manzarası.',
    description:
      "Tokyo'ya yaklaşık 1,5 saat uzaklıktaki Hakone, onsen (kaplıca) otelleri, Ashi Gölü'ndeki korsan gemisi görünümlü tekneleri ve Ōwakudani volkanik vadisiyle bilinir.",
    tips: [
      'Hakone Free Pass bölgedeki çoğu ulaşımı kapsar.',
      "Ōwakudani'de kükürtlü suda pişen siyah yumurtaları (kuro-tamago) deneyin.",
      'Fuji manzarası için açık bir gün seçin.',
    ],
    duration: '1–2 gün',
  },
];

export function getPlace(id: string) {
  return PLACES.find((p) => p.id === id);
}

export function getCity(id: string) {
  return CITIES.find((c) => c.id === id);
}

export function getPlacesInCity(city: City) {
  return PLACES.filter((p) => p.city === city);
}
