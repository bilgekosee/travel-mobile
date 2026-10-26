// Günün duraklarını sürükleyerek sıralama. Planım'da günün ⋯ menüsündeki "Sırala"dan alttan açılır. Adres: /day-order?day=…
// Liste: Sabah / Öğle / Akşam başlıkları ve aralarında duraklar. Sağdaki ≡ tutamaçtan tutup sürükle;
// başka bir başlığın altına bırakılan durağın dilimi de değişir.
//
// Nasıl çalışıyor: her satır sabit yükseklikte ve "position: absolute" ile sıra × ROW noktasına konuyor.
// positions = { satırAnahtarı: sıra }. Sürüklenen satır parmağı izler; başka bir satırın yarısını geçince
// ikisi yer değiştirir, diğeri yaylanarak (withSpring) yeni yerine kayar. Bu hesaplar Reanimated'ın "worklet"leriyle
// telefonun UI thread'inde çalışır: JavaScript meşgulken bile sürükleme akıcı kalır. Parmak kalkınca yeni sıra
// JS tarafına gönderilip kaydedilir.
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { DAY_SLOTS, DAY_THEME, type DaySlot } from '@/constants/day-slots';
import { placeOf } from '@/data/plan-place';
import { formatDateKey, reorderStops, type TripDay, type TripStop, useTrip } from '@/hooks/use-trip';

const ROW = 56; // Her satırın yüksekliği (başlıklar dahil): sıra × ROW = satırın konumu
const SPRING = { damping: 20, stiffness: 220 }; // Kısa, zıplamasız bir yay

type Entry = { key: string; header?: DaySlot; stop?: TripStop };
type Positions = Record<string, number>;

export default function DayOrderScreen() {
  const { day: dayId } = useLocalSearchParams<{ day: string }>();
  const day = useTrip().find((d) => d.id === dayId);

  return (
    // Jest kütüphanesi bu sarmalayıcıyı istiyor. Alttan açılan sayfa ayrı bir native pencere: burada da gerekli.
    <GestureHandlerRootView style={styles.flex}>
      {day ? <OrderList day={day} /> : <Text style={styles.hint}>Gün bulunamadı.</Text>}
    </GestureHandlerRootView>
  );
}

function OrderList({ day }: { day: TripDay }) {
  // Satırlar ilk açılıştaki sırayla bir kez oluşturulur; sonrasında sırayı sadece positions değiştirir.
  // (Her kayıtta listeyi baştan kursaydık, sürükleme sırasında satırlar yerinden zıplardı.)
  const [entries] = useState<Entry[]>(() =>
    DAY_SLOTS.flatMap((slot) => [
      { key: `header-${slot}`, header: slot },
      ...day.stops.filter((s) => s.slot === slot).map((stop) => ({ key: stop.id, stop })),
    ]),
  );
  const positions = useSharedValue<Positions>(Object.fromEntries(entries.map((e, i) => [e.key, i])));

  // Parmak kalkınca: satırları yeni sıraya diz, her durağın dilimi üstündeki en yakın başlık
  function save(final: Positions) {
    const sorted = [...entries].sort((a, b) => final[a.key] - final[b.key]);
    let slot: DaySlot = 'Sabah';
    const order: { id: string; slot: DaySlot }[] = [];
    for (const entry of sorted) {
      if (entry.header) slot = entry.header;
      else if (entry.stop) order.push({ id: entry.stop.id, slot });
    }
    reorderStops(day.id, order);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDateKey(day.date)}</Text>
      <Text style={styles.hint}>≡ tutamaçtan tutup sürükle. Başka bir bölüme bırakırsan dilimi de değişir.</Text>
      <View style={{ height: entries.length * ROW }}>
        {entries.map((entry, index) => (
          <Row key={entry.key} entry={entry} index={index} count={entries.length} positions={positions} onDrop={save} />
        ))}
      </View>
    </View>
  );
}

type RowProps = {
  entry: Entry;
  index: number; // İlk sırası
  count: number;
  positions: SharedValue<Positions>;
  onDrop: (positions: Positions) => void;
};

