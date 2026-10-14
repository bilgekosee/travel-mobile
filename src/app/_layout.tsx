// _layout.tsx: bu klasördeki ekranların nasıl gösterileceğini tanımlar.
// "Stack" = ekranlar üst üste biner, geri tuşu/kaydırma ile önceki ekrana dönülür.
// Tek ağırlığı alt klasörden import ediyoruz; paketin ana dosyası tüm ağırlıkları uygulamaya eklerdi.
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { AnimatedIntro } from '@/components/animated-intro';
import { stackScreenOptions } from '@/constants/navigation';

// Native splash kendiliğinden kapanmasın; AnimatedIntro hazır olunca biz kapatacağız.
// Bileşenin dışında çağrılır ki uygulama yüklenir yüklenmez çalışsın.
SplashScreen.preventAutoHideAsync();

// Link doğrudan /place/sensoji'yi açarsa altına sekmeler konsun; geri kaydırınca uygulamaya dönülsün.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [showIntro, setShowIntro] = useState(true);
  // Anahtar adı ("CormorantGaramond_700Bold") stillerde fontFamily olarak kullanılacak ad olur.
  const [fontsLoaded, fontError] = useFonts({ CormorantGaramond_700Bold });

  // Font yüklenene kadar hiçbir şey çizme: native splash ekranda kalmaya devam eder.
  // Hata olursa uygulamayı kilitlemek yerine sistem fontuyla devam ediyoruz.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={stackScreenOptions}>
        {/* Sekmeli bölüm. Başlık çubuğunu her sekme kendi Stack'inde gösterir, burada gizliyoruz. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Geri' }} />
        {/* Detay, sekmelerin üstüne açılır: sekme çubuğu gizlenir, tam ekran olur. */}
        <Stack.Screen name="place/[id]" options={{ title: '' }} />
      </Stack>
      {/* Liste arkada şimdiden çizilir; perde kalkınca hazır bekliyor olur. */}
      {showIntro && <AnimatedIntro onFinish={() => setShowIntro(false)} />}
    </>
  );
}
