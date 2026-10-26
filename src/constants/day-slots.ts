// Günün üç dilimi ve her birinin rengi/ikonu. Şehir sayfasındaki "1 günde" rotası ve Planım aynı dili konuşur:
// şafak turuncusu, öğle güneşi altını, gece indigosu.
import type { SymbolViewProps } from 'expo-symbols';

export const DAY_SLOTS = ['Sabah', 'Öğle', 'Akşam'] as const;
export type DaySlot = (typeof DAY_SLOTS)[number]; // 'Sabah' | 'Öğle' | 'Akşam'

// Renkler beyaz kart üstünde 12pt etiket için WCAG 4.5:1 kontrastı geçecek koyulukta seçildi.
// emoji: planı düz metin olarak paylaşırken ikonun yerine geçer (WhatsApp'ta SF Symbols yok)
export const DAY_THEME: Record<DaySlot, { color: string; icon: SymbolViewProps['name']; emoji: string }> = {
  Sabah: { color: '#C2410C', icon: { ios: 'sunrise.fill', android: 'wb_twilight' }, emoji: '🌅' }, // 5.18:1
  Öğle: { color: '#A16207', icon: { ios: 'sun.max.fill', android: 'light_mode' }, emoji: '☀️' }, // 4.92:1
  Akşam: { color: '#4338CA', icon: { ios: 'moon.stars.fill', android: 'dark_mode' }, emoji: '🌙' }, // 7.90:1
};
