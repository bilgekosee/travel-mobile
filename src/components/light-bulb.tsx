// İpucu ampulü: bölüm ekrana girince sönük halden yanık hale geçer, üstünden küçük ışık çizgileri saçılır
// ve yanık kalır. Bir kez; sürekli yanıp sönmez (okunacak metnin yanında dikkat dağıtmasın).
import { SymbolView } from 'expo-symbols';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useSeenOnScreen } from '@/hooks/use-seen-on-screen';

const SIZE = 16;
const OFF = '#B5AEA5'; // Sönük: gri
const ON = '#D97706'; // Yanık: kehribar. Beyaz zeminde ikon için gereken 3:1 kontrastı geçer
const STAGGER = 250; // Ampuller arasındaki gecikme (ms): yukarıdan aşağıya sırayla yanarlar

// Işık çizgileri: ampulün üstüne yelpaze gibi açılır. 0° = yukarı, eksi = sola, artı = sağa.
const RAY_ANGLES = [-70, -35, 0, 35, 70];
const RAY_LENGTH = 4;
const RAY_START = 10; // Çizginin ampul merkezine uzaklığı: başta
const RAY_END = 13; // …saçılınca
// Ampulün cam kısmının ortası (ikonun alt kısmı duy): çizgiler buradan saçılır
const CENTER_X = SIZE / 2;
const CENTER_Y = 6;

// index: listedeki sırası (0, 1, 2…)
export function LightBulb({ index = 0 }: { index?: number }) {
  const reduceMotion = useReducedMotion();
  const ref = useAnimatedRef<Animated.View>();
  const { seen, hasScroll, onLayout } = useSeenOnScreen(ref);
  // 0 = sönük, 1 = yanık. Hareketi Azalt açıksa ya da kaydıran sayfa yoksa baştan yanık.
  const lit = useSharedValue(reduceMotion || !hasScroll ? 1 : 0);
  // Işık çizgilerinin görünürlüğü (0–1) ve ne kadar dışarı saçıldıkları (0–1)
  const rayOpacity = useSharedValue(0);
  const raySpread = useSharedValue(0);

  useAnimatedReaction(
    () => seen.value,
    (isSeen, wasSeen) => {
      if (!isSeen || wasSeen || lit.value === 1) return;
      const delay = index * STAGGER;
      lit.value = withDelay(delay, withTiming(1, { duration: 300 }));
      // Çizgiler ampul yanarken belirir, dışarı doğru uzanır ve söner
      rayOpacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 450 })));
      raySpread.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
    },
  );

  const offStyle = useAnimatedStyle(() => ({ opacity: 1 - lit.value }));
  const onStyle = useAnimatedStyle(() => ({ opacity: lit.value }));

  return (
    <Animated.View ref={ref} style={styles.container} onLayout={onLayout}>
      {RAY_ANGLES.map((angle) => (
        <Ray key={angle} angle={angle} opacity={rayOpacity} spread={raySpread} />
      ))}
      {/* İki ikon üst üste: biri kaybolurken diğeri belirir (çapraz geçiş) */}
      <Animated.View style={[StyleSheet.absoluteFill, offStyle]}>
        <SymbolView name={{ ios: 'lightbulb', android: 'lightbulb' }} size={SIZE} tintColor={OFF} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, onStyle]}>
        <SymbolView name={{ ios: 'lightbulb.fill', android: 'lightbulb' }} size={SIZE} tintColor={ON} />
      </Animated.View>
    </Animated.View>
  );
}

// Tek bir ışık çizgisi. Ayrı bileşen çünkü her çizginin kendi useAnimatedStyle'ı var
// ve hook'lar döngünün içinde çağrılamaz (webdeki React ile aynı kural).
function Ray({ angle, opacity, spread }: { angle: number; opacity: SharedValue<number>; spread: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // Önce yönüne dön, sonra o yönde merkezden uzaklaş: CSS'teki rotate(35deg) translateY(-10px) gibi
    transform: [{ rotate: `${angle}deg` }, { translateY: -(RAY_START + spread.value * (RAY_END - RAY_START)) }],
  }));
  return <Animated.View style={[styles.ray, style]} />;
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE },
  // Ampulün cam kısmının ortasında duran ince çubuk; transform ile yerine gider
  ray: {
    position: 'absolute',
    width: 1.5,
    height: RAY_LENGTH,
    borderRadius: 1,
    left: CENTER_X - 0.75,
    top: CENTER_Y - RAY_LENGTH / 2,
    backgroundColor: ON,
  },
});
