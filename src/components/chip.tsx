// Yuvarlak filtre düğmesi. Seçiliyse kırmızı dolgulu olur.
// count verilirse yanında gösterilir: kullanıcı dokunmadan kaç sonuç göreceğini bilir.
// floating: harita gibi renkli bir zeminin üstünde duruyor. iOS 26'da cam (Liquid Glass) olur,
// cam yoksa beyaz + gölgeli olur; her iki durumda da haritanın üstünde kaybolmaz.
import { GlassView } from 'expo-glass-effect';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useGlass } from '@/hooks/use-glass';

const RED = '#C8102E';

type Props = { label: string; count?: number; active: boolean; onPress: () => void; floating?: boolean };

export function Chip({ label, count, active, onPress, floating }: Props) {
  const glass = useGlass();

  const text = (
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
      {/* İç içe Text: aynı satırda farklı stil (webdeki <span> gibi) */}
      {count !== undefined && <Text style={[styles.count, active && styles.countActive]}> {count}</Text>}
    </Text>
  );

  // Haritanın üstünde ve cam destekleniyorsa: dışta cam kabuk, içte dokunmayı yakalayan Pressable
  if (floating && glass) {
    return (
      <GlassView
        style={styles.glass}
        tintColor={active ? RED : undefined} // Seçili olan kırmızı tonlu cam: hangisinin seçili olduğu belli kalsın
        isInteractive // Dokununca cam hafifçe büyüyüp parlar (sekme çubuğundaki his)
        colorScheme="light" // Telefon karanlık modda olsa da cam açık kalsın; koyu yazımız okunsun
      >
        <Pressable
          onPress={onPress}
          style={styles.chipPadding}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}>
          {text}
        </Pressable>
      </GlassView>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, styles.chipPadding, floating && styles.chipFloating, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }} // VoiceOver "seçili" diye okur
    >
      {text}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderRadius: 999, backgroundColor: '#EFE9E1' },
  chipPadding: { paddingHorizontal: 14, paddingVertical: 8 },
  chipFloating: { backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
  chipActive: { backgroundColor: RED },
  glass: { borderRadius: 999 }, // Zemin rengi yok: rengi cam veriyor
  chipText: { fontSize: 14, fontWeight: '600', color: '#4A4A4A' },
  chipTextActive: { color: '#FFFFFF' },
  count: { fontWeight: '400', color: '#616161' },
  countActive: { color: 'rgba(255,255,255,0.85)' },
});
