// Liste öğeleri arasındaki ayırıcı: yandan görünen bir tren yolu. Ray ekrana girince
// küçük bir Shinkansen soldan yavaşça gelir, rayı geçer ve sağdan çıkıp gider. Sadece bir kez.
// Sadece süs: ekran okuyucu (VoiceOver) bunu atlar.
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useSeenOnScreen } from '@/hooks/use-seen-on-screen';

const RED = '#C8102E';
const RAIL = '#4A4A4A'; // Ray çizgileri: koyu gri
const SLEEPER = '#8A847C'; // Traversler: biraz daha açık gri, ray öne çıksın
const TRAIN_WIDTH = 66; // 3 vagon × 22pt
const CROSS_DURATION = 6000; // Trenin rayı baştan sona geçmesi (ms): yavaş
const SLEEPERS = 40; // Traversler: fazlası taşar ve gizlenir, her genişlikte ray dolu görünür

export function RailDivider() {
  // Hareketi Azalt açıksa tren hiç çıkmaz; sadece ray görünür
  const reduceMotion = useReducedMotion();
  // Rayın ekrandaki yerini ölçmek için (webdeki useRef + getBoundingClientRect gibi)
  const ref = useAnimatedRef<Animated.View>();
  const { seen, onLayout } = useSeenOnScreen(ref);
  // Rayın genişliği: ekrana çizilince ölçülür (onLayout). Tren bu mesafeyi kat edecek.
  const width = useSharedValue(0);
  // 0 = tren rayın solunda (görünmez), 1 = rayın sağında (görünmez): arada rayı geçer
  const progress = useSharedValue(0);

  // Ray ekrana girince treni bir kez yola çıkar
  useAnimatedReaction(
    () => seen.value,
    (isSeen, wasSeen) => {
      if (!isSeen || wasSeen || reduceMotion) return;
      // Easing.inOut: yavaş kalkar, hızlanır, çıkarken yine yavaşlar. Gerçek bir tren gibi.
      progress.value = withTiming(1, { duration: CROSS_DURATION, easing: Easing.inOut(Easing.quad) });
    },
  );

  // Bu fonksiyon UI thread'de, her karede çalışır; JS tarafını hiç meşgul etmez
  const trainStyle = useAnimatedStyle(() => {
    // Rayın solundan (-TRAIN_WIDTH) tamamen sağına (width) kadar: tren baştan sona görünmeden girip çıkar
    const distance = width.value + TRAIN_WIDTH;
    return { transform: [{ translateX: -TRAIN_WIDTH + progress.value * distance }] };
  });

  return (
    <Animated.View
      ref={ref}
      style={styles.container}
      // .set(): React Compiler'a "bu değeri bilerek değiştiriyorum" demenin yolu (.value = yerine)
      onLayout={(e) => {
        width.set(e.nativeEvent.layout.width);
        onLayout(); // Ray çizilince de "ekranda mı?" kontrolü yapılsın
      }}
      accessibilityElementsHidden // iOS: VoiceOver atlasın
      importantForAccessibility="no-hide-descendants" // Android: TalkBack atlasın
    >
      {/* Ray: iki çizgi ve aralarında traversler */}
      <View style={styles.track}>
        <View style={styles.sleepers}>
          {Array.from({ length: SLEEPERS }, (_, i) => (
            <View key={i} style={styles.sleeper} />
          ))}
        </View>
        <View style={[styles.rail, styles.railTop]} />
        <View style={[styles.rail, styles.railBottom]} />
      </View>

      {/* Tren: arka + orta + ön vagon. Rayın üstüne oturur. */}
      <Animated.View style={[styles.train, trainStyle]}>
        <SymbolView name={{ ios: 'train.side.rear.car', android: 'train' }} size={22} tintColor={RED} />
        <SymbolView name={{ ios: 'train.side.middle.car', android: 'train' }} size={22} tintColor={RED} />
        <SymbolView name={{ ios: 'train.side.front.car', android: 'train' }} size={22} tintColor={RED} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // overflow: hidden → tren rayın dışına çıkınca görünmez olur (CSS'teki gibi)
  container: { height: 34, justifyContent: 'flex-end', overflow: 'hidden', marginVertical: 6 },
  track: { height: 8, justifyContent: 'center' },
  sleepers: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', gap: 7 },
  sleeper: { width: 3, height: 8, borderRadius: 1, backgroundColor: SLEEPER },
  rail: { position: 'absolute', left: 0, right: 0, height: 1.5, backgroundColor: RAIL },
  railTop: { top: 1 },
  railBottom: { bottom: 1 },
  train: { position: 'absolute', left: 0, bottom: 6, flexDirection: 'row', width: TRAIN_WIDTH },
});
