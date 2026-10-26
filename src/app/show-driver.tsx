// "Taksiciye göster": telefonu şoföre ya da yol sorduğun kişiye uzatınca okuyacağı tam ekran kart.
// Japonca ad/adres kocaman, üstünde "Buraya lütfen", altta küçük Türkçe ad (senin kontrolün için).
// Japonya'da İngilizce/Latin harfli adresi çoğu şoför okuyamıyor; Japonca ad ya da adres işi çözüyor.
// Adres: /show-driver?text=浅草寺&name=Sensō-ji
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ShowDriverScreen() {
  const { text, name } = useLocalSearchParams<{ text: string; name?: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>
      <Pressable
        onPress={() => router.back()}
        style={styles.close}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Kapat">
        <SymbolView name={{ ios: 'xmark', android: 'close' }} size={20} weight="semibold" tintColor="#1A1A1A" />
      </Pressable>

      <View style={styles.body}>
        {/* "Buraya lütfen" (kibar, taksiye binince söylenen kalıp) */}
        <Text style={styles.please}>ここまでお願いします</Text>
        {/* adjustsFontSizeToFit: uzun adres sığana kadar küçülür, kısa ad kocaman kalır */}
        <Text style={styles.text} adjustsFontSizeToFit numberOfLines={6} minimumFontScale={0.3}>
          {text}
        </Text>
      </View>

      {name ? <Text style={styles.name}>{name}</Text> : null}
      <Text style={styles.hint}>Bu ekranı şoföre ya da yol sorduğun kişiye göster</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Beyaz zemin, siyah yazı: en yüksek kontrast, güneşte de okunur
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  close: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1EEE9',
  },
  body: { flex: 1, justifyContent: 'center', gap: 24 },
  please: { fontSize: 22, color: '#C8102E', fontWeight: '700', textAlign: 'center' },
  // lineHeight vermiyoruz: yazı küçülünce satır aralığı da onunla küçülsün
  text: { fontSize: 64, fontWeight: '700', color: '#000000', textAlign: 'center' },
  name: { fontSize: 17, color: '#4A4A4A', textAlign: 'center', marginBottom: 6 },
  hint: { fontSize: 13, color: '#8A847C', textAlign: 'center' },
});
