// Kendi eklenen yerin konumunu haritadan seçme. Durak sayfasındaki "Konum seç"ten açılır. Adres: /pick-location?stop=…
// Tam ekran açılır: yarım sayfada haritayı aşağı kaydırmak sayfayı kapatmaya çalışıyordu, iki hareket çakışıyordu.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationPicker } from '@/components/location-picker';
import type { Coordinates } from '@/data/places';
import { placeOf } from '@/data/plan-place';
import { updateCustomPlace, useStop } from '@/hooks/use-trip';

const RED = '#C8102E';
const TOKYO_STATION: Coordinates = { latitude: 35.6812, longitude: 139.7671 };

export default function PickLocationScreen() {
  const { stop: stopId } = useLocalSearchParams<{ stop: string }>();
  const found = useStop(stopId);
  const insets = useSafeAreaInsets();
  // Haritanın o anki merkezi. Ref: her kaydırmada ekranı yeniden çizmeye gerek yok, sadece kaydederken okunuyor.
  const center = useRef<Coordinates | null>(null);

  if (!found?.stop.custom) {
    return (
      <View style={styles.centerText}>
        <Text>Yer bulunamadı.</Text>
      </View>
    );
  }
  const { day, stop } = found;

  // Başlangıç: daha önce seçilen konum → yoksa aynı günün konumu olan ilk yeri (genelde aynı semt) → yoksa Tokyo
  const initial =
    stop.custom!.coordinates ??
    day.stops.map((s) => placeOf(s)?.coordinates).find((c) => c !== undefined) ??
    TOKYO_STATION;

  function save() {
    updateCustomPlace(stop.id, { coordinates: center.current ?? initial });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <View style={styles.container}>
      <LocationPicker initial={initial} onChange={(c) => (center.current = c)} />

      {/* Üstte: kapat + ne yapılacağını anlatan kısa yazı */}
      <View style={[styles.top, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.close}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Vazgeç">
          <SymbolView name={{ ios: 'xmark', android: 'close' }} size={16} weight="bold" tintColor="#1A1A1A" />
        </Pressable>
        <View style={styles.hint}>
          <Text style={styles.hintText} numberOfLines={2}>
            Haritayı kaydırıp iğneyi <Text style={styles.bold}>{stop.custom!.name}</Text> üstüne getir
          </Text>
        </View>
      </View>

      {/* Altta: ana eylem, başparmağın kolay eriştiği yerde */}
      <Pressable style={[styles.button, { bottom: insets.bottom + 16 }]} onPress={save} accessibilityRole="button">
        <Text style={styles.buttonText}>Bu konumu kullan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerText: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  top: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  hint: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  hintText: { fontSize: 14, color: '#1A1A1A' },
  bold: { fontWeight: '700' },
  button: {
    position: 'absolute',
    left: 16,
    right: 16,
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
});
