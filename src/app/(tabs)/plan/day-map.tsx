// Günün haritası: Planım'da günün 🗺 düğmesinden açılır. Adres: /plan/day-map?day=…
// plan/ klasöründe olduğu için Planım sekmesinin kendi Stack'inde açılır: sekme çubuğu yerinde, geri düğmesi plana döner.
// Üstte harita (numaralı pinler + yol), altta yatay kaydırılan durak kartları. Karta dokun → harita oraya gider;
// pine dokun → kartlar o karta kayar. Seçili kartta "Yol tarifi": gezerken "şimdi oraya nasıl giderim?" sorusu için.
import { Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DayMap, type DayMapStop } from '@/components/day-map';
import { DAY_THEME } from '@/constants/day-slots';
import { directionsUrl } from '@/constants/directions';
import { MAP_ITEMS } from '@/data/map-items';
import { formatDateKey, orderedStops, useTrip } from '@/hooks/use-trip';

const RED = '#C8102E';
const TAB_BAR_HEIGHT = 60; // Harita sekmesindeki gibi: kartlar yüzen sekme çubuğunun altında kalmasın
const CARD_WIDTH = 240;
const CARD_GAP = 10;
const CARDS_HEIGHT = 120; // Kart şeridinin yaklaşık yüksekliği: harita pinleri bunun altına düşürmesin

export default function DayMapScreen() {
  const { day: dayId } = useLocalSearchParams<{ day: string }>();
  const days = useTrip();
  const index = days.findIndex((d) => d.id === dayId);
  const day = days[index];
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>();
  const cardsRef = useRef<ScrollView>(null);

  if (!day) {
    return (
      <View style={styles.center}>
        <Text>Gün bulunamadı.</Text>
      </View>
    );
  }

  // Gidiliş sırası (Sabah → Öğle → Akşam) = pinlerdeki numaralar
  const stops: DayMapStop[] = orderedStops(day)
    .flatMap((stop) => {
      const item = MAP_ITEMS.find((i) => i.id === stop.itemId);
      return item ? [{ stop, item }] : []; // Veriden kaldırılmış yeri atla (flatMap: boş dizi = bu elemanı çıkar)
    })
    .map((s, i) => ({ ...s, number: i + 1 }));

  const bottom = insets.bottom + TAB_BAR_HEIGHT;

  // Pine dokunulunca: kartı seç ve kart şeridini ona kaydır
  function selectFromMap(stopId: string) {
    setSelectedId(stopId);
    const i = stops.findIndex((s) => s.stop.id === stopId);
    cardsRef.current?.scrollTo({ x: i * (CARD_WIDTH + CARD_GAP), animated: true });
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${index + 1}. gün · ${formatDateKey(day.date)}`, headerLargeTitle: false }} />

      <DayMap
        stops={stops}
        selectedId={selectedId}
        onSelect={selectFromMap}
        edgePadding={{ top: 60, right: 60, bottom: bottom + CARDS_HEIGHT, left: 60 }}
      />

      <ScrollView
        ref={cardsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.cards, { bottom: bottom + 8 }]}
        contentContainerStyle={styles.cardsContent}
        snapToInterval={CARD_WIDTH + CARD_GAP} // Kaydırma bir kartın başında dursun, yarım kart kalmasın
        decelerationRate="fast">
        {stops.map(({ stop, item, number }) => {
          const selected = stop.id === selectedId;
          const theme = DAY_THEME[stop.slot];
          return (
            <Pressable
              key={stop.id}
              onPress={() => setSelectedId(stop.id)}
              style={[styles.card, selected && styles.cardSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <View style={styles.cardTop}>
                <View style={[styles.badge, { backgroundColor: stop.done ? '#9A948C' : theme.color }]}>
                  <Text style={styles.badgeText}>{number}</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.cardMeta} numberOfLines={1}>
                {stop.slot} · {item.label}
                {stop.done ? ' · Gidildi ✓' : ''}
              </Text>
              {selected && (
                <Pressable
                  onPress={() => Linking.openURL(directionsUrl(item.coordinates))}
                  style={styles.directions}
                  accessibilityRole="link">
                  <SymbolView
                    name={{ ios: 'arrow.triangle.turn.up.right.circle.fill', android: 'directions' }}
                    size={18}
                    tintColor={RED}
                  />
                  <Text style={styles.directionsText}>Yol tarifi</Text>
                </Pressable>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cards: { position: 'absolute', left: 0, right: 0, flexGrow: 0 },
  cardsContent: { paddingHorizontal: 16, gap: CARD_GAP, alignItems: 'flex-end' },
  card: {
    width: CARD_WIDTH,
    padding: 14,
    gap: 4,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  cardSelected: { borderColor: RED },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  cardName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  cardMeta: { fontSize: 13, color: '#6B6B6B' },
  directions: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, marginTop: 2 },
  directionsText: { fontSize: 15, fontWeight: '600', color: RED },
});
