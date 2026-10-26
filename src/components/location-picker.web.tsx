// Web sürümü: react-native-maps tarayıcıda çalışmadığı için harita yerine bilgi kutusu.
import { StyleSheet, Text, View } from 'react-native';

import type { Coordinates } from '@/data/places';

type Props = {
  initial: Coordinates;
  onChange: (center: Coordinates) => void;
};

export function LocationPicker(_: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Konum seçme yalnızca iOS ve Android uygulamasında çalışıyor.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { fontSize: 15, color: '#6B6B6B', textAlign: 'center' },
});
