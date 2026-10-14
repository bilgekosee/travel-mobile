// Açılışta gösterilen animasyonlu giriş ekranı.
// Uygulamanın üstüne bir "perde" gibi serilir; animasyon bitince onFinish çağrılır ve perde kaldırılır.
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { FallingPetals, SakuraBranch } from '@/components/sakura';
import { serifText } from '@/constants/fonts';

const HOLD_MS = 3200; // Perde kalkmadan önce ekranda kalma süresi
const EXIT_MS = 450;

export function AnimatedIntro({ onFinish }: { onFinish: () => void }) {
  // useSharedValue: useState'e benzer ama değeri UI thread'de yaşar.
  // Bu sayede animasyon JavaScript meşgulken bile 60 FPS akar.
  const sunScale = useSharedValue(0);
  const titleProgress = useSharedValue(0);
  const subtitleProgress = useSharedValue(0);
  const curtain = useSharedValue(1); // 1 = perde görünür, 0 = kalktı

  const exit = () => {
    curtain.value = withTiming(0, { duration: EXIT_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
      // Bu callback UI thread'de çalışır; React state'ine dokunmak için JS thread'e geri dönüyoruz.
      if (finished) scheduleOnRN(onFinish);
    });
  };

  useEffect(() => {
    // Sahne sahne: önce güneş, sonra başlık, sonra alt başlık.
    sunScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    titleProgress.value = withDelay(350, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    subtitleProgress.value = withDelay(650, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));

    const timer = setTimeout(exit, HOLD_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useAnimatedStyle: shared value'lar değiştikçe stili UI thread'de yeniden hesaplar.
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sunScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [{ translateY: (1 - titleProgress.value) * 24 }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleProgress.value,
    transform: [{ translateY: (1 - subtitleProgress.value) * 16 }],
  }));
  const curtainStyle = useAnimatedStyle(() => ({
    opacity: curtain.value,
    transform: [{ scale: 1 + (1 - curtain.value) * 0.08 }], // Kaybolurken hafifçe büyür
  }));

  return (
    <Animated.View
      style={[styles.overlay, curtainStyle]}
      // İlk kare çizilince native splash'i gizliyoruz; renkler aynı olduğu için geçiş fark edilmez.
      onLayout={() => SplashScreen.hide()}>
      {/* Çizim sırası = katman sırası: önce yapraklar, sonra dal, en üstte yazılar */}
      <FallingPetals />
      <SakuraBranch />
      <Pressable style={styles.center} onPress={exit}>
        <Animated.View style={[styles.sun, sunStyle]} />
        <Animated.Text style={[styles.title, titleStyle]} maxFontSizeMultiplier={1.4}>Japonya Rehberi</Animated.Text>
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>日本へようこそ</Text>
          <Text style={styles.hint}>Japonya&apos;ya hoş geldin</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill, // Tüm ekranı kapla (position: absolute; inset: 0)
    backgroundColor: '#FAF7F2', // app.json'daki splash rengiyle aynı olmalı
    zIndex: 10,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  sun: {
    width: 120,
    height: 120,
    borderRadius: 60, // Genişliğin yarısı = tam daire
    backgroundColor: '#C8102E',
    marginBottom: 20,
  },
  title: { fontSize: 42, ...serifText, color: '#1A1A1A' },
  subtitle: { fontSize: 18, color: '#C8102E', fontWeight: '600', textAlign: 'center' },
  hint: { fontSize: 14, color: '#6B6B6B', textAlign: 'center', marginTop: 4 },
});
