// "Plana ekle" sayfası: bir yeri hangi güne, günün hangi dilimine ekleyeceğini seçersin.
// Yer sayfasındaki ve harita kartındaki "Plana ekle" düğmesinden alttan açılır. Adres: /add-to-plan?item=place-sensoji
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SlotChip } from '@/components/slot-chip';
import { DAY_SLOTS, type DaySlot } from '@/constants/day-slots';
import { serifText } from '@/constants/fonts';
import { MAP_KINDS } from '@/constants/map-kinds';
import { MAP_ITEMS } from '@/data/map-items';
import { addDay, addStop, formatDateKey, hasMemory, removeStop, type TripDay, useTrip } from '@/hooks/use-trip';

const RED = '#C8102E';

export default function AddToPlanScreen() {
  const { item: itemId } = useLocalSearchParams<{ item: string }>();
  const item = MAP_ITEMS.find((i) => i.id === itemId);
  const days = useTrip();

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Yer bulunamadı.</Text>
      </View>
    );
  }

  // Seçiliyse çıkar, değilse ekle
  function toggle(day: TripDay, slot: DaySlot) {
    const existing = day.stops.find((s) => s.slot === slot && s.itemId === itemId);
    if (!existing) {
      addStop(day.id, slot, itemId);
      Haptics.selectionAsync(); // Seçim değişti: hafif bir "tık"
      return;
    }
    // Durakta kaybolacak bir şey varsa (not, belge, anı) önce sor: çip hafif bir seçici gibi görünüyor,
    // ama çıkarmak belgelerin dosyalarını da telefondan siler. Boş durak tek dokunuşla çıkar.
    const hasContent = !!existing.note?.trim() || (existing.files?.length ?? 0) > 0 || hasMemory(existing);
    if (!hasContent) {
      removeStop(existing.id);
      Haptics.selectionAsync();
      return;
    }
    Alert.alert(`${item!.name} bu günden çıkarılsın mı?`, 'Notu, belgeleri ve anısı da silinecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Çıkar', style: 'destructive', onPress: () => removeStop(existing.id) },
    ]);
  }

  return (
    // contentInsetAdjustmentBehavior: içerik başlık çubuğunun altından başlasın, altında kalmasın
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {/* Hangi yeri ekliyoruz? ("Tamam" düğmesi kök _layout'tan geliyor) */}
      <View style={styles.itemRow}>
        <View style={[styles.kindIcon, { backgroundColor: MAP_KINDS[item.kind].color }]}>
          <SymbolView name={MAP_KINDS[item.kind].icon} size={18} tintColor="#FFFFFF" />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>
            {item.label} · {item.city}
          </Text>
        </View>
      </View>

      {days.length === 0 ? (
        <Text style={styles.hint}>Henüz planında gün yok. İlk günü ekle, tarihini sonra Planım’dan değiştirebilirsin.</Text>
      ) : (
        <Text style={styles.hint}>Hangi güne, günün hangi saatine?</Text>
      )}

      {days.map((day) => (
        <View key={day.id} style={styles.day}>
          <Text style={styles.dayDate}>{formatDateKey(day.date)}</Text>
          <View style={styles.slots}>
            {DAY_SLOTS.map((slot) => (
              <SlotChip
                key={slot}
                slot={slot}
                selected={day.stops.some((s) => s.slot === slot && s.itemId === itemId)}
                onPress={() => toggle(day, slot)}
              />
            ))}
          </View>
        </View>
      ))}

      <Pressable style={styles.addDay} onPress={() => addDay()} accessibilityRole="button">
        <SymbolView name={{ ios: 'plus.circle.fill', android: 'add_circle' }} size={20} tintColor={RED} />
        <Text style={styles.addDayText}>{days.length === 0 ? 'İlk günü ekle' : 'Yeni gün ekle'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, gap: 14, paddingBottom: 40 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kindIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, gap: 2 },
  itemName: { fontSize: 22, ...serifText, color: '#1A1A1A' },
  itemMeta: { fontSize: 14, color: '#6B6B6B' },
  hint: { fontSize: 15, color: '#555555', marginTop: 4 },
  day: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  dayDate: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addDay: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-start' },
  addDayText: { fontSize: 16, fontWeight: '600', color: RED },
});
