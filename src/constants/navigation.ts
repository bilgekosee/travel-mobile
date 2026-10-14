// Tüm Stack'lerin ortak başlık görünümü (kök Stack + her sekmenin Stack'i).
import type { NativeStackNavigationOptions } from 'expo-router/native-stack';

import { FONTS } from '@/constants/fonts';

const BACKGROUND = '#FAF7F2';

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerTintColor: '#C8102E', // Geri düğmesi gibi vurgular kırmızı
  // Başlık çubuğu içerikle aynı renkte ve altında sabit çizgi yok: ekran tek parça görünür.
  headerStyle: { backgroundColor: BACKGROUND },
  headerLargeStyle: { backgroundColor: BACKGROUND },
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  // headerTintColor başlığı da boyuyordu; başlıklar siyah + serif olsun
  headerTitleStyle: { fontFamily: FONTS.serif, color: '#1A1A1A' },
  headerLargeTitleStyle: { fontFamily: FONTS.serif, color: '#1A1A1A' },
  contentStyle: { backgroundColor: BACKGROUND },
};
