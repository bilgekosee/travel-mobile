// Ana ekran: kendi çizdiğimiz başlık + arama kutusu + şehir ızgarası (ya da arama sonuçları).
// Dosya yolu = ekran adresi. src/app/(tabs)/(explore)/index.tsx -> "/" (parantezli klasörler adrese eklenmez)
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { CityCard } from '@/components/city-card';
import { PlaceCard } from '@/components/place-card';
import { serifText } from '@/constants/fonts';
import { CITIES, getPlacesInCity, PLACES } from '@/data/places';

const PADDING = 20;
const GAP = 12;

// Aramayı esnek yapmak için: küçük harfe çevir ve aksanları at ("Sensō-ji" → "senso-ji", "İ" → "i").
function normalize(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  // 2 sütun: ekran genişliği - kenar boşlukları - aradaki boşluk, ikiye bölünür
  const cardWidth = (width - PADDING * 2 - GAP) / 2;

  const q = normalize(query.trim());
  const results = q
    ? PLACES.filter((p) => normalize(`${p.name} ${p.japaneseName} ${p.city} ${p.category}`).includes(q))
    : [];

  return (
    // Tek bir ScrollView: başlık + arama kutusu hep aynı yerde kalır; altındaki içerik değişir.
    // (FlatList'i ızgara ↔ liste arasında değiştirseydik, arama kutusu yeniden oluşur ve klavye kapanırdı.)
    <ScrollView
      contentInsetAdjustmentBehavior="automatic" // Durum çubuğu ve sekme çubuğu altında kalmasın
      contentContainerStyle={styles.container}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled">
      {/* Bu ekranda native başlık çubuğunu gizliyoruz; başlığı aşağıda kendimiz çiziyoruz */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>日本 · JAPONYA</Text>
        {/* Zaten çok büyük bir başlık: en fazla 1.4 katına büyüsün, yoksa ekrana sığmaz.
            Normal metinlere sınır koymuyoruz; kullanıcı ne seçtiyse o boyutta görünür. */}
        <Text style={styles.title} maxFontSizeMultiplier={1.4}>
          Gezi Rehberi
        </Text>
        <Text style={styles.stats}>
          {CITIES.length} şehir · {PLACES.length} yer
        </Text>
      </View>

      <View style={styles.search}>
        {/* SF Symbols: iOS'un kendi ikon seti. Android'de Material ikonu kullanılır. */}
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search' }}
          size={18}
          tintColor="#6E6860"
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Yer, şehir veya kategori ara"
          placeholderTextColor="#6E6860"
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
        {/* hitSlop: 18pt'lik ikonun dokunma alanını her yönden 13pt büyütür → 44pt (Apple'ın önerdiği en küçük alan) */}
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={13} accessibilityLabel="Aramayı temizle">
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'cancel' }}
              size={18}
              tintColor="#8A847C"
            />
          </Pressable>
        )}
      </View>

      {q ? (
        // Arama modu: tüm şehirlerdeki yerler arasında sonuçlar
        <View style={styles.results}>
          {results.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
          {results.length === 0 && (
            <Text style={styles.emptyText}>&quot;{query}&quot; için sonuç bulunamadı.</Text>
          )}
        </View>
      ) : (
        // Keşif modu: 2 sütunlu şehir ızgarası. flexWrap: sığmayan kart alt satıra geçer (CSS'teki gibi).
        <>
          <Text style={styles.sectionTitle}>Şehirler</Text>
          <View style={styles.grid}>
            {CITIES.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                placeCount={getPlacesInCity(city.name).length}
                style={{ width: cardWidth }}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// StyleSheet: CSS'e benzer ama JS objesi. Birimler px değil "dp" (cihazdan bağımsız nokta).
const styles = StyleSheet.create({
  container: { padding: PADDING, paddingTop: 12, gap: 16 },
  header: { gap: 2, marginTop: 8 },
  eyebrow: { fontSize: 13, fontWeight: '700', color: '#C8102E', letterSpacing: 2 },
  title: { fontSize: 46, ...serifText, color: '#1A1A1A' },
  stats: { fontSize: 15, color: '#6B6B6B' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    minHeight: 46, // Sabit height değil: büyük yazı ayarında kutu da büyüsün, yazı kesilmesin
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  sectionTitle: { fontSize: 26, ...serifText, color: '#1A1A1A', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  results: { gap: 12 },
  emptyText: { fontSize: 15, color: '#6B6B6B', textAlign: 'center', paddingTop: 32 },
});
