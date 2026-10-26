// _layout.tsx: bu klasördeki ekranların nasıl gösterileceğini tanımlar.
// "Stack" = ekranlar üst üste biner, geri tuşu/kaydırma ile önceki ekrana dönülür.
// Tek ağırlığı alt klasörden import ediyoruz; paketin ana dosyası tüm ağırlıkları uygulamaya eklerdi.
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import type { NativeStackNavigationOptions } from 'expo-router/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { AnimatedIntro } from '@/components/animated-intro';
import { SHEET_DONE_OPTIONS } from '@/components/sheet-done-button';
import { stackScreenOptions } from '@/constants/navigation';
import { useReminderSync } from '@/hooks/use-reminder-sync';

// Native splash kendiliğinden kapanmasın; AnimatedIntro hazır olunca biz kapatacağız.
// Bileşenin dışında çağrılır ki uygulama yüklenir yüklenmez çalışsın.
SplashScreen.preventAutoHideAsync();

// Alttan açılan sayfaların ortak ayarı: önce %60 yükseklikte, çekilince tam ekran
// Tipi Expo Router'dan: yanlış bir seçenek adı yazarsak TypeScript hemen uyarır
const SHEET_OPTIONS: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.6, 1],
  sheetGrabberVisible: true,
};

// Link doğrudan /place/sensoji'yi açarsa altına sekmeler konsun; geri kaydırınca uygulamaya dönülsün.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [showIntro, setShowIntro] = useState(true);
  useReminderSync(); // Plan değişince durak hatırlatmalarını yeniden kur
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
        {/* Plana ekleme sayfaları alttan yarım ekran açılır (Apple Haritalar'daki "Rehbere ekle" gibi).
            Tutma çubuğundan yukarı çekilince tam ekran olur. */}
        <Stack.Screen name="add-to-plan" options={{ ...SHEET_OPTIONS, ...SHEET_DONE_OPTIONS, title: 'Plana ekle' }} />
        <Stack.Screen name="add-stop" options={{ ...SHEET_OPTIONS, title: 'Yer ekle' }} />
        {/* Planım'da bir durağa dokununca: gittim, not, taşıma */}
        <Stack.Screen name="stop" options={{ ...SHEET_OPTIONS, ...SHEET_DONE_OPTIONS, title: 'Durak' }} />
        {/* Günün harcamaları */}
        <Stack.Screen name="day-expenses" options={{ ...SHEET_OPTIONS, ...SHEET_DONE_OPTIONS, title: 'Harcamalar' }} />
        {/* Gidiş / dönüş uçuşu (başlığı sayfa kendisi koyuyor) */}
        <Stack.Screen name="flight" options={{ ...SHEET_OPTIONS, ...SHEET_DONE_OPTIONS, title: 'Uçuş' }} />
        {/* Haritadan konum seçme: tam ekran (yarım sayfada harita kaydırmak sayfayı kapatmaya çalışıyordu) */}
        <Stack.Screen name="pick-location" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        {/* Taksiciye göster: tam ekran, beyaz kart */}
        <Stack.Screen name="show-driver" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        {/* Bilet/belge görüntüleyici: tam ekran, üst çubuğu kendisi çiziyor */}
        <Stack.Screen name="attachment" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        {/* Kalınan yer: küçük bir form, içeriği kadar açılır */}
        <Stack.Screen
          name="day-stay"
          options={{ ...SHEET_OPTIONS, sheetAllowedDetents: 'fitToContents', title: 'Kalınan yer', headerShown: false }}
        />
        {/* Takvim: sayfa içeriği kadar açılır (fitToContents). Başlık çubuğu yok: içeriğin üstüne biniyordu,
            seçili tarih yazısı zaten başlık işini görüyor. */}
        <Stack.Screen
          name="pick-date"
          options={{ ...SHEET_OPTIONS, sheetAllowedDetents: 'fitToContents', headerShown: false }}
        />
      </Stack>
      {/* Liste arkada şimdiden çizilir; perde kalkınca hazır bekliyor olur. */}
      {showIntro && <AnimatedIntro onFinish={() => setShowIntro(false)} />}
    </>
  );
}
