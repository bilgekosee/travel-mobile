// Bir günün haritası: duraklar gidiliş sırasıyla numaralı pinler, aralarında kesik çizgili yol.
// Pinler dilimin rengini taşır (sabah turuncu, öğle altın, akşam indigo); gidilen yer soluk ve ✓'li.
// Aynı klasördeki day-map.web.tsx tarayıcıda bunun yerine kullanılır: react-native-maps web'de çalışmıyor.
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { DAY_THEME } from '@/constants/day-slots';
import type { Coordinates } from '@/data/places';
import type { PlanPlace } from '@/data/plan-place';
import type { TripStop } from '@/hooks/use-trip';

// "&": konumu kesin olan bir PlanPlace (kendi eklenen yerde konum seçilmemişse haritaya konamaz, önceden eleniyor)
export type DayMapStop = { stop: TripStop; place: PlanPlace & { coordinates: Coordinates }; number: number };

type Props = {
  stops: DayMapStop[];
  selectedId?: string; // Seçili durağın id'si: harita oraya gider
  onSelect: (stopId: string) => void;
  edgePadding: { top: number; right: number; bottom: number; left: number }; // Alttaki kartlar pinleri örtmesin
};

export function DayMap({ stops, selectedId, onSelect, edgePadding }: Props) {
  const mapRef = useRef<MapView>(null);
  const coordinates = stops.map((s) => s.place.coordinates);

  // Bütün durakları ekrana sığdır
  function fitAll(animated: boolean) {
    mapRef.current?.fitToCoordinates(coordinates, { edgePadding, animated });
  }

  // Seçim değişince o durağa yaklaş
  useEffect(() => {
    const selected = stops.find((s) => s.stop.id === selectedId);
    if (!selected) return;
    mapRef.current?.animateCamera({ center: selected.place.coordinates }, { duration: 400 });
    // stops her çizimde yeni bir dizi; sadece seçim değişince çalışsın
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      onMapReady={() => fitAll(false)}
      showsPointsOfInterests={false}
      toolbarEnabled={false}>
      {/* Gidiliş sırasıyla noktaları birleştiren çizgi (SVG'deki <polyline> gibi). lineDashPattern: kesik çizgi */}
      {coordinates.length > 1 && (
        <Polyline
          coordinates={coordinates}
          strokeColor="#C8102E"
          strokeWidth={3}
          lineDashPattern={[8, 6]}
        />
      )}

      {stops.map(({ stop, place, number }) => {
        const color = DAY_THEME[stop.slot].color;
        const selected = stop.id === selectedId;
        return (
          <Marker
            // tracksViewChanges kapalı: harita pinin görüntüsünü bir kez çizip saklıyor. Seçilince pin büyüdüğü için
            // key'e seçimi de koyuyoruz: key değişince React pini baştan oluşturur, harita da yeniden çizer.
            key={`${stop.id}-${selected}`}
            coordinate={place.coordinates}
            onPress={() => onSelect(stop.id)}
            stopPropagation
            tracksViewChanges={false}
            zIndex={selected ? 2 : 1} // Seçili pin üst üste binen pinlerin üstünde kalsın
            accessibilityLabel={`${number}. durak: ${place.name}${stop.done ? ', gidildi' : ''}`}>
            <View
              style={[
                styles.pin,
                { backgroundColor: stop.done ? '#9A948C' : color },
                selected && styles.pinSelected,
              ]}>
              {stop.done ? (
                <SymbolView name={{ ios: 'checkmark', android: 'check' }} size={14} tintColor="#FFFFFF" />
              ) : (
                <Text style={styles.pinText}>{number}</Text>
              )}
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  // scale ile büyütmek pinin kenarını kırpabiliyor (harita pini kendi ölçüsünde çiziyor): boyutu büyütüyoruz
  pinSelected: { width: 40, height: 40, borderRadius: 20, borderWidth: 3 },
  pinText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
