// Şehir sayfası: fotoğraf, hızlı bilgi, yerler (kategori filtreli), 1 günlük rota, yemekler, alışveriş, pratik bilgiler.
// Keşfet sekmesinin Stack'i içinde açılır (sekme çubuğu görünür kalır). Adres: /city/kyoto
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef, useScrollOffset } from 'react-native-reanimated';

import { Chip } from '@/components/chip';
import { DayPlan, FoodList, QuickFacts, Section, ShopList, TipList } from '@/components/city-guide';
import { PhotoCredit } from '@/components/photo-credit';
import { PlaceCard } from '@/components/place-card';
import { ScrollOffsetContext } from '@/components/rail-divider';
import { serifText } from '@/constants/fonts';
import { getCityGuide } from '@/data/city-guides';
import { getCity, getPlacesInCity, Place } from '@/data/places';
import { getShopsInCity } from '@/data/shops';

export default function CityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const city = getCity(id);
  const guide = getCityGuide(id);
  const [category, setCategory] = useState<Place['category'] | null>(null);
  // Sayfanın ne kadar kaydırıldığı, UI thread'de güncellenir. Tren yolları ekrana girince treni yola çıkarmak için okur.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  if (!city) {
    return (
      <View style={styles.center}>
        <Text>Şehir bulunamadı.</Text>
      </View>
    );
  }

  const cityPlaces = getPlacesInCity(city.name);
  // Sadece bu şehirde gerçekten olan kategorileri göster (Set = tekrar edenleri at)
  const categories = [...new Set(cityPlaces.map((p) => p.category))];
  const countOf = (c: Place['category']) => cityPlaces.filter((p) => p.category === c).length;
  const places = category ? cityPlaces.filter((p) => p.category === category) : cityPlaces;
  const shops = getShopsInCity(city.name);

  return (
    // Şehir başına birkaç yer var; ScrollView yeterli. (Yüzlerce olsaydı FlatList/SectionList kullanırdık.)
    // Animated.ScrollView: Reanimated'in kaydırmayı UI thread'de izleyebilmesi için
    <Animated.ScrollView
      ref={scrollRef}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: city.name, headerLargeTitle: false }} />

      <View style={styles.hero}>
        <Image source={city.image.uri} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        <PhotoCredit photo={city.image} />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.name} maxFontSizeMultiplier={1.4}>
          {city.name}
        </Text>
        <Text style={styles.japanese}>{city.japaneseName}</Text>
      </View>
      <Text style={styles.tagline}>{city.tagline}</Text>

      {/* Gezginin ilk soruları: ne zaman, kaç gün, nasıl gidilir? */}
      {guide && <QuickFacts guide={guide} />}

      <Section title="Görülecek yerler">
        {/* Kategori sayısı az ve sabit (en fazla 5): chip'lerin doğru kullanım yeri burası */}
        {categories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}>
            <Chip label="Tümü" count={cityPlaces.length} active={category === null} onPress={() => setCategory(null)} />
            {categories.map((c) => (
              <Chip key={c} label={c} count={countOf(c)} active={category === c} onPress={() => setCategory(c)} />
            ))}
          </ScrollView>
        )}
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </Section>

      {guide && (
        <>
          <Section title={`1 günde ${city.name}`}>
            <DayPlan steps={guide.dayPlan} />
          </Section>
          <Section title="Ne yenir?">
            <FoodList foods={guide.foods} />
          </Section>
          {shops.length > 0 && (
            <Section title="Ne alınır?">
              {/* Dükkanların arasındaki tren yolları, ekrana girdiklerini anlamak için kaydırma miktarını buradan okur */}
              <ScrollOffsetContext value={scrollOffset}>
                <ShopList shops={shops} />
              </ScrollOffsetContext>
            </Section>
          )}
          <Section title="Pratik bilgiler">
            <TipList tips={guide.tips} />
          </Section>
        </>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  hero: {
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E5DED4',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 },
  name: { fontSize: 38, ...serifText, color: '#1A1A1A' },
  japanese: { fontSize: 20, color: '#C8102E', fontWeight: '600' },
  tagline: { fontSize: 16, lineHeight: 23, color: '#444444' },
  chipsScroll: { marginHorizontal: -16 }, // Kaydırma ekran kenarından kenarına olsun
  chips: { gap: 8, paddingHorizontal: 16 },
});
