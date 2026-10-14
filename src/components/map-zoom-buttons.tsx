// Haritanın sağındaki + / − düğmeleri. Filtre düğmeleriyle aynı dil: iOS 26'da cam, değilse beyaz + gölge.
import { GlassView } from 'expo-glass-effect';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useGlass } from '@/hooks/use-glass';

const SIZE = 44; // Apple'ın önerdiği en küçük dokunma alanı

type Props = { onZoomIn: () => void; onZoomOut: () => void; style?: ViewStyle };

export function MapZoomButtons({ onZoomIn, onZoomOut, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <ZoomButton icon={{ ios: 'plus', android: 'add' }} label="Yakınlaştır" onPress={onZoomIn} />
      <ZoomButton icon={{ ios: 'minus', android: 'remove' }} label="Uzaklaştır" onPress={onZoomOut} />
    </View>
  );
}

function ZoomButton({ icon, label, onPress }: { icon: SymbolViewProps['name']; label: string; onPress: () => void }) {
  const glass = useGlass();
  const content = (
    <Pressable
      onPress={onPress}
      style={styles.pressable}
      accessibilityRole="button"
      accessibilityLabel={label} // Sadece ikon var; VoiceOver ne yaptığını bu yazıdan okur
    >
      <SymbolView name={icon} size={18} weight="semibold" tintColor="#1A1A1A" />
    </Pressable>
  );

  if (glass) {
    return (
      <GlassView style={styles.button} isInteractive colorScheme="light">
        {content}
      </GlassView>
    );
  }
  return <View style={[styles.button, styles.solid]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  button: { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
  solid: { backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
  pressable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
