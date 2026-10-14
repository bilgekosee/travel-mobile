// Bir gezilecek yeri gösteren yatay kart. Dokununca /place/[id] detayına gider.
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Place } from '@/data/places';

export function PlaceCard({ place }: { place: Place }) {
  return (
    // Link + asChild: tıklanınca /place/sensoji gibi bir adrese gider.
    <Link href={{ pathname: '/place/[id]', params: { id: place.id } }} asChild>
      <Pressable>
        {/* Link asChild, Pressable'ın fonksiyon şeklindeki style'ını kaybettiği için
            kart stilini içteki View'a veriyoruz. */}
        {({ pressed }) => (
          <View style={[styles.card, pressed && { opacity: 0.7 }]}>
            {/* Fotoğraf yüklenene kadar yerin kendi rengi görünür */}
            <Image
              source={place.image.uri}
              style={[styles.thumb, { backgroundColor: place.color }]}
              contentFit="cover"
              transition={200}
              accessibilityIgnoresInvertColors // Renkleri tersine çevirme ayarında fotoğraf bozulmasın
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardMeta}>
                {place.city} · {place.category}
              </Text>
              <Text style={styles.cardSummary} numberOfLines={2}>
                {place.summary}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Varsayılan "column"; yan yana dizmek için "row"
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  thumb: { width: 76, height: 76, borderRadius: 12 },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  cardMeta: { fontSize: 13, color: '#C8102E', fontWeight: '600' },
  cardSummary: { fontSize: 14, color: '#555555' },
});
