// Rehber sekmesinin içeriği: ifadeler, görgü kuralları, ulaşım ipuçları, acil durum. Uygulamanın içinde: internetsiz okunur.
// Not: Kurallar ve numaralar genel bilgidir; gerçek bir uygulamada resmi kaynaklardan doğrulanmalı.
import type { SymbolViewProps } from 'expo-symbols';

// tr: ne demek, ja: Japonca yazılışı (karşındakine gösterilen), romaji: okunuşu (Latin harfleriyle)
export type Phrase = { tr: string; ja: string; romaji: string };

export const PHRASES: Phrase[] = [
  { tr: 'Merhaba', ja: 'こんにちは', romaji: 'konnichiwa' },
  { tr: 'Teşekkür ederim', ja: 'ありがとうございます', romaji: 'arigatō gozaimasu' },
  { tr: 'Affedersiniz / Bakar mısınız?', ja: 'すみません', romaji: 'sumimasen' },
  { tr: 'Japonca bilmiyorum', ja: '日本語がわかりません', romaji: 'nihongo ga wakarimasen' },
  { tr: 'Bu ne kadar?', ja: 'いくらですか', romaji: 'ikura desu ka' },
  { tr: 'Bunu istiyorum (gösterirken)', ja: 'これをください', romaji: 'kore o kudasai' },
  { tr: 'Hesap lütfen', ja: 'お会計お願いします', romaji: 'o-kaikei onegaishimasu' },
  { tr: 'Kartla ödeyebilir miyim?', ja: 'カードは使えますか', romaji: 'kādo wa tsukaemasu ka' },
  { tr: 'İngilizce menü var mı?', ja: '英語のメニューはありますか', romaji: 'eigo no menyū wa arimasu ka' },
  { tr: 'Domuz eti yiyemiyorum', ja: '豚肉は食べられません', romaji: 'butaniku wa taberaremasen' },
  { tr: 'Et yiyemiyorum', ja: '肉は食べられません', romaji: 'niku wa taberaremasen' },
  { tr: 'Poşet istemiyorum', ja: '袋はいりません', romaji: 'fukuro wa irimasen' },
  { tr: 'Tuvalet nerede?', ja: 'トイレはどこですか', romaji: 'toire wa doko desu ka' },
  { tr: 'İstasyon nerede?', ja: '駅はどこですか', romaji: 'eki wa doko desu ka' },
  { tr: 'Yardım edin!', ja: '助けてください', romaji: 'tasukete kudasai' },
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
