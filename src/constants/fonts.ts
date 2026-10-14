// Uygulamanın özel fontları. Kök _layout.tsx'te useFonts ile yüklenir.
// Cormorant Garamond: ince-kalın kontrastı yüksek, zarif bir serif; Japon "Mincho" havasına yakın.
// Japon fontları (Shippori Mincho, Noto Serif JP...) Ş, Ğ, İ harflerini içermediği için Latin bir font seçtik.
// Japonca karakterler (東京 gibi) sistem fontuyla çizilir.
import type { TextStyle } from 'react-native';

export const FONTS = {
  serif: 'CormorantGaramond_700Bold',
};

// Serif başlıklar için hazır stil. Stillerde ...serifText diye kullanılır.
export const serifText: TextStyle = {
  fontFamily: FONTS.serif,
  // Bu font varsayılan olarak "eski stil" rakam çizer: 1 küçük bir I gibi görünür (Roma rakamı sanılır).
  // lining-nums: rakamları büyük harf boyunda, düz çizdirir (fontun "lnum" OpenType özelliği).
  fontVariant: ['lining-nums'],
};
