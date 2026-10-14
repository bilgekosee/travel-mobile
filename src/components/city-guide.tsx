// Şehir sayfasının rehber bölümleri: hızlı bilgi, 1 günlük rota, yemekler, pratik bilgiler.
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PhotoCredit } from '@/components/photo-credit';
import { serifText } from '@/constants/fonts';
import { CityGuide, Food } from '@/data/city-guides';

const RED = '#C8102E';

// Başlıklı bölüm kabı. children = etiketlerin arasına yazılan içerik (webdeki slot gibi).
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

// Fotoğrafın altındaki temel bilgiler. Yatay kaydırma yerine alt alta satırlar:
// 3 öğe + metin ağırlıklı + temel bilgi → hepsi kaydırmadan görünmeli, hiçbir kelime kesilmemeli.
export function QuickFacts({ guide }: { guide: CityGuide }) {
  const facts: { icon: SymbolViewProps['name']; label: string; value: string }[] = [
    { icon: { ios: 'calendar', android: 'calendar_month' }, label: 'En iyi zaman', value: guide.bestTime },
    { icon: { ios: 'clock', android: 'schedule' }, label: 'Önerilen süre', value: guide.duration },
    { icon: { ios: 'tram.fill', android: 'train' }, label: 'Ulaşım', value: guide.access },
  ];

  return (
    <View style={styles.card}>
      {facts.map((f, i) => (
        <View key={f.label} style={[styles.fact, i > 0 && styles.divider]}>
          <SymbolView name={f.icon} size={20} tintColor={RED} style={styles.factIcon} />
          <View style={styles.factText}>
            <Text style={styles.factLabel}>{f.label}</Text>
            <Text style={styles.factValue}>{f.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// Günün her anının kendi rengi ve ikonu: şafak turuncusu, öğle güneşi altını, gece indigosu.
// Renkler beyaz kart üstünde 12pt etiket için WCAG 4.5:1 kontrastı geçecek koyulukta seçildi.
type DayTime = CityGuide['dayPlan'][number]['time'];
const DAY_THEME: Record<DayTime, { color: string; icon: SymbolViewProps['name'] }> = {
  Sabah: { color: '#C2410C', icon: { ios: 'sunrise.fill', android: 'wb_twilight' } }, // 5.18:1
  Öğle: { color: '#A16207', icon: { ios: 'sun.max.fill', android: 'light_mode' } }, // 4.92:1
  Akşam: { color: '#4338CA', icon: { ios: 'moon.stars.fill', android: 'dark_mode' } }, // 7.90:1
};

// Sabah → Öğle → Akşam zaman çizelgesi. Uygulamada detayı olan duraklar tıklanabilir.
export function DayPlan({ steps }: { steps: CityGuide['dayPlan'] }) {
  return (
    <View style={styles.card}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const theme = DAY_THEME[step.time];
        const nextColor = isLast ? theme.color : DAY_THEME[steps[i + 1].time].color;
        const content = (
          <View style={styles.step}>
            {/* Sol taraf: zamanın ikonu + bir sonraki zamana yumuşak renk geçişli çizgi */}
            <View style={styles.rail}>
              {/* Renk + "1F" = aynı rengin %12 opaklıkta hali (hex'e alfa ekleme) → açık tonlu zemin */}
              <View style={[styles.iconBubble, { backgroundColor: theme.color + '1F' }]}>
                <SymbolView name={theme.icon} size={16} tintColor={theme.color} />
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { experimental_backgroundImage: `linear-gradient(to bottom, ${theme.color}, ${nextColor})` },
                  ]}
                />
              )}
            </View>
            <View style={[styles.stepBody, !isLast && styles.stepBodySpaced]}>
              <Text style={[styles.stepTime, { color: theme.color }]}>{step.time}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            {step.placeId && (
              <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right' }} size={14} tintColor="#8A847C" />
            )}
          </View>
        );

        return step.placeId ? (
          <Link key={i} href={{ pathname: '/place/[id]', params: { id: step.placeId } }} asChild>
            <Pressable>{({ pressed }) => <View style={pressed && { opacity: 0.6 }}>{content}</View>}</Pressable>
          </Link>
        ) : (
          <View key={i}>{content}</View>
        );
      })}
    </View>
  );
}

