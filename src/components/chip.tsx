// Yuvarlak filtre düğmesi. Seçiliyse kırmızı dolgulu olur.
// count verilirse yanında gösterilir: kullanıcı dokunmadan kaç sonuç göreceğini bilir.
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = { label: string; count?: number; active: boolean; onPress: () => void };

export function Chip({ label, count, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }} // VoiceOver "seçili" diye okur
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
        {/* İç içe Text: aynı satırda farklı stil (webdeki <span> gibi) */}
        {count !== undefined && <Text style={[styles.count, active && styles.countActive]}> {count}</Text>}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EFE9E1',
  },
  chipActive: { backgroundColor: '#C8102E' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#4A4A4A' },
  chipTextActive: { color: '#FFFFFF' },
  count: { fontWeight: '400', color: '#616161' },
  countActive: { color: 'rgba(255,255,255,0.85)' },
});
