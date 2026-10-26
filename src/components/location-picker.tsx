// Haritadan konum seçme: ortadaki iğne sabit, kullanıcı haritayı kaydırır (Uber/Getir'deki gibi).
// Harita durunca merkezi bildirilir. Aynı klasördeki location-picker.web.tsx tarayıcıda bunun yerine kullanılır.
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import type { Coordinates } from '@/data/places';

type Props = {
  initial: Coordinates;
  onChange: (center: Coordinates) => void;
};

export function LocationPicker({ initial, onChange }: Props) {
  return (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        // ~1 km'lik alan: sokakları seçebilecek kadar yakın
        initialRegion={{ ...initial, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        onRegionChangeComplete={({ latitude, longitude }) => onChange({ latitude, longitude })}
        toolbarEnabled={false}
      />
      {/* İğne haritanın parçası değil, üstünde duran bir görüntü. pointerEvents="none": dokunmalar içinden
          haritaya geçsin (CSS'teki pointer-events: none). İğnenin ucu tam ortada olsun diye yukarı kaydırıyoruz. */}
      <View pointerEvents="none" style={styles.center}>
        <View style={styles.pin}>
          <SymbolView name={{ ios: 'mappin', android: 'location_on' }} size={44} tintColor="#C8102E" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  pin: { marginBottom: 44 }, // İkonun alt ucu = harita merkezi
});