// Açılır-kapanır (accordion) yemek listesi. Kapalıyken de küçük fotoğraf görünür:
// en önemli bilgi (yemeğin neye benzediği) dokunmadan görülebilsin.
export function FoodList({ foods }: { foods: CityGuide['foods'] }) {
  return (
    // layout={LinearTransition}: bir kart açılınca kutunun boyu zıplamadan, yumuşakça değişir
    <Animated.View style={styles.card} layout={LinearTransition.duration(250)}>
      {foods.map((food, i) => (
        <FoodItem key={food.name} food={food} first={i === 0} />
      ))}
    </Animated.View>
  );
}

function FoodItem({ food, first }: { food: Food; first: boolean }) {
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);

  const toggle = () => {
    setOpen((o) => !o);
    rotation.value = withTiming(open ? 0 : 180, { duration: 250 });
  };
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View layout={LinearTransition.duration(250)} style={[styles.food, !first && styles.divider]}>
      <Pressable
        onPress={toggle}
        style={styles.foodRow}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }} // VoiceOver: "genişletilmiş / daraltılmış"
        accessibilityHint="Fotoğrafı ve içindekileri göster">
        <Image source={food.image.uri} style={styles.foodThumb} contentFit="cover" transition={200} />
        <View style={styles.foodText}>
          <View style={styles.foodHeader}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodJapanese}>{food.japaneseName}</Text>
          </View>
          <Text style={styles.body}>{food.description}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <SymbolView name={{ ios: 'chevron.down', android: 'expand_more' }} size={14} tintColor="#8A847C" />
        </Animated.View>
      </Pressable>

      {/* entering/exiting: öğe ekrana girerken/çıkarken çalışan hazır animasyonlar */}
      {open && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} style={styles.foodDetail}>
          <View style={styles.foodPhoto}>
            <Image source={food.image.uri} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <PhotoCredit photo={food.image} />
          </View>
          <Text style={styles.ingredientsTitle}>İçindekiler</Text>
          <View style={styles.ingredients}>
            {food.ingredients.map((item) => (
              <Text key={item} style={styles.ingredient}>
                {item}
              </Text>
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function TipList({ tips }: { tips: string[] }) {
  return (
    <View style={styles.card}>
      {tips.map((tip, i) => (
        <View key={tip} style={[styles.tip, i > 0 && styles.divider]}>
          <SymbolView name={{ ios: 'lightbulb', android: 'lightbulb' }} size={16} tintColor={RED} />
          <Text style={[styles.body, styles.tipText]}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginTop: 12 },
  sectionTitle: { fontSize: 26, ...serifText, color: '#1A1A1A' },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  body: { fontSize: 15, lineHeight: 21, color: '#555555' },
  divider: { marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5DED4' },

  fact: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  factIcon: { marginTop: 2 },
  factText: { flex: 1, gap: 2 }, // flex: 1 → kalan genişliği al, uzun metin alt satıra sarılsın
  factLabel: { fontSize: 13, color: '#6B6B6B' },
  factValue: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', lineHeight: 22 },

  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rail: { alignItems: 'center', alignSelf: 'stretch', width: 30 },
  iconBubble: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, borderRadius: 1, marginVertical: 4, opacity: 0.5 },
  stepBody: { flex: 1, gap: 2, paddingTop: 4 },
  stepBodySpaced: { paddingBottom: 18 },
  stepTime: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }, // renk DAY_THEME'den
  stepTitle: { fontSize: 16, color: '#1A1A1A', lineHeight: 22 },

  food: { overflow: 'hidden' },
  foodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  foodThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#EFE9E1' },
  foodText: { flex: 1, gap: 2 },
  foodHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  foodName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  foodJapanese: { fontSize: 14, color: RED },
  foodDetail: { gap: 10, marginTop: 12 },
  foodPhoto: {
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EFE9E1',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  ingredientsTitle: { fontSize: 13, fontWeight: '700', color: '#6B6B6B', letterSpacing: 1, textTransform: 'uppercase' },
  ingredients: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ingredient: {
    fontSize: 14,
    color: '#4A4A4A',
    backgroundColor: '#F4EFE8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },

  tip: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipText: { flex: 1 },
});
