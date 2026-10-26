// Durağın saati (durak sayfasında). Saat yoksa "Saat ekle", varsa saat + silme düğmesi.
// iOS: kompakt seçici, dokununca çark açılır. Android: dokununca saat penceresi açılır (tarih seçicideki gibi).
// Saat veride "10:30" metni; seçici Date istiyor: iki yönlü çeviriyoruz.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { type DaySlot, SLOT_DEFAULT_TIME } from '@/constants/day-slots';
import { setStopTime } from '@/hooks/use-trip';

const RED = '#C8102E';

// "10:30" → bugünün 10:30'u (seçici sadece saati gösteriyor, gün önemsiz)
function toDate(time: string) {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
}

// Date → "10:30"
function toTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

type Props = { stopId: string; time?: string; slot: DaySlot };

export function StopTimePicker({ stopId, time, slot }: Props) {
  const [androidOpen, setAndroidOpen] = useState(false);

  function change(next: string | undefined) {
    setStopTime(stopId, next);
    Haptics.selectionAsync();
  }

  // Saat yok: dilimin tipik saatiyle başla (Sabah 09:00…). Android'de pencere de hemen açılsın.
  if (!time) {
    return (
      <Pressable
        onPress={() => {
          change(SLOT_DEFAULT_TIME[slot]);
          if (Platform.OS === 'android') setAndroidOpen(true);
        }}
        style={styles.add}
        accessibilityRole="button">
        <SymbolView name={{ ios: 'clock', android: 'schedule' }} size={20} tintColor={RED} />
        <Text style={styles.addText}>Saat ekle</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <SymbolView name={{ ios: 'clock.fill', android: 'schedule' }} size={20} tintColor={RED} />
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={toDate(time)}
          onValueChange={(_, date) => change(toTime(date))}
          mode="time"
          display="compact" // Küçük "10:30" düğmesi; dokununca çark açılır
          locale="tr_TR" // 24 saat biçimi
          accentColor={RED}
        />
      ) : (
        <Pressable onPress={() => setAndroidOpen(true)} accessibilityRole="button" accessibilityHint="Saati değiştir">
          <Text style={styles.time}>{time}</Text>
        </Pressable>
      )}
      <View style={styles.spacer} />
      <Pressable onPress={() => change(undefined)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Saati kaldır">
        <SymbolView name={{ ios: 'xmark.circle.fill', android: 'cancel' }} size={22} tintColor="#B5AEA4" />
      </Pressable>

      {androidOpen && (
        <DateTimePicker
          value={toDate(time)}
          onValueChange={(_, date) => {
            setAndroidOpen(false);
            change(toTime(date));
          }}
          onDismiss={() => setAndroidOpen(false)}
          mode="time"
          is24Hour
          accentColor={RED}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  add: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  addText: { fontSize: 16, fontWeight: '600', color: RED },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  time: { fontSize: 17, fontWeight: '600', color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  spacer: { flex: 1 },
});