function Row({ entry, index, count, positions, onDrop }: RowProps) {
  const top = useSharedValue(index * ROW);
  const dragging = useSharedValue(false);
  const startTop = useSharedValue(0);

  // Başka bir satır bununla yer değiştirince (positions değişince) yeni yerine yaylanarak kay.
  // Sürüklenen satırın kendisi parmağı izliyor, onu burada taşımıyoruz.
  // .get() / .set(): shared value'yu okuma/yazma. ".value =" ile de olur ama React Compiler'ın kuralları
  // render sırasında tanımlanan fonksiyonlarda atamayı yasaklıyor; Reanimated bu yüzden get/set öneriyor.
  useAnimatedReaction(
    () => positions.get()[entry.key],
    (next, previous) => {
      if (next !== previous && !dragging.get()) top.set(withSpring(next * ROW, SPRING));
    },
  );

  // Sadece tutamaçtan tutulunca başlar (Pan = sürükleme hareketi)
  const pan = Gesture.Pan()
    .onStart(() => {
      dragging.set(true);
      startTop.set(top.get());
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Medium); // "Tuttum" hissi
    })
    .onUpdate((e) => {
      // En üste (Sabah başlığının üstüne) ve en alta taşmasın
      const y = Math.min(Math.max(startTop.get() + e.translationY, ROW), (count - 1) * ROW);
      top.set(y);
      const newIndex = Math.round(y / ROW);
      const current = positions.get();
      const oldIndex = current[entry.key];
      if (newIndex !== oldIndex) {
        // O sıradaki satırla yer değiştir
        const next = { ...current };
        const otherKey = Object.keys(next).find((key) => next[key] === newIndex);
        if (otherKey) next[otherKey] = oldIndex;
        next[entry.key] = newIndex;
        positions.set(next);
        scheduleOnRN(Haptics.selectionAsync); // Her yer değişiminde hafif bir "tık"
      }
    })
    .onEnd(() => {
      top.set(withSpring(positions.get()[entry.key] * ROW, SPRING));
      scheduleOnRN(onDrop, positions.get());
    })
    .onFinalize(() => {
      dragging.set(false);
    });

  // Satırın konumu ve sürüklenirken öne çıkması (gölge + üstte kalma)
  const animatedStyle = useAnimatedStyle(() => ({
    top: top.get(),
    zIndex: dragging.get() ? 10 : 1,
    boxShadow: dragging.get() ? '0 6px 16px rgba(0,0,0,0.18)' : '0 0 0 rgba(0,0,0,0)',
  }));

  if (entry.header) {
    const theme = DAY_THEME[entry.header];
    return (
      <Animated.View style={[styles.row, styles.headerRow, animatedStyle]}>
        <SymbolView name={theme.icon} size={16} tintColor={theme.color} />
        <Text style={[styles.headerText, { color: theme.color }]}>{entry.header}</Text>
      </Animated.View>
    );
  }

  const stop = entry.stop!;
  const place = placeOf(stop);
  return (
    <Animated.View style={[styles.row, styles.stopRow, animatedStyle]}>
      <View style={[styles.kindIcon, { backgroundColor: place?.color ?? '#8A847C' }]}>
        {place && <SymbolView name={place.icon} size={13} tintColor="#FFFFFF" />}
      </View>
      {stop.time && <Text style={styles.time}>{stop.time}</Text>}
      <Text style={styles.name} numberOfLines={1}>
        {place?.name ?? 'Yer'}
      </Text>
      <GestureDetector gesture={pan}>
        {/* Tutamaç: dokunma alanı geniş (44 nokta) */}
        <View style={styles.handle} accessibilityLabel={`${place?.name ?? 'Yer'} sürükle`}>
          <SymbolView name={{ ios: 'line.3.horizontal', android: 'drag_handle' }} size={20} tintColor="#8A847C" />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 32, gap: 8 },
  date: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  hint: { fontSize: 14, color: '#6B6B6B', marginBottom: 8 },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ROW,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
  },
  headerRow: { paddingHorizontal: 4, alignItems: 'flex-end', paddingBottom: 8 },
  headerText: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  stopRow: { paddingLeft: 12, backgroundColor: '#FFFFFF', height: ROW - 6 }, // Satırlar arasında 6 nokta boşluk
  kindIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  time: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  name: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  handle: { width: 48, height: '100%', alignItems: 'center', justifyContent: 'center' },
});
