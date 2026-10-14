// Uygulamanın verisi. Gerçek bir projede bu veri genelde bir API'den gelir.
// TypeScript "type" ile verinin şeklini tanımlıyoruz; yanlış alan yazarsak editör uyarır.

export type City = 'Tokyo' | 'Kyoto' | 'Osaka' | 'Nara' | 'Hiroshima' | 'Hakone' | 'Fuji';

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
  category: 'Tapınak' | 'Şehir' | 'Doğa' | 'Yemek' | 'Tarih' | 'Sanat';
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
    coordinates: { latitude: 35.2048, longitude: 139.0254 },
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
