// Rehber sekmesinin içeriği: ifadeler, görgü kuralları, ulaşım ipuçları, acil durum. Uygulamanın içinde: internetsiz okunur.
// Not: Kurallar ve numaralar genel bilgidir; gerçek bir uygulamada resmi kaynaklardan doğrulanmalı.
import type { SymbolViewProps } from 'expo-symbols';

// tr: ne demek, ja: Japonca yazılışı (karşındakine gösterilen ve sesli okunan), romaji: okunuşu (Latin harfleriyle)
export type Phrase = { tr: string; ja: string; romaji: string };

// Duruma göre gruplar: ihtiyaç anında (restoranda, eczanede…) doğru ifade hemen bulunsun.
// Hepsi kibar ama günlük "-masu/-desu" biçiminde: turistin konuşması için doğal düzey.
export type PhraseGroup = { title: string; icon: SymbolViewProps['name']; phrases: Phrase[] };

export const PHRASE_GROUPS: PhraseGroup[] = [
  {
    title: 'Temel',
    icon: { ios: 'hand.wave.fill', android: 'waving_hand' },
    phrases: [
      { tr: 'Merhaba', ja: 'こんにちは', romaji: 'konnichiwa' },
      { tr: 'Teşekkür ederim', ja: 'ありがとうございます', romaji: 'arigatō gozaimasu' },
      { tr: 'Evet / Hayır', ja: 'はい / いいえ', romaji: 'hai / iie' },
      { tr: 'Affedersiniz / Bakar mısınız?', ja: 'すみません', romaji: 'sumimasen' },
      { tr: 'Özür dilerim', ja: 'ごめんなさい', romaji: 'gomen nasai' },
      { tr: 'Japonca bilmiyorum', ja: '日本語がわかりません', romaji: 'nihongo ga wakarimasen' },
      { tr: 'İngilizce konuşabiliyor musunuz?', ja: '英語を話せますか', romaji: 'eigo o hanasemasu ka' },
      { tr: 'Tuvalet nerede?', ja: 'トイレはどこですか', romaji: 'toire wa doko desu ka' },
      { tr: 'Fotoğraf çekebilir miyim?', ja: '写真を撮ってもいいですか', romaji: 'shashin o totte mo ii desu ka' },
    ],
  },
  {
    title: 'Restoranda',
    icon: { ios: 'fork.knife', android: 'restaurant' },
    phrases: [
      { tr: 'İki kişiyiz', ja: '二人です', romaji: 'futari desu' },
      { tr: 'İngilizce menü var mı?', ja: '英語のメニューはありますか', romaji: 'eigo no menyū wa arimasu ka' },
      { tr: 'Ne önerirsiniz?', ja: 'おすすめは何ですか', romaji: 'osusume wa nan desu ka' },
      { tr: 'Bunu istiyorum (gösterirken)', ja: 'これをください', romaji: 'kore o kudasai' },
      { tr: 'Su lütfen', ja: 'お水をください', romaji: 'o-mizu o kudasai' },
      { tr: 'Hesap lütfen', ja: 'お会計お願いします', romaji: 'o-kaikei onegaishimasu' },
      { tr: 'Elinize sağlık (çıkarken)', ja: 'ごちそうさまでした', romaji: 'gochisōsama deshita' },
    ],
  },
  {
    // Domuz çoğu zaman görünmez: ramen suyu (tonkotsu), gyoza, et suyu, jelatin. "Var mı?" diye sormak şart.
    title: 'Beslenme ve alerji',
    icon: { ios: 'leaf.fill', android: 'eco' },
    phrases: [
      { tr: 'Bunda domuz eti var mı?', ja: 'これに豚肉は入っていますか', romaji: 'kore ni butaniku wa haitte imasu ka' },
      { tr: 'Domuz eti yiyemiyorum', ja: '豚肉は食べられません', romaji: 'butaniku wa taberaremasen' },
      { tr: 'Et yiyemiyorum', ja: '肉は食べられません', romaji: 'niku wa taberaremasen' },
      { tr: 'Alkol içmiyorum', ja: 'お酒は飲めません', romaji: 'o-sake wa nomemasen' },
      { tr: 'Fıstık alerjim var', ja: 'ピーナッツアレルギーがあります', romaji: 'pīnattsu arerugī ga arimasu' },
      { tr: 'Deniz ürünü alerjim var', ja: '魚介類アレルギーがあります', romaji: 'gyokairui arerugī ga arimasu' },
    ],
  },
  {
    title: 'Alışverişte',
    icon: { ios: 'bag.fill', android: 'shopping_bag' },
    phrases: [
      { tr: 'Bu ne kadar?', ja: 'いくらですか', romaji: 'ikura desu ka' },
      { tr: 'Kartla ödeyebilir miyim?', ja: 'カードは使えますか', romaji: 'kādo wa tsukaemasu ka' },
      { tr: 'Vergisiz (tax-free) alabilir miyim?', ja: '免税できますか', romaji: 'menzei dekimasu ka' },
      { tr: 'Deneyebilir miyim?', ja: '試着してもいいですか', romaji: 'shichaku shite mo ii desu ka' },
      { tr: 'Poşet istemiyorum', ja: '袋はいりません', romaji: 'fukuro wa irimasen' },
    ],
  },
  {
    title: 'Yolda',
    icon: { ios: 'tram.fill', android: 'train' },
    phrases: [
      { tr: 'İstasyon nerede?', ja: '駅はどこですか', romaji: 'eki wa doko desu ka' },
      { tr: 'Bu adrese gitmek istiyorum', ja: 'この住所に行きたいです', romaji: 'kono jūsho ni ikitai desu' },
      { tr: 'Hangi peron?', ja: '何番線ですか', romaji: 'nanban-sen desu ka' },
      { tr: 'Kayboldum', ja: '道に迷いました', romaji: 'michi ni mayoimashita' },
    ],
  },
  {
    title: 'Otelde',
    icon: { ios: 'bed.double.fill', android: 'hotel' },
    phrases: [
      { tr: 'Giriş (check-in) yapmak istiyorum', ja: 'チェックインをお願いします', romaji: 'chekkuin o onegaishimasu' },
      { tr: 'Bavulumu bırakabilir miyim?', ja: '荷物を預かってもらえますか', romaji: 'nimotsu o azukatte moraemasu ka' },
      { tr: 'Wi-Fi şifresi nedir?', ja: 'Wi-Fiのパスワードは何ですか', romaji: 'wai-fai no pasuwādo wa nan desu ka' },
    ],
  },
  {
    title: 'Sağlık ve acil',
    icon: { ios: 'cross.case.fill', android: 'medical_services' },
    phrases: [
      { tr: 'Yardım edin!', ja: '助けてください', romaji: 'tasukete kudasai' },
      { tr: 'Kendimi iyi hissetmiyorum', ja: '気分が悪いです', romaji: 'kibun ga warui desu' },
      { tr: 'Ambulans çağırın', ja: '救急車を呼んでください', romaji: 'kyūkyūsha o yonde kudasai' },
      { tr: 'Hastane nerede?', ja: '病院はどこですか', romaji: 'byōin wa doko desu ka' },
      { tr: 'Eczane nerede?', ja: '薬局はどこですか', romaji: 'yakkyoku wa doko desu ka' },
    ],
  },
];

