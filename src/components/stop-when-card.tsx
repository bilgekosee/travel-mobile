// Durak sayfasındaki "Ne zaman" kartı: iOS Ayarlar'daki gibi tek kart, her ayar bir satır.
//   Gün      → dokununca menü (günler)
//   Dilim    → Sabah | Öğle | Akşam segment düğmesi
//   Saat     → yoksa "Ekle", varsa saat seçici + sil
//   Hatırlat → dokununca menü (Kapalı / 15 dk / 30 dk / 1 saat önce); sadece saat varsa
// Seçenekler ekranı kaplamaz: sadece seçili değer görünür, diğerleri dokununca açılan menüde.
// MenuView ve SegmentedControl telefonun kendi bileşenleri (iOS'ta SwiftUI, Android'de Material).
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { MenuView } from '@expo/ui/community/menu';
import { SegmentedControl } from '@expo/ui/community/segmented-control';
import * as Haptics from 'expo-haptics';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type ReactNode, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { CompactTimePicker } from '@/components/compact-time-picker';
import { DAY_SLOTS, type DaySlot, SLOT_DEFAULT_TIME } from '@/constants/day-slots';
import { ensureNotificationPermission, REMINDER_OPTIONS, reminderLabel } from '@/data/reminders';
import { formatDateKey, fromDateKey, setStopReminder, setStopTime, type TripDay, type TripStop } from '@/hooks/use-trip';

const RED = '#C8102E';

// "10:30" ↔ Date (seçici Date istiyor; gün önemsiz)
function toDate(time: string) {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
}
function toTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

type Props = {
  stop: TripStop;
  day: TripDay;
  days: TripDay[];
  onMove: (dayId: string, slot: DaySlot) => void; // Taşıma kuralları (çakışma uyarısı) durak sayfasında
};

export function StopWhenCard({ stop, day, days, onMove }: Props) {
  const [androidTimeOpen, setAndroidTimeOpen] = useState(false);
  const dayIndex = days.findIndex((d) => d.id === day.id);
  const shortDate = (key: string) => fromDateKey(key).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

  function changeTime(time: string | undefined) {
    setStopTime(stop.id, time);
    Haptics.selectionAsync();
  }

  async function changeReminder(minutes: number | undefined) {
    if (minutes !== undefined && !(await ensureNotificationPermission())) return; // İzin yoksa açma
    setStopReminder(stop.id, minutes);
    Haptics.selectionAsync();
  }

  return (
    <View style={styles.card}>
      {/* Gün: menüden seç → durak o güne taşınır */}
      <Row icon={{ ios: 'calendar', android: 'calendar_today' }} label="Gün">
        <MenuView
          actions={days.map((d, i) => ({
            id: d.id,
            title: `${i + 1}. gün · ${formatDateKey(d.date)}`,
            state: d.id === day.id ? 'on' : 'off', // Seçili gün işaretli
          }))}
          onPressAction={({ nativeEvent }) => onMove(nativeEvent.event, stop.slot)}>
          <Trailing text={`${dayIndex + 1}. gün · ${shortDate(day.date)}`} />
        </MenuView>
      </Row>

      {/* Dilim: üç seçenek her zaman görünür, tek dokunuşla değişir */}
      <View style={[styles.row, styles.segmentRow]}>
        <SegmentedControl
          values={[...DAY_SLOTS]}
          selectedIndex={DAY_SLOTS.indexOf(stop.slot)}
          onChange={({ nativeEvent }) => onMove(day.id, DAY_SLOTS[nativeEvent.selectedSegmentIndex])}
          style={styles.segment}
        />
      </View>

      {/* Saat: yoksa "Ekle" (dilimin tipik saatiyle başlar), varsa seçici + sil */}
      <Row icon={{ ios: 'clock', android: 'schedule' }} label="Saat" last={!stop.time}>
        {!stop.time ? (
          <Pressable
            onPress={() => {
              changeTime(SLOT_DEFAULT_TIME[stop.slot]);
              if (Platform.OS === 'android') setAndroidTimeOpen(true);
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Saat ekle">
            <Text style={styles.add}>Ekle</Text>
          </Pressable>
        ) : (
          <View style={styles.timeControls}>
            {Platform.OS === 'ios' ? (
              <CompactTimePicker value={toDate(stop.time)} onChange={(date) => changeTime(toTime(date))} color={RED} />
            ) : (
              <Pressable onPress={() => setAndroidTimeOpen(true)} hitSlop={8} accessibilityRole="button">
                <Text style={styles.value}>{stop.time}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => changeTime(undefined)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Saati kaldır">
              <SymbolView name={{ ios: 'xmark.circle.fill', android: 'cancel' }} size={20} tintColor="#C9C2B8" />
            </Pressable>
          </View>
        )}
      </Row>

      {/* Hatırlat: sadece saati olan durakta anlamlı */}
      {stop.time && (
        <Row icon={{ ios: 'bell', android: 'notifications' }} label="Hatırlat" last>
          <MenuView
            actions={[
              { id: 'off', title: 'Kapalı', state: !stop.remindBefore ? 'on' : 'off' },
              ...REMINDER_OPTIONS.map((minutes) => ({
                id: String(minutes),
                title: `${reminderLabel(minutes)} önce`,
                state: (stop.remindBefore === minutes ? 'on' : 'off') as 'on' | 'off',
              })),
            ]}
            onPressAction={({ nativeEvent }) =>
              changeReminder(nativeEvent.event === 'off' ? undefined : Number(nativeEvent.event))
            }>
            <Trailing text={stop.remindBefore ? `${reminderLabel(stop.remindBefore)} önce` : 'Kapalı'} />
          </MenuView>
        </Row>
      )}

      {/* Android: saat penceresi (ekrana konduğu an açılır) */}
      {androidTimeOpen && stop.time && (
        <DateTimePicker
          value={toDate(stop.time)}
          onValueChange={(_, date) => {
            setAndroidTimeOpen(false);
            changeTime(toTime(date));
          }}
          onDismiss={() => setAndroidTimeOpen(false)}
          mode="time"
          is24Hour
          accentColor={RED}
        />
      )}
    </View>
  );
}

// Bir ayar satırı: solda ikon + ad, sağda değer/kontrol. last: altına çizgi çekme.
function Row({
  icon,
  label,
  last,
  children,
}: {
  icon: SymbolViewProps['name'];
  label: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <SymbolView name={icon} size={18} tintColor={RED} />
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

// Menü açan satırların sağ tarafı: seçili değer + ⌃⌄ (iOS'un "buradan seçilir" işareti)
function Trailing({ text }: { text: string }) {
  return (
    <View style={styles.trailing}>
      <Text style={styles.value}>{text}</Text>
      <SymbolView name={{ ios: 'chevron.up.chevron.down', android: 'unfold_more' }} size={13} tintColor="#8A847C" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, backgroundColor: '#FFFFFF', paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50 },
  // Satır arası ince çizgi (iOS Ayarlar'daki gibi)
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDD6CC' },
  segmentRow: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDD6CC', paddingVertical: 8 },
  segment: { flex: 1, height: 34 },
  label: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  value: { fontSize: 16, color: '#4A4A4A' },
  add: { fontSize: 16, fontWeight: '600', color: RED },
  timeControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
