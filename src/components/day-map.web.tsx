// Web sürümü: react-native-maps tarayıcıda çalışmadığı için harita yerine bilgi kutusu (places-map.web.tsx gibi).
import { StyleSheet, Text, View } from 'react-native';

import type { Coordinates } from '@/data/places';
import type { PlanPlace } from '@/data/plan-place';
import type { TripStop } from '@/hooks/use-trip';

export type DayMapStop = { stop: TripStop; place: PlanPlace & { coordinates: Coordinates }; number: number };

type Props = {
  stops: DayMapStop[];
  selectedId?: string;
  onSelect: (stopId: string) => void;
  edgePadding: { top: number; right: number; bottom: number; left: number };
};

export function DayMap({ stops }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Harita yalnızca iOS ve Android uygulamasında görünüyor ({stops.length} durak).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { fontSize: 15, color: '#6B6B6B', textAlign: 'center' },
});