export type Tip = { title: string; text: string };

export const ETIQUETTE: Tip[] = [
  { title: 'Bahşiş yok', text: 'Bahşiş verilmez; masada para bırakırsan arkandan getirebilirler.' },
  { title: 'Yürürken yeme', text: 'Aldığın yerin önünde ya da oturarak ye. Sokak tezgâhlarında yanında yer ayrılır.' },
  { title: 'Trende sessizlik', text: 'Telefonla konuşulmaz, telefon sessize alınır (マナーモード). Yüksek sesle sohbet hoş karşılanmaz.' },
  { title: 'Yürüyen merdiven', text: 'Tokyo’da solda durulur, sağdan geçilir. Osaka’da tersi: sağda durulur.' },
  { title: 'Tapınak ve türbe', text: 'Türbede (神社) girişteki çeşmede el ve ağız arındırılır. Dua: iki eğil, iki alkış, bir eğil.' },
  { title: 'Ayakkabı', text: 'Ryokan, bazı restoran ve tapınaklarda girişte çıkarılır. Tuvalet terliği ayrıdır, dışarı giyilmez.' },
  { title: 'Çöp', text: 'Sokakta çöp kutusu az. Çöpünü yanında taşı; konbini ve otelde ayrıştırarak at.' },
  { title: 'Onsen', text: 'Girmeden önce oturarak duş al, havluyu suya sokma. Bazı onsenler dövmeli misafiri almıyor.' },
  { title: 'Sıra', text: 'Peronda yerdeki işaretlerin önünde sıraya girilir; inenler beklenir.' },
];

export const TRANSPORT: Tip[] = [
  { title: 'IC kart', text: 'Suica / PASMO / ICOCA büyük şehirlerin hepsinde tren, metro, otobüs ve markette geçer. Girişte ve çıkışta okut.' },
  { title: 'Yol tarifi', text: 'Google Haritalar toplu taşımada çok iyi çalışır: hangi peron, hangi vagon, kaç durak yazar.' },
  { title: 'Son trenler', text: 'Çoğu hat gece yarısı civarı kapanır. Kaçırırsan taksi pahalı: dönüşü önceden kontrol et.' },
  { title: 'Büyük bavul', text: 'Tokaido Shinkansen’de büyük bavul (ölçüleri toplamı 160 cm üstü) için bavul alanlı koltuk ayırtmak gerekir.' },
  { title: 'Bavul gönderimi', text: 'Takkyubin ile bavulu otelden otele bir günde yollayabilirsin; şehir değiştirirken eller boş kalır.' },
  { title: 'Taksi kapısı', text: 'Arka kapı otomatik açılıp kapanır; kendin açıp kapatma.' },
  { title: 'Konbini', text: '7-Eleven, Lawson, FamilyMart: yemek, ATM (7-Eleven yabancı kartları alır), bilet, kargo.' },
];

export type Emergency = { label: string; number: string; note: string; icon: SymbolViewProps['name'] };

export const EMERGENCY: Emergency[] = [
  { label: 'Polis', number: '110', note: 'Hırsızlık, kaza, kayıp', icon: { ios: 'shield.fill', android: 'local_police' } },
  {
    label: 'Ambulans ve itfaiye',
    number: '119',
    note: 'Acil sağlık, yangın',
    icon: { ios: 'cross.case.fill', android: 'emergency' },
  },
  {
    label: 'Turist yardım hattı',
    number: '050-3816-2787',
    note: 'JNTO, 24 saat, İngilizce: hastane, kayıp eşya, afet bilgisi',
    icon: { ios: 'phone.fill', android: 'support_agent' },
  },
];
