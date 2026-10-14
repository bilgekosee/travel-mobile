// Sakura (kiraz çiçeği) süsleri: köşeden uzanan çiçekli dal + yağan yapraklar.
// Çizimler react-native-svg ile yapılır (webdeki <svg> etiketinin mobil karşılığı).
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

const PETAL = '#F7C1CF';
const PETAL_DARK = '#E88AA3';
const BARK = '#5B3A29';

// Dalın çizildiği alan. Çiçek koordinatları bu 260x260'lık kutuya göre verilir.
const BOX = 260;

// x, y = çiçeğin merkezi; r = yarıçap; delay = açılma gecikmesi (ms)
const FLOWERS = [
  { x: 222, y: 28, r: 13, delay: 400 },
  { x: 192, y: 50, r: 11, delay: 520 },
  { x: 150, y: 26, r: 12, delay: 640 },
  { x: 160, y: 74, r: 14, delay: 700 },
  { x: 128, y: 100, r: 12, delay: 820 },
  { x: 98, y: 158, r: 13, delay: 940 },
  { x: 100, y: 122, r: 10, delay: 1000 },
  { x: 54, y: 116, r: 11, delay: 1080 },
  { x: 66, y: 146, r: 12, delay: 1140 },
  { x: 22, y: 166, r: 11, delay: 1240 },
];

export function SakuraBranch() {
  const enter = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    // withRepeat(..., -1, true): sonsuza kadar ileri-geri tekrarla → rüzgârda sallanma
    sway.value = withDelay(
      700,
      withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [enter, sway]);

  const style = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateX: (1 - enter.value) * 60 },
      { translateY: (1 - enter.value) * -60 },
      { rotate: `${sway.value * 3}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.branch, style]} pointerEvents="none">
      <Svg width={BOX} height={BOX}>
        {/* Ana dal: kalından inceye üç parça, doğal bir görünüm için */}
        <Path d="M 270 4 C 235 20, 205 40, 170 66" stroke={BARK} strokeWidth={9} strokeLinecap="round" fill="none" />
        <Path d="M 170 66 C 145 88, 120 108, 88 132" stroke={BARK} strokeWidth={6} strokeLinecap="round" fill="none" />
        <Path d="M 88 132 C 65 148, 42 160, 14 170" stroke={BARK} strokeWidth={3.5} strokeLinecap="round" fill="none" />
        {/* Yan filizler */}
        <Path d="M 186 54 Q 168 36 150 26" stroke={BARK} strokeWidth={3} strokeLinecap="round" fill="none" />
        <Path d="M 120 108 Q 106 134 98 158" stroke={BARK} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        <Path d="M 78 139 Q 64 126 54 116" stroke={BARK} strokeWidth={2} strokeLinecap="round" fill="none" />
        {/* Tomurcuklar */}
        <Circle cx={206} cy={22} r={3.5} fill={PETAL_DARK} />
        <Circle cx={140} cy={60} r={3} fill={PETAL_DARK} />
        <Circle cx={40} cy={150} r={3} fill={PETAL_DARK} />
      </Svg>
      {FLOWERS.map((f, i) => (
        <Blossom key={i} {...f} />
      ))}
    </Animated.View>
  );
}

// Tek bir çiçek: 5 taç yaprak + ortada koyu pembe göbek. Gecikmeli olarak "açılır".
function Blossom({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) {
  const bloom = useSharedValue(0);

  useEffect(() => {
    bloom.value = withDelay(delay, withSpring(1, { damping: 9, stiffness: 120 }));
  }, [bloom, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: bloom.value }, { rotate: `${(1 - bloom.value) * -90}deg` }],
  }));

  const size = r * 2;
  return (
    <Animated.View style={[{ position: 'absolute', left: x - r, top: y - r, width: size, height: size }, style]}>
      {/* viewBox: içerideki çizim hep -12..12 aralığında; width/height ile istediğimiz boyuta ölçeklenir */}
      <Svg width={size} height={size} viewBox="-12 -12 24 24">
        {[0, 72, 144, 216, 288].map((angle) => (
          <G key={angle} transform={`rotate(${angle})`}>
            <Ellipse cx={0} cy={-5.5} rx={4.4} ry={6} fill={PETAL} />
          </G>
        ))}
        <Circle r={2.6} fill={PETAL_DARK} />
      </Svg>
    </Animated.View>
  );
}

// Yağan yaprakların ayarları. Modül yüklenirken bir kez rastgele üretilir.
const PETALS = Array.from({ length: 14 }, () => ({
  x: Math.random(), // Ekran genişliğinin yüzde kaçından başlasın (0..1)
  size: 10 + Math.random() * 8,
  duration: 4000 + Math.random() * 3000,
  delay: Math.random() * 2500,
  sway: 20 + Math.random() * 30,
  spin: Math.random() > 0.5 ? 1 : -1,
}));

export function FallingPetals() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PETALS.map((p, i) => (
        <FallingPetal key={i} {...p} />
      ))}
    </View>
  );
}

function FallingPetal({ x, size, duration, delay, sway, spin }: (typeof PETALS)[number]) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    // 0 → 1 arasında düz hızla git, bitince baştan başla (sonsuz döngü)
    progress.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1));
  }, [progress, delay, duration]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    return {
      opacity: t === 0 ? 0 : 0.9,
      transform: [
        { translateX: x * width + Math.sin(t * Math.PI * 4) * sway }, // sinüs = sağa sola salınım
        { translateY: -30 + t * (height + 60) },
        { rotate: `${t * 360 * spin}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.petal,
        { width: size, height: size * 0.7, borderTopLeftRadius: size, borderBottomRightRadius: size },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  branch: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: BOX,
    height: BOX,
    transformOrigin: 'top right', // Sallanma dalın köşedeki kökünden olsun
  },
  petal: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: PETAL,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
  },
});
