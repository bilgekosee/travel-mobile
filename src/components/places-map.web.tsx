// Web sürümü: react-native-maps tarayıcıda çalışmadığı için harita yerine bilgi kutusu.
// Metro, web için paketlerken "places-map.web.tsx"i "places-map.tsx"e tercih eder (dosya uzantısıyla platform seçimi).
import { StyleSheet, Text, View } from 'react-native';

import type { MapItem } from '@/data/map-items';

type Props = {
  items: MapItem[];
  focus?: MapItem | null;
  onSelect: (item: MapItem) => void;
  onDeselect: () => void;
};

export function PlacesMap({ items }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Harita yalnızca iOS ve Android uygulamasında görünüyor ({items.length} nokta).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { fontSize: 15, color: '#6B6B6B', textAlign: 'center' },
});
