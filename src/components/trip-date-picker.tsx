// Günün tarihi: büyük "14 Ekim", altında "Çarşamba". Dokununca tarih değiştirilir.
// iOS: alttan "Tarih seç" sayfası açılır (takvim kartın içine sığmıyordu, en küçük genişliği ~320 nokta).
// Android: seçici ekrana konduğu an pencere olarak açılır; seçilince/kapatılınca kaldırıyoruz.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { serifText } from '@/constants/fonts';
import { formatDateKey, fromDateKey, setDayDate, toDateKey } from '@/hooks/use-trip';

// Seçilen tarih başka bir güne aitse (iOS takvim sayfası da kullanır)
export function alertDateTaken(date: string) {
  Alert.alert('Bu tarihte zaten bir gün var', `${formatDateKey(date)} planında başka bir gün olarak duruyor.`);
}

const RED = '#C8102E';

type Props = { dayId: string; date: string; subtitle?: string };

export function TripDatePicker({ dayId, date, subtitle }: Props) {
  const [androidOpen, setAndroidOpen] = useState(false);
  const value = fromDateKey(date);
  const dayMonth = value.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }); // "14 Ekim"
  const weekday = value.toLocaleDateString('tr-TR', { weekday: 'long' }); // "Çarşamba"

  function open() {
    if (Platform.OS === 'ios') router.push({ pathname: '/pick-date', params: { day: dayId } });
    else setAndroidOpen(true);
  }

  return (
    <View>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${dayMonth} ${weekday}`}
        accessibilityHint="Tarihi değiştir">
        <View style={styles.titleRow}>
          <Text style={styles.date}>{dayMonth}</Text>
          {/* Küçük ok: buraya dokunulabileceğini ima eder */}
          <SymbolView name={{ ios: 'chevron.down', android: 'expand_more' }} size={12} tintColor="#8A847C" />
        </View>
        <Text style={styles.subtitle}>{subtitle ? `${weekday} · ${subtitle}` : weekday}</Text>
      </Pressable>

      {androidOpen && (
        <DateTimePicker
          value={value}
          onValueChange={(_, picked) => {
            setAndroidOpen(false);
            const key = toDateKey(picked);
            if (!setDayDate(dayId, key)) alertDateTaken(key);
          }}
          onDismiss={() => setAndroidOpen(false)}
          mode="date"
          accentColor={RED}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  date: { fontSize: 22, ...serifText, color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#6B6B6B', marginTop: 1 },
});
