// Fotoğraflı kare şehir kartı. Dokununca /city/[id] sayfasına gider.
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { serifText } from '@/constants/fonts';
import { CityInfo } from '@/data/places';

type Props = { city: CityInfo; placeCount: number; style?: StyleProp<ViewStyle> };

export function CityCard({ city, placeCount, style }: Props) {
  return (
    <Link href={{ pathname: '/city/[id]', params: { id: city.id } }} asChild>
      <Pressable style={style}>
        {({ pressed }) => (
          <View style={[styles.card, pressed && styles.pressed]}>
            {/* expo-image: internetten gelen resmi önbelleğe alır, ikinci açılışta anında gösterir. */}
            <Image
              source={city.image.uri}
              style={StyleSheet.absoluteFill}
              contentFit="cover" // CSS'teki object-fit: cover — kareyi doldur, taşanı kırp
              transition={300} // Yüklenince yumuşakça belirsin
            />
            {/* Alttan yukarı koyulaşan gölge: beyaz yazı her fotoğrafta okunabilsin */}
            <View style={styles.shade} />
            {/* Kart kare ve sabit boyutlu: yazı en fazla 1.3 katına büyüsün ki karttan taşmasın */}
            <View style={styles.text}>
              <Text style={styles.japanese} maxFontSizeMultiplier={1.3}>{city.japaneseName}</Text>
              <Text style={styles.name} maxFontSizeMultiplier={1.3}>
                {city.name}
              </Text>
              <Text style={styles.count} maxFontSizeMultiplier={1.3}>{placeCount} yer</Text>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1, // Genişlik kadar yükseklik = kare
    borderRadius: 20,
    overflow: 'hidden', // Resmin köşeleri de yuvarlansın
    backgroundColor: '#E5DED4', // Resim yüklenene kadar görünen renk
    justifyContent: 'flex-end',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  shade: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)',
  },
  text: { padding: 14 },
  japanese: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  name: { color: '#FFFFFF', fontSize: 27, ...serifText },
  count: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
});
