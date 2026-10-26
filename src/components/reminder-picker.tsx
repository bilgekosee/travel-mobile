// "Hatırlat": Kapalı · 15 dk · 30 dk · 1 saat önce. Durak sayfasında, saati olan duraklarda görünür.
// İzin ilk hatırlatma açılırken istenir (uygulama açılır açılmaz değil): kullanıcı neden sorulduğunu o an anlıyor.
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ensureNotificationPermission, REMINDER_OPTIONS, reminderLabel } from '@/data/reminders';
import { setStopReminder } from '@/hooks/use-trip';

const RED = '#C8102E';

type Props = { stopId: string; value?: number };

export function ReminderPicker({ stopId, value }: Props) {
  async function choose(minutes: number | undefined) {
    if (minutes !== undefined && !(await ensureNotificationPermission())) return; // İzin yoksa açma
    setStopReminder(stopId, minutes);
    Haptics.selectionAsync();
  }

  const options: { minutes?: number; label: string }[] = [
    { label: 'Kapalı' },
    ...REMINDER_OPTIONS.map((minutes) => ({ minutes, label: `${reminderLabel(minutes)} önce` })),
  ];

  return (
    <View style={styles.row}>
      <SymbolView
        name={value ? { ios: 'bell.fill', android: 'notifications_active' } : { ios: 'bell', android: 'notifications' }}
        size={20}
        tintColor={RED}
      />
      <View style={styles.chips}>
        {options.map(({ minutes, label }) => {
          const selected = value === minutes;
          return (
            <Pressable
              key={label}
              onPress={() => choose(minutes)}
              style={[styles.chip, selected && styles.chipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={minutes ? `${label} hatırlat` : 'Hatırlatma kapalı'}>
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { minHeight: 34, paddingHorizontal: 10, borderRadius: 999, justifyContent: 'center', backgroundColor: '#EFE9E1' },
  chipOn: { backgroundColor: RED },
  chipText: { fontSize: 13, fontWeight: '600', color: '#4A4A4A' },
  chipTextOn: { color: '#FFFFFF' },
});
