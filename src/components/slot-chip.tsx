// Sabah / Öğle / Akşam seçim düğmesi. Seçiliyse o dilimin rengiyle dolu, değilse açık zeminli.
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text } from 'react-native';

import { DAY_THEME, type DaySlot } from '@/constants/day-slots';

type Props = { slot: DaySlot; selected: boolean; onPress: () => void };

export function SlotChip({ slot, selected, onPress }: Props) {
  const { color, icon } = DAY_THEME[slot];
  return (
    <Pressable
      onPress={onPress}
      // Seçiliyse dilimin rengi, değilse aynı rengin %12 opaklıkta hali ("1F" = alfa)
      style={[styles.chip, { backgroundColor: selected ? color : color + '1F' }]}
      accessibilityRole="button"
      accessibilityState={{ selected }}>
      <SymbolView name={icon} size={14} tintColor={selected ? '#FFFFFF' : color} />
      <Text style={[styles.text, { color: selected ? '#FFFFFF' : color }]}>{slot}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  text: { fontSize: 14, fontWeight: '600' },
});
