// Uygulamanın verisi. Gerçek bir projede bu veri genelde bir API'den gelir.
// TypeScript "type" ile verinin şeklini tanımlıyoruz; yanlış alan yazarsak editör uyarır.

export type City =
  | 'Tokyo'
  | 'Kyoto'
  | 'Osaka'
  | 'Nara'
  | 'Hiroshima'
  | 'Hakone'
  | 'Fuji'
  | 'Kamakura'
  | 'Nikkō'
  | 'Kanazawa'
  | 'Himeji'
  | 'Shirakawa-gō';

// Wikimedia Commons fotoğrafı. Creative Commons lisansları fotoğrafçının adını ve lisansı
// belirtmeyi şart koşar (CC0 hariç); ekranda gösteriyoruz.
export type Photo = {
  uri: string;
  author: string;
  license: string;
  sourceUrl: string;
};

// Enlem (kuzey-güney) ve boylam (doğu-batı). react-native-maps de bu iki alan adını kullanıyor.
export type Coordinates = { latitude: number; longitude: number };

export type Place = {
  id: string;
  name: string;
  japaneseName: string;
  city: City;
  category: 'Tapınak' | 'Şehir' | 'Doğa' | 'Yemek' | 'Tarih' | 'Sanat' | 'Eğlence';
  image: Photo;
  color: string; // Fotoğraf yüklenene kadar görünen zemin rengi
  summary: string;
  description: string;
  tips: string[];
  duration: string;
  coordinates: Coordinates; // Haritadaki pinin yeri
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
  {
    // Fuji Dağı'nı görmek için gidilen yer: kuzey eteğindeki göller bölgesi (Kawaguchiko çevresi)
    id: 'fuji',
    name: 'Fuji',
    japaneseName: '富士五湖',
    tagline: 'Fuji Dağı’nın eteğinde beş göl, kırmızı bir pagoda ve dağın kar sularıyla dolan kaynaklar.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG',
      author: 'Midori',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG',
    },
  },
  {
    id: 'kamakura',
    name: 'Kamakura',
    japaneseName: '鎌倉',
    tagline: 'Tokyo’ya bir saat uzaklıkta, samuray başkenti: dev Buda, tapınaklar ve deniz kıyısı.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/The_Great_Buddha_of_K%C5%8Dtoku-in_%28Kamakura_Daibutsu%29.jpg/960px-The_Great_Buddha_of_K%C5%8Dtoku-in_%28Kamakura_Daibutsu%29.jpg',
      author: 'Dandy1022',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Great_Buddha_of_Kōtoku-in_(Kamakura_Daibutsu).jpg',
    },
  },
  {
    id: 'nikko',
    name: 'Nikkō',
    japaneseName: '日光',
    tagline: 'Dağların arasında altın süslemeli tapınaklar, şelaleler ve göller.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Nikko_Toshogu_Yomeimon_Gate_2024.jpg/960px-Nikko_Toshogu_Yomeimon_Gate_2024.jpg',
      author: 'Jpatokal',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nikko_Toshogu_Yomeimon_Gate_2024.jpg',
    },
  },
  {
    id: 'kanazawa',
    name: 'Kanazawa',
    japaneseName: '金沢',
    tagline: 'Japonya’nın en ünlü bahçesi, eski geyşa sokakları ve altın varak.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Kenroku-en_Gankobashi_under_blooming_sakura.jpg/960px-Kenroku-en_Gankobashi_under_blooming_sakura.jpg',
      author: 'SOHAFun',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kenroku-en_Gankobashi_under_blooming_sakura.jpg',
    },
  },
  {
    id: 'himeji',
    name: 'Himeji',
    japaneseName: '姫路',
    tagline: 'Savaşlardan sağ çıkmış, bembeyaz “Beyaz Balıkçıl Kalesi”.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Himeji_Castle%2C_November_2016_-02.jpg/960px-Himeji_Castle%2C_November_2016_-02.jpg',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Himeji_Castle,_November_2016_-02.jpg',
    },
  },
  {
    id: 'shirakawago',
    name: 'Shirakawa-gō',
    japaneseName: '白川郷',
    tagline: 'Dağ vadisinde, kalın saz çatılı masalsı çiftlik evleri.',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Shirakawa-go_20170202-3.jpg/960px-Shirakawa-go_20170202-3.jpg',
      author: 'Suicasmo',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shirakawa-go_20170202-3.jpg',
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
    coordinates: { latitude: 35.7148, longitude: 139.7967 },
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
    coordinates: { latitude: 35.6595, longitude: 139.7005 },
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
    coordinates: { latitude: 35.6764, longitude: 139.6993 },
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
    coordinates: { latitude: 35.6654, longitude: 139.7707 },
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
    coordinates: { latitude: 34.9671, longitude: 135.7727 },
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
    coordinates: { latitude: 35.0394, longitude: 135.7292 },
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
    coordinates: { latitude: 35.017, longitude: 135.6713 },
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
    coordinates: { latitude: 34.6687, longitude: 135.5013 },
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
    coordinates: { latitude: 34.6873, longitude: 135.5262 },
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
    coordinates: { latitude: 34.689, longitude: 135.8398 },
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
    coordinates: { latitude: 34.3955, longitude: 132.4536 },
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
    coordinates: { latitude: 34.2959, longitude: 132.3199 },
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
    // Gölün ortası. (Eskiden tam Hakone Tapınağı'nın üstündeydi; tapınak ayrı bir yer olunca pinler üst üste binerdi.)
    coordinates: { latitude: 35.219, longitude: 139.0 },
  },

  // --- Tokyo ---
  {
    id: 'skytree',
    name: 'Tokyo Skytree',
    japaneseName: '東京スカイツリー',
    city: 'Tokyo',
    category: 'Şehir',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Tokyo_Skytree_2023.jpg/960px-Tokyo_Skytree_2023.jpg',
      author: 'Akonnchiroll',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tokyo_Skytree_2023.jpg',
    },
    color: '#5B7FA6',
    summary: '634 metrelik dünyanın en yüksek kulesi ve iki seyir terası.',
    description:
      '2012’de açılan Skytree, 350 ve 450 metredeki seyir teraslarından Tokyo’yu ufka kadar gösterir; açık havada Fuji Dağı bile seçilebilir. Altındaki Solamachi’de yüzlerce dükkan ve restoran var.',
    tips: [
      'Biletleri internetten önceden alırsanız kuyrukta beklemezsiniz.',
      'En net manzara için sabah erken ya da gün batımı saatini seçin.',
      'Sensō-ji’ye yaklaşık 20 dakika yürüme mesafesinde; ikisini aynı güne koyun.',
    ],
    duration: '1,5–2 saat',
    coordinates: { latitude: 35.7101, longitude: 139.8107 },
  },
  {
    id: 'shinjuku-gyoen',
    name: 'Shinjuku Gyoen',
    japaneseName: '新宿御苑',
    city: 'Tokyo',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Shinjuku_Gyoen_National_Garden%2C_Tokyo%2C_20240822_1447_5457.jpg/960px-Shinjuku_Gyoen_National_Garden%2C_Tokyo%2C_20240822_1447_5457.jpg',
      author: 'Jakub Hałun',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shinjuku_Gyoen_National_Garden,_Tokyo,_20240822_1447_5457.jpg',
    },
    color: '#4E7D3A',
    summary: 'Gökdelenlerin ortasında eski imparatorluk bahçesi.',
    description:
      'Bir zamanlar imparatorluk ailesine ait olan bahçe; Japon, İngiliz ve Fransız tarzı bölümleri bir arada barındırır. Bahar başında binden fazla kiraz ağacıyla Tokyo’nun en sevilen hanami (çiçek seyri) yerlerinden biridir.',
    tips: [
      'Giriş ücretli ve parka alkol sokmak yasak; piknik için ideal ama sakin bir yer.',
      'Genellikle pazartesileri kapalı; gitmeden önce saatlere bakın.',
      'Kiraz mevsiminde kalabalık olur, hafta içi sabah gidin.',
    ],
    duration: '1–2 saat',
    coordinates: { latitude: 35.6852, longitude: 139.71 },
  },
  {
    id: 'ueno',
    name: 'Ueno Parkı',
    japaneseName: '上野公園',
    city: 'Tokyo',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Shinobazu_pond_%40_Ueno_Park_%2814273619522%29.jpg/960px-Shinobazu_pond_%40_Ueno_Park_%2814273619522%29.jpg',
      author: 'Guilhem Vellut from Annecy, France',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shinobazu_pond_@_Ueno_Park_(14273619522).jpg',
    },
    color: '#5C7F4E',
    summary: 'Müzeler, hayvanat bahçesi ve nilüferli bir gölet tek parkta.',
    description:
      'Tokyo’nun ilk halk parklarından biri. İçinde Tokyo Ulusal Müzesi başta olmak üzere birkaç büyük müze ve Ueno Hayvanat Bahçesi var. Yazın Shinobazu Göleti’ni dev nilüferler kaplar; baharda yollar kiraz ağaçlarıyla çevrilir.',
    tips: [
      'Japon sanatını görmek için Tokyo Ulusal Müzesi en iyi başlangıç noktası.',
      'Kiraz mevsiminde Tokyo’nun en kalabalık hanami yerlerinden biri; sabah erken gidin.',
      'Parkın hemen yanındaki Ameyoko pazarında sokak yemekleri ve ucuz alışveriş var.',
    ],
    duration: 'Yarım gün',
    coordinates: { latitude: 35.7146, longitude: 139.7714 },
  },
  {
    id: 'imperial-palace',
    name: 'İmparatorluk Sarayı',
    japaneseName: '皇居',
    city: 'Tokyo',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Imperial_Palace_Tokyo_Nijubashi_Bridge.JPG/960px-Imperial_Palace_Tokyo_Nijubashi_Bridge.JPG',
      author: 'Chris 73',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Imperial_Palace_Tokyo_Nijubashi_Bridge.JPG',
    },
    color: '#4F5B4A',
    summary: 'Hendeklerle çevrili, imparator ailesinin yaşadığı saray.',
    description:
      'Eski Edo Kalesi’nin yerinde bulunan saray bugün de imparator ailesinin evi. Sarayın kendisine girilemez ama Doğu Bahçeleri halka açıktır; ön meydandan taş Nijūbashi köprüsü ve arkasındaki kale kulesi görünür.',
    tips: [
      'Doğu Bahçeleri’ne giriş ücretsiz; genellikle pazartesi ve cuma kapalı.',
      'Sarayın iç alanı için internetten ücretsiz rehberli tura kayıt olabilirsiniz.',
      'Hendeği çevreleyen 5 km’lik yol, Tokyo’nun en sevilen koşu parkuru.',
    ],
    duration: '1–2 saat',
    coordinates: { latitude: 35.68, longitude: 139.7528 },
  },

  // --- Kyoto ---
  {
    id: 'kiyomizu',
    name: 'Kiyomizu-dera',
    japaneseName: '清水寺',
    city: 'Kyoto',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Kiyomizu-dera%2C_Kyoto%2C_November_2016_-01.jpg/960px-Kiyomizu-dera%2C_Kyoto%2C_November_2016_-01.jpg',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kiyomizu-dera,_Kyoto,_November_2016_-01.jpg',
    },
    color: '#B5462E',
    summary: 'Ahşap terasıyla tepeden Kyoto’ya bakan UNESCO tapınağı.',
    description:
      '778’de kurulan tapınağın ana salonu, yamaca dikilmiş yüzlerce ahşap sütunun taşıdığı büyük bir terasa açılır. Aşağıdaki Otowa Şelalesi’nin üç kolundan su içmenin uzun ömür, aşk ve başarı getirdiğine inanılır.',
    tips: [
      'Tapınağa Sannenzaka ve Ninenzaka’nın taş yokuşlarından yürüyerek çıkın.',
      'Sabah açılışta gidin; öğleden sonra okul gezileriyle çok kalabalık olur.',
      'İlkbahar ve sonbaharda akşam ışıklandırmaları yapılır.',
    ],
    duration: '1,5–2 saat',
    coordinates: { latitude: 34.9949, longitude: 135.785 },
  },
  {
    id: 'ginkakuji',
    name: 'Ginkaku-ji',
    japaneseName: '銀閣寺',
    city: 'Kyoto',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Ginkaku-ji_Kyoto_18.jpg/960px-Ginkaku-ji_Kyoto_18.jpg',
      author: 'Hyppolyte de Saint-Rambert',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ginkaku-ji_Kyoto_18.jpg',
    },
    color: '#6B6F5A',
    summary: '“Gümüş Köşk”: sade mimarisi ve kum bahçesiyle zen tapınağı.',
    description:
      '15. yüzyılda şogun Ashikaga Yoshimasa’nın inzivaya çekildiği köşk. Adına rağmen hiç gümüşle kaplanmamıştır. Dalgalı desenli kum bahçesi ve koni biçimli kum tepesi Kōgetsudai, Japon bahçe sanatının en bilinen örneklerindendir.',
    tips: [
      'Bahçe yolunu sonuna kadar yürüyün; tepeden köşk ve şehir birlikte görünür.',
      'Tapınaktan güneye uzanan Felsefe Yolu’nda (Tetsugaku-no-michi) kanal boyunca yürüyün.',
      'Kinkaku-ji (Altın Köşk) ile karşılaştırmak için ikisini aynı gezide görün.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 35.027, longitude: 135.7982 },
  },
  {
    id: 'gion',
    name: 'Gion',
    japaneseName: '祇園',
    city: 'Kyoto',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Shirakara_Canal%2C_Gion%2C_Kyoto.jpg/960px-Shirakara_Canal%2C_Gion%2C_Kyoto.jpg',
      author: 'MichaelMaggs',
      license: 'CC BY-SA 2.5',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shirakara_Canal,_Gion,_Kyoto.jpg',
    },
    color: '#7A5A3A',
    summary: 'Ahşap çay evleri, taş sokaklar ve geyşaların semti.',
    description:
      'Kyoto’nun en ünlü geyşa (geiko) semti. Hanamikōji caddesindeki ahşap çay evleri ve söğütlerle çevrili Shirakawa kanalı, eski Kyoto’nun en iyi korunmuş sokaklarındandır.',
    tips: [
      'Akşamüstü fenerler yanınca gidin; sokaklar en güzel o saatte görünür.',
      'Geiko ve maiko’ları izinsiz fotoğraflamayın, yollarını kesmeyin.',
      'Bazı özel sokaklarda fotoğraf çekmek yasak; tabelalara dikkat edin.',
    ],
    duration: '1–2 saat',
    coordinates: { latitude: 35.0055, longitude: 135.7745 },
  },
  {
    id: 'nijo',
    name: 'Nijō Kalesi',
    japaneseName: '二条城',
    city: 'Kyoto',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Ninomaru_Palace%2C_November_2016.jpg/960px-Ninomaru_Palace%2C_November_2016.jpg',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ninomaru_Palace,_November_2016.jpg',
    },
    color: '#6E5A3E',
    summary: 'Şogunların Kyoto’daki sarayı ve “bülbül zeminleri”.',
    description:
      '1603’te Tokugawa Ieyasu’nun yaptırdığı kale, şogunların imparatorluk başkentindeki konutuydu. Ninomaru Sarayı’nın ahşap koridorları üstüne basılınca kuş sesi gibi gıcırdar; bu “bülbül zeminleri”nin davetsiz misafirleri fark etmek için yapıldığı anlatılır.',
    tips: [
      'Koridorlarda yavaş yürüyün ve zeminin “ötüşünü” dinleyin.',
      'Saray içinde fotoğraf çekmek yasak; bahçelerde serbest.',
      'İlkbaharda akşam kiraz ağaçları ışıklandırılır.',
    ],
    duration: '1,5 saat',
    coordinates: { latitude: 35.0142, longitude: 135.7481 },
  },
  {
    id: 'philosophers-path',
    name: 'Felsefe Yolu',
    japaneseName: '哲学の道',
    city: 'Kyoto',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Tetsugaku-no-michi_-_Philosopher%27s_Walk_-_Kyoto.jpg/960px-Tetsugaku-no-michi_-_Philosopher%27s_Walk_-_Kyoto.jpg',
      author: 'Gzzz',
      license: 'CC BY 4.0',
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tetsugaku-no-michi_-_Philosopher's_Walk_-_Kyoto.jpg",
    },
    color: '#5E7A55',
    summary: 'Kiraz ağaçlarıyla çevrili kanal boyunca 2 km’lik yürüyüş yolu.',
    description:
      'Adını her gün burada yürüyerek düşünen filozof Nishida Kitarō’dan alır. Ginkaku-ji’den güneye uzanan yol, küçük tapınakların, kafelerin ve sokak kedilerinin arasından geçer; kiraz mevsiminde Kyoto’nun en güzel yürüyüşlerinden biridir.',
    tips: [
      'Ginkaku-ji’den başlayıp güneye, Nanzen-ji’ye doğru yürüyün; yol hafif yokuş aşağı.',
      'Kiraz mevsimi ve sonbahar en güzel, ama en kalabalık zamanlar.',
      'Yol boyunca küçük tapınaklara sapın; çoğu sakin ve ücretsiz.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 35.0213, longitude: 135.7946 },
  },

  // --- Osaka ---
  {
    id: 'umeda-sky',
    name: 'Umeda Sky Building',
    japaneseName: '梅田スカイビル',
    city: 'Osaka',
    category: 'Şehir',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Umeda_Sky_Building%2C_Osaka%2C_November_2016_-02.jpg/960px-Umeda_Sky_Building%2C_Osaka%2C_November_2016_-02.jpg',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Umeda_Sky_Building,_Osaka,_November_2016_-02.jpg',
    },
    color: '#4A6C8C',
    summary: 'Tepesinde açık hava seyir terası olan ikiz gökdelen.',
    description:
      'İki kuleyi en üstte birleştiren “Floating Garden” terası, Osaka’yı 360 derece gösterir. Kulelerin arasındaki boşlukta yükselen cam yürüyen merdivenler binanın en bilinen görüntüsüdür.',
    tips: [
      'Gün batımına doğru çıkın; şehir ışıklarının yanışını izlersiniz.',
      'Bodrum kattaki Takimi Kōji, eski Osaka sokaklarını canlandıran bir yemek sokağı.',
      'Umeda İstasyonu’ndan yaklaşık 10 dakika yürüme.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 34.7053, longitude: 135.4903 },
  },
  {
    id: 'kaiyukan',
    name: 'Kaiyūkan Akvaryumu',
    japaneseName: '海遊館',
    city: 'Osaka',
    category: 'Eğlence',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Osaka_Aquarium_Kaiyukan_2022-04-24.jpg/960px-Osaka_Aquarium_Kaiyukan_2022-04-24.jpg',
      author: 'Dick Thomas Johnson',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Osaka_Aquarium_Kaiyukan_2022-04-24.jpg',
    },
    color: '#2F5D8A',
    summary: 'Dev tankında balina köpekbalıklarının yüzdüğü akvaryum.',
    description:
      'Dünyanın en büyük akvaryumlarından biri. Ziyaret, binanın tepesinden başlayıp dev orta tankın etrafında spiral şeklinde aşağı iner; Pasifik Okyanusu’nu temsil eden bu tankta balina köpekbalıkları yüzer.',
    tips: [
      'Biletleri internetten alın; hafta sonları gişe kuyruğu uzun olur.',
      'Yanındaki Tempozan dev dönme dolabından Osaka Körfezi’ni izleyin.',
      'Chūō metro hattında Osakakō İstasyonu’ndan 5 dakika yürüme.',
    ],
    duration: '2–3 saat',
    coordinates: { latitude: 34.6545, longitude: 135.429 },
  },
  {
    id: 'usj',
    name: 'Universal Studios Japan',
    japaneseName: 'ユニバーサル・スタジオ・ジャパン',
    city: 'Osaka',
    category: 'Eğlence',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Universal_Studios_Japan_entrance.jpg/960px-Universal_Studios_Japan_entrance.jpg',
      author: 'Csiiiyu',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Universal_Studios_Japan_entrance.jpg',
    },
    color: '#2E5AA8',
    summary: 'Super Nintendo World ve Harry Potter dünyasıyla tema parkı.',
    description:
      'Japonya’nın en popüler tema parklarından biri. Mario oyunlarının içine girmiş gibi hissettiren Super Nintendo World ve Hogwarts Şatosu’nun bulunduğu Harry Potter bölümü en çok ilgi gören alanlar.',
    tips: [
      'Kalabalık günlerde Super Nintendo World’e girmek için uygulamadan giriş saati almanız gerekebilir.',
      'Express Pass, uzun kuyrukları atlamanızı sağlar; erken tükenir.',
      'JR Yumesaki hattında Universal City İstasyonu’nda inin.',
    ],
    duration: '1 gün',
    coordinates: { latitude: 34.6654, longitude: 135.4323 },
  },

  // --- Nara ---
  {
    id: 'kasuga',
    name: 'Kasuga Taisha',
    japaneseName: '春日大社',
    city: 'Nara',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Nara_Kasuga-taisha_Lanterns_%26_Deer_05.jpg/960px-Nara_Kasuga-taisha_Lanterns_%26_Deer_05.jpg',
      author: 'Zairon',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nara_Kasuga-taisha_Lanterns_&_Deer_05.jpg',
    },
    color: '#8A6A3B',
    summary: 'Binlerce taş ve bronz fenerle kaplı orman içi tapınak.',
    description:
      '768’de kurulan Şinto tapınağına giden yol, yosun tutmuş taş fenerlerle çevrilidir; tapınağın içinde de yüzlerce bronz fener asılıdır. Fenerler yılda iki kez, şubat ve ağustostaki Mantōrō festivallerinde yakılır.',
    tips: [
      'Nara Parkı’ndan ormanın içinden yürüyerek gelin; yol boyunca geyikler eşlik eder.',
      'Fenerlerin yandığı Mantōrō festival tarihlerine denk getirebilirseniz kaçırmayın.',
      'Tōdai-ji ile aynı gün kolayca gezilir.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 34.6812, longitude: 135.8484 },
  },

  // --- Hiroshima ---
  {
    id: 'hiroshima-castle',
    name: 'Hiroşima Kalesi',
    japaneseName: '広島城',
    city: 'Hiroshima',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Hiroshima_Castle%2C_West_view_20190417_1.jpg/960px-Hiroshima_Castle%2C_West_view_20190417_1.jpg',
      author: 'DXR',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hiroshima_Castle,_West_view_20190417_1.jpg',
    },
    color: '#3E4A3A',
    summary: 'Hendekle çevrili, savaştan sonra yeniden yapılan “Sazan Kalesi”.',
    description:
      'Asıl kale 1945’teki atom bombasıyla yıkıldı; ana kule 1958’de yeniden inşa edildi ve bugün içinde şehrin samuray dönemini anlatan bir müze var. Hendeklerin çevresi kiraz mevsiminde çok güzeldir.',
    tips: [
      'Barış Anıtı Parkı’na yaklaşık 15–20 dakika yürüme mesafesinde.',
      'Kulenin tepesinden şehrin bugünkü halini görmek, yeniden doğuşunu anlamaya yardımcı olur.',
      'Kale bahçesine giriş ücretsiz; sadece müze ücretli.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 34.4027, longitude: 132.4594 },
  },
  {
    id: 'shukkeien',
    name: 'Shukkei-en',
    japaneseName: '縮景園',
    city: 'Hiroshima',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/20100722_Hiroshima_Shukkeien_4387.jpg/960px-20100722_Hiroshima_Shukkeien_4387.jpg',
      author: 'Jakub Hałun',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:20100722_Hiroshima_Shukkeien_4387.jpg',
    },
    color: '#4E7A4A',
    summary: 'Manzaraları minyatür olarak yeniden kuran 400 yıllık bahçe.',
    description:
      '1620’de yapılan bahçenin adı “küçültülmüş manzara” demek: göletin etrafındaki tepeler, köprüler ve çay evleri ünlü manzaraların minyatürleridir. 1945’te ağır hasar gördü, sonra aslına uygun biçimde yeniden düzenlendi.',
    tips: [
      'Göletteki renkli koi balıklarını izlemeden çıkmayın.',
      'Hiroşima İstasyonu’na ve kaleye yürüme mesafesinde; ikisiyle birlikte gezin.',
      'Sonbaharda akçaağaçlar kızarınca en güzel halini alır.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 34.4004, longitude: 132.4673 },
  },

  // --- Hakone ---
  {
    id: 'open-air-museum',
    name: 'Hakone Açık Hava Müzesi',
    japaneseName: '彫刻の森美術館',
    city: 'Hakone',
    category: 'Sanat',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Hakone_Open-air_Museum_20211202-5.jpg/960px-Hakone_Open-air_Museum_20211202-5.jpg',
      author: 'Suicasmo',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hakone_Open-air_Museum_20211202-5.jpg',
    },
    color: '#7D5A3C',
    summary: 'Dağların arasında, çimenlerin üstünde heykel bahçesi.',
    description:
      '1969’da açılan müzede yüzlerce heykel açık havada, dağ manzarasının önünde sergilenir. İçeride bir Picasso pavyonu, çocukların içine girip oynayabildiği dev ahşap ve örgü yapılar bulunur.',
    tips: [
      'Hakone Tozan treniyle Chōkoku-no-Mori İstasyonu’nda inin, müze hemen yanında.',
      'Bahçedeki ücretsiz ayak onseninde (ashiyu) yorgun ayaklarınızı dinlendirin.',
      'Hakone Free Pass ile giriş ücreti indirimli.',
    ],
    duration: '2–3 saat',
    coordinates: { latitude: 35.2445, longitude: 139.0505 },
  },
  {
    id: 'hakone-shrine',
    name: 'Hakone Tapınağı',
    japaneseName: '箱根神社',
    city: 'Hakone',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776878594%29.jpg/960px-Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776878594%29.jpg',
      author: 'Guilhem Vellut from Annecy, France',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Torii_on_Lake_Ashi_@_Hakone_Shrine_(13776878594).jpg',
    },
    color: '#B5402E',
    summary: 'Ashi Gölü’nün içinde duran kırmızı “Barış Toriisi”.',
    description:
      'Ormanın içinde, dev sedir ağaçlarıyla çevrili bir Şinto tapınağı. En bilinen yeri, gölün suyunun içinde yükselen kırmızı torii kapısı; açık havada arkasında Fuji Dağı da görünür.',
    tips: [
      'Toriinin önünde fotoğraf için kuyruk olur; sabah erken gidin.',
      'Ashi Gölü’nde korsan gemisi görünümlü teknelerle Moto-Hakone iskelesine gelebilirsiniz.',
      'Tapınağa çıkan, sedirlerle çevrili taş merdivenler de en az torii kadar güzel.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 35.2049, longitude: 139.0235 },
  },

  // --- Fuji ---
  {
    id: 'chureito',
    name: 'Chūreitō Pagodası',
    japaneseName: '忠霊塔',
    city: 'Fuji',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Chureito_Pagoda_and_Mount_Fuji_2023-03-07.jpg/960px-Chureito_Pagoda_and_Mount_Fuji_2023-03-07.jpg',
      author: 'Stjepko Krehula',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chureito_Pagoda_and_Mount_Fuji_2023-03-07.jpg',
    },
    color: '#B23A2E',
    summary: 'Fuji Dağı’nın önünde beş katlı kırmızı pagoda.',
    description:
      'Arakurayama Sengen Parkı’ndaki pagoda, savaşta ölenler için anıt olarak yapıldı. Arkasında yükselen Fuji Dağı ile birlikte Japonya’nın en çok fotoğraflanan manzaralarından biridir; ilkbaharda kiraz çiçekleri, sonbaharda kızıl yapraklarla çevrilir.',
    tips: [
      'Seyir noktasına yaklaşık 400 basamak çıkılıyor; rahat ayakkabı giyin.',
      'Fuji genellikle sabah daha net görünür, öğleden sonra bulutlanır.',
      'Fujikyū hattında Shimoyoshida İstasyonu’nda inin, 10 dakika yürüme.',
    ],
    duration: '1–1,5 saat',
    coordinates: { latitude: 35.5012, longitude: 138.8013 },
  },
  {
    id: 'kawaguchiko',
    name: 'Kawaguchi Gölü',
    japaneseName: '河口湖',
    city: 'Fuji',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Mount_Fuji_from_Lake_Kawaguchi_s2.jpg/960px-Mount_Fuji_from_Lake_Kawaguchi_s2.jpg',
      author: 'Alpsdake',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Fuji_from_Lake_Kawaguchi_s2.jpg',
    },
    color: '#3D6E99',
    summary: 'Fuji’nin suya yansıdığı, Beş Göl’ün en kolay ulaşılanı.',
    description:
      'Fuji Beş Gölü’nün en canlısı; kıyısı oteller, onsenler ve müzelerle çevrilidir. Kuzey kıyısından bakınca Fuji gölün tam karşısında yükselir; sakin sabahlarda dağ suya yansır.',
    tips: [
      'En güzel manzara kuzey kıyıdaki Ōishi Parkı’ndan; yazın lavanta tarlaları da var.',
      'Kachi Kachi teleferiğiyle tepeye çıkıp göl ve Fuji’yi birlikte görün.',
      'Tokyo’dan direkt otobüsle yaklaşık 2 saat.',
    ],
    duration: 'Yarım gün',
    coordinates: { latitude: 35.5167, longitude: 138.7514 },
  },
  {
    id: 'oshino-hakkai',
    name: 'Oshino Hakkai',
    japaneseName: '忍野八海',
    city: 'Fuji',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Oshino_Hakkai_-_Oshino6874.jpg/960px-Oshino_Hakkai_-_Oshino6874.jpg',
      author: 'lumoplank',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oshino_Hakkai_-_Oshino6874.jpg',
    },
    color: '#3E7F7A',
    summary: 'Fuji’nin kar sularıyla dolan kristal berraklığında sekiz havuz.',
    description:
      'Fuji Dağı’nın erimiş kar suları yıllarca volkanik kayaların arasından süzülüp bu köydeki sekiz kaynak havuzunda yeryüzüne çıkar. Su o kadar berraktır ki metrelerce derindeki balıklar ve bitkiler net görünür.',
    tips: [
      'Sabah erken gidin; gün içinde tur otobüsleriyle çok kalabalık olur.',
      'Köydeki tezgâhlarda kaynak suyuyla yapılan tofu ve kusa-mochi’yi deneyin.',
      'Kawaguchiko’dan otobüsle yaklaşık 30 dakika.',
    ],
    duration: '1–1,5 saat',
    coordinates: { latitude: 35.46, longitude: 138.8333 },
  },

  // --- Kamakura ---
  {
    id: 'daibutsu',
    name: 'Kamakura Büyük Buda',
    japaneseName: '鎌倉大仏',
    city: 'Kamakura',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/The_Great_Buddha_of_Kamakura.jpg/960px-The_Great_Buddha_of_Kamakura.jpg',
      author: 'Alexandar Vujadinovic',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Great_Buddha_of_Kamakura.jpg',
    },
    color: '#5E7068',
    summary: 'Açık havada oturan 13 metrelik bronz Buda heykeli.',
    description:
      'Kōtoku-in tapınağındaki heykel 13. yüzyılda döküldü. Bir zamanlar büyük bir salonun içindeydi; salon 15. yüzyılda bir tsunamiyle yıkılınca Buda o günden beri açık havada oturuyor.',
    tips: [
      'Küçük bir ücretle heykelin içine girip bronz döküm tekniğini görebilirsiniz.',
      'Enoden treniyle Hase İstasyonu’nda inin, 7 dakika yürüme.',
      'Yakındaki Hase-dera tapınağından deniz manzarası çok güzel.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 35.3167, longitude: 139.5359 },
  },
  {
    id: 'tsurugaoka',
    name: 'Tsurugaoka Hachimangū',
    japaneseName: '鶴岡八幡宮',
    city: 'Kamakura',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Tsurugaoka_Hachimangu_001.jpg/960px-Tsurugaoka_Hachimangu_001.jpg',
      author: 'Ocdp',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tsurugaoka_Hachimangu_001.jpg',
    },
    color: '#A33A2A',
    summary: 'Kamakura’nın kalbindeki büyük Şinto tapınağı.',
    description:
      'Samuray yönetiminin kurucusu Minamoto no Yoritomo’nun 12. yüzyılda bugünkü yerine taşıttığı tapınak, Kamakura’nın merkezidir. Denizden tapınağa uzanan uzun yol, şehrin bir zamanlar başkent olduğunu hatırlatır.',
    tips: [
      'Kamakura İstasyonu’ndan Komachi-dōri alışveriş sokağından geçerek yürüyün, 10 dakika.',
      'Tapınağa çıkan büyük merdivenden şehir ve deniz görünür.',
      'Yeni yılın ilk günlerinde (hatsumōde) çok kalabalık olur.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 35.3259, longitude: 139.5565 },
  },

  // --- Nikkō ---
  {
    id: 'toshogu',
    name: 'Nikkō Tōshō-gū',
    japaneseName: '日光東照宮',
    city: 'Nikkō',
    category: 'Tapınak',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Nikko_toshogu_yomeimon_gate_ver1.jpg/960px-Nikko_toshogu_yomeimon_gate_ver1.jpg',
      author: 'Koichi Sato',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nikko_toshogu_yomeimon_gate_ver1.jpg',
    },
    color: '#B58A2E',
    summary: 'Altın ve renkli oymalarla kaplı şogun türbesi.',
    description:
      'Tokugawa şogunluğunun kurucusu Tokugawa Ieyasu’nun türbesi, UNESCO Dünya Mirası. Sade Japon tapınaklarının aksine her yüzeyi altın varak ve renkli oymalarla süslüdür; en ünlü yapısı Yōmeimon kapısıdır.',
    tips: [
      '“Görme, duyma, söyleme” diyen üç bilge maymun oymasını ve “uyuyan kedi”yi arayın.',
      'Tobu Nikkō İstasyonu’ndan otobüsle 10 dakika ya da 30 dakika yürüme.',
      'Tokyo’dan günübirlik gidilebilir ama tapınaklar ve şelale için bir gece kalmak daha rahat.',
    ],
    duration: '2–3 saat',
    coordinates: { latitude: 36.7581, longitude: 139.5989 },
  },
  {
    id: 'kegon',
    name: 'Kegon Şelalesi',
    japaneseName: '華厳滝',
    city: 'Nikkō',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Kegon_Taki.jpg/960px-Kegon_Taki.jpg',
      author: 'Jordy Meow',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kegon_Taki.jpg',
    },
    color: '#3F6A5E',
    summary: 'Chūzenji Gölü’nden 97 metre aşağı dökülen şelale.',
    description:
      'Japonya’nın en güzel üç şelalesinden biri sayılır. Chūzenji Gölü’nün suyu dik bir kayalıktan tek seferde 97 metre aşağı dökülür; sonbaharda çevresi kızıl ve sarı yapraklarla kaplanır.',
    tips: [
      'Asansörle şelalenin dibindeki seyir terasına inebilirsiniz (ücretli).',
      'Nikkō’dan gelirken kıvrım kıvrım Irohazaka yolundan geçilir; manzarası güzel.',
      'Sonbaharda yollar çok kalabalık olur; sabah erken yola çıkın.',
    ],
    duration: '1 saat',
    coordinates: { latitude: 36.7383, longitude: 139.5017 },
  },

  // --- Kanazawa ---
  {
    id: 'kenrokuen',
    name: 'Kenroku-en',
    japaneseName: '兼六園',
    city: 'Kanazawa',
    category: 'Doğa',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/20190705_Kenroku-en-7.jpg/960px-20190705_Kenroku-en-7.jpg',
      author: 'Balon Greyjoy',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:20190705_Kenroku-en-7.jpg',
    },
    color: '#5A7A48',
    summary: 'Japonya’nın en güzel üç bahçesinden biri.',
    description:
      'Feodal beylerin yüzyıllar içinde genişlettiği bahçe; göletler, taş fenerler ve özenle şekil verilmiş çam ağaçlarıyla doludur. Göletin kenarındaki iki ayaklı Kotoji fener, Kanazawa’nın simgesidir.',
    tips: [
      'Kışın ağaçları kar ağırlığından korumak için kurulan ip çadırlar (yukitsuri) çok fotojenik.',
      'Hemen yanındaki Kanazawa Kalesi Parkı’yla birlikte gezin.',
      'Sabah erken saatlerde bahçe çok daha sakin.',
    ],
    duration: '1,5 saat',
    coordinates: { latitude: 36.5621, longitude: 136.6626 },
  },
  {
    id: 'higashi-chaya',
    name: 'Higashi Chaya',
    japaneseName: 'ひがし茶屋街',
    city: 'Kanazawa',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Higashi_Chaya_district%2C_Kanazawa_%283810704024%29.jpg/960px-Higashi_Chaya_district%2C_Kanazawa_%283810704024%29.jpg',
      author: 'Andrea Schaffer from Sydney, Australia',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Higashi_Chaya_district,_Kanazawa_(3810704024).jpg',
    },
    color: '#7A4E36',
    summary: 'Ahşap çay evleriyle dolu eski geyşa semti.',
    description:
      'Edo döneminden kalma ahşap cepheli çay evleriyle Kyoto’nun Gion’una benzeyen ama daha sakin bir semt. Bazı çay evleri müze olarak gezilebilir; diğerleri kafe ve el sanatları dükkanına dönüşmüş.',
    tips: [
      'Kanazawa, Japonya’daki altın varağın neredeyse tamamını üretir; altın varaklı dondurmayı deneyin.',
      'Shima çay evi müzesinde eski bir geyşa evinin içini görebilirsiniz.',
      'Kenroku-en’e 15–20 dakika yürüme mesafesinde.',
    ],
    duration: '1–2 saat',
    coordinates: { latitude: 36.5725, longitude: 136.6667 },
  },

  // --- Himeji ---
  {
    id: 'himeji-castle',
    name: 'Himeji Kalesi',
    japaneseName: '姫路城',
    city: 'Himeji',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Himeji_castle_in_may_2015.jpg/960px-Himeji_castle_in_may_2015.jpg',
      author: 'Nikos Kitsakis',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Himeji_castle_in_may_2015.jpg',
    },
    color: '#8A8F96',
    summary: 'Japonya’nın aslından günümüze kalan en büyük ve en güzel kalesi.',
    description:
      'Beyaz duvarları yüzünden “Beyaz Balıkçıl Kalesi” denir. 17. yüzyılın başında bugünkü halini alan ana kule, savaşlardan ve İkinci Dünya Savaşı bombardımanlarından sağ çıktı; Japonya’nın ilk UNESCO Dünya Mirası alanlarından biridir.',
    tips: [
      'Himeji İstasyonu’ndan kaleye düz bir cadde uzanır, 15–20 dakika yürüme.',
      'Kulenin içinde dik ahşap merdivenler var; rahat ayakkabı giyin.',
      'Yanındaki Kōko-en bahçesiyle kombine bilet alabilirsiniz.',
    ],
    duration: '2–3 saat',
    coordinates: { latitude: 34.8394, longitude: 134.6939 },
  },

  // --- Shirakawa-gō ---
  {
    id: 'shirakawago',
    name: 'Ogimachi Köyü',
    japaneseName: '白川郷・荻町',
    city: 'Shirakawa-gō',
    category: 'Tarih',
    image: {
      uri: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Shirakawa-go_from_Ogimachi_Joseki_Observatory_36446961844.jpg/960px-Shirakawa-go_from_Ogimachi_Joseki_Observatory_36446961844.jpg',
      author: '吉爾 from 臺北縣, 臺灣',
      license: 'CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shirakawa-go_from_Ogimachi_Joseki_Observatory_36446961844.jpg',
    },
    color: '#6B5A3E',
    summary: 'Dik saz çatılı “gasshō” evlerinin UNESCO köyü.',
    description:
      'Çatıları dua eden ellere benzediği için “gasshō-zukuri” denen bu çiftlik evleri, yoğun kar yağışına dayanmak için dik yapılmıştır. Bazıları hâlâ ev olarak kullanılıyor, bazıları müze; birinde konaklamak bile mümkün.',
    tips: [
      'Köyü yukarıdan görmek için Shiroyama seyir terasına çıkın.',
      'Kış ışıklandırma etkinlikleri çok popüler ve önceden rezervasyon gerektirir.',
      'Takayama ya da Kanazawa’dan otobüsle yaklaşık 1 saat.',
    ],
    duration: 'Yarım gün',
    coordinates: { latitude: 36.2578, longitude: 136.9061 },
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
