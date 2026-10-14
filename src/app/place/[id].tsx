// Detay ekranı. [id] köşeli parantez = dinamik parametre.
// /place/sensoji adresine gidilince id = "sensoji" olur.
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef, useScrollOffset } from 'react-native-reanimated';

import { Section, TipList } from '@/components/city-guide';
import { PhotoCredit } from '@/components/photo-credit';
import { serifText } from '@/constants/fonts';
import { getPlace } from '@/data/places';
import { ScrollOffsetContext } from '@/hooks/use-seen-on-screen';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id);
  // Sayfanın ne kadar kaydırıldığı: ipucu ampulleri ekrana girince yanmak için okur (şehir sayfasındakiyle aynı)
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Yer bulunamadı.</Text>
      </View>
    );
  }

  return (
    // Animated.ScrollView: Reanimated'in kaydırmayı UI thread'de izleyebilmesi için
    <Animated.ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="automatic">
      {/* Ekrandan başlığı dinamik olarak ayarlıyoruz */}
      <Stack.Screen options={{ title: place.name }} />

      {/* Kenardan kenara fotoğraf: detay sayfasında fotoğraf baş roldedir */}
      <View style={[styles.hero, { backgroundColor: place.color }]}>
        <Image
          source={place.image.uri}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.shade} />
        <View style={styles.heroFooter}>
          <Text style={styles.japanese}>{place.japaneseName}</Text>
          <PhotoCredit photo={place.image} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} maxFontSizeMultiplier={1.4}>
          {place.name}
        </Text>

        <View style={styles.badges}>
          <Badge icon={{ ios: 'mappin.and.ellipse', android: 'location_on' }} text={place.city} />
          <Badge icon={{ ios: 'tag', android: 'sell' }} text={place.category} />
          <Badge icon={{ ios: 'clock', android: 'schedule' }} text={place.duration} />
        </View>

        <Text style={styles.description}>{place.description}</Text>

        <Section title="İpuçları">
          <ScrollOffsetContext value={scrollOffset}>
            <TipList tips={place.tips} />
          </ScrollOffsetContext>
        </Section>
      </View>
    </Animated.ScrollView>
  );
}

function Badge({ icon, text }: { icon: SymbolViewProps['name']; text: string }) {
  return (
    <View style={styles.badge}>
      <SymbolView name={icon} size={14} tintColor="#C8102E" />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 300, justifyContent: 'flex-end' },
  // Alttan koyulaşan gölge: fotoğraf ne kadar açık olursa olsun beyaz yazı okunur
  shade: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
  },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16 },
  japanese: { fontSize: 22, color: '#FFFFFF', fontWeight: '600', flexShrink: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  title: { fontSize: 36, ...serifText, color: '#1A1A1A' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFE9E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: { fontSize: 13, color: '#4A4A4A' },
  description: { fontSize: 16, lineHeight: 24, color: '#333333' },
});
