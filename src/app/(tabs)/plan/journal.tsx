// Gezi defteri: gidilen yerlere eklenen anılar (his, not, fotoğraf) gün gün. Planım'daki "Gezi defteri" kartından açılır.
// Adres: /plan/journal. Fotoğrafa dokununca tam ekran açılır (belge görüntüleyici).
import { Image } from 'expo-image';
import { Link, router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { serifText } from '@/constants/fonts';
import { attachmentFile } from '@/data/attachments';
import { placeOf } from '@/data/plan-place';
import { formatDateKey, hasMemory, orderedStops, useTrip } from '@/hooks/use-trip';

export default function JournalScreen() {
  const days = useTrip();
  // Sadece anısı olan duraklar; hiç anısı olmayan günler atlanır
  const pages = days
    .map((day, i) => ({ day, number: i + 1, stops: orderedStops(day).filter(hasMemory) }))
    .filter((page) => page.stops.length > 0);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Gezi defteri' }} />

      {pages.length === 0 && (
        <Text style={styles.empty}>
          Gittiğin bir yeri işaretleyip ona dokununca “Anı” bölümü açılır. His, bir cümle ve fotoğraf ekledikçe burada
          birikir.
        </Text>
      )}

      {pages.map(({ day, number, stops }) => (
        <View key={day.id} style={styles.page}>
          <Text style={styles.dayTitle}>
            {number}. gün · {formatDateKey(day.date)}
          </Text>
          {stops.map((stop) => {
            const place = placeOf(stop);
            const memory = stop.memory!;
            return (
              // Karta dokununca durak sayfası (anıyı düzenlemek için)
              <Link key={stop.id} href={{ pathname: '/stop', params: { id: stop.id } }} asChild>
                <Pressable style={styles.card} accessibilityRole="button">
                  <View style={styles.cardTop}>
                    <Text style={styles.name} numberOfLines={1}>
                      {place?.name ?? 'Yer'}
                    </Text>
                    {memory.mood && <Text style={styles.mood}>{memory.mood}</Text>}
                  </View>
                  {memory.text?.trim() ? <Text style={styles.text}>{memory.text.trim()}</Text> : null}
                  {(memory.photos?.length ?? 0) > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
                      {memory.photos!.map((photo) => (
                        <Pressable
                          key={photo.id}
                          onPress={() =>
                            router.push({
                              pathname: '/attachment',
                              params: { file: photo.fileName, kind: photo.kind, title: place?.name ?? photo.title },
                            })
                          }
                          accessibilityRole="imagebutton"
                          accessibilityLabel={`${place?.name ?? 'Yer'} fotoğrafı`}>
                          <Image
                            source={{ uri: attachmentFile(photo.fileName).uri }}
                            style={styles.photo}
                            contentFit="cover"
                          />
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </Pressable>
              </Link>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 24 },
  empty: { fontSize: 15, lineHeight: 22, color: '#6B6B6B', textAlign: 'center', paddingTop: 32 },
  page: { gap: 10 },
  dayTitle: { fontSize: 22, ...serifText, color: '#1A1A1A' },
  card: {
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  mood: { fontSize: 22 },
  text: { fontSize: 15, lineHeight: 22, color: '#4A4A4A' },
  photos: { gap: 8 },
  photo: { width: 140, height: 140, borderRadius: 12 },
});
