// Bir günün tarihini seçme sayfası. Planım'da tarihe dokununca alttan açılır. Adres: /pick-date?day=…
// Takvim kartın içine sığmıyordu (iOS takviminin en küçük genişliği ~320 nokta): burada ekran genişliğinde duruyor.
// Seçim "Tamam"a basınca kaydedilir. Kendiliğinden kapanmıyoruz: iOS takvimi ay değiştirince seçili günü de
// yeni aya taşıyor (14 Ekim → 14 Kasım) ve bu da "tarih değişti" sayılıyor; kullanıcı sadece gezinirken sayfa kapanırdı.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { alertDateTaken } from '@/components/trip-date-picker';
import { formatDateKey, fromDateKey, setDayDate, toDateKey, type TripDay, useTrip } from '@/hooks/use-trip';

const RED = '#C8102E';

export default function PickDateScreen() {
  const { day: dayId } = useLocalSearchParams<{ day: string }>();
  const day = useTrip().find((d) => d.id === dayId);

  if (!day) {
    return (
      <View style={styles.container}>
        <Text>Gün bulunamadı.</Text>
      </View>
    );
  }
  return <Picker day={day} />;
}

// Ayrı bileşen: useState'in başlangıç değeri günün tarihi olsun (gün bulunduktan sonra)
function Picker({ day }: { day: TripDay }) {
  // Henüz kaydedilmemiş seçim. Aşağı kaydırıp kapatınca kaybolur = vazgeçmek.
  const [selected, setSelected] = useState(day.date);

  function save() {
    // Başka bir güne ait tarih: uyar, sayfa açık kalsın (hemen başka tarih seçilebilsin)
    if (selected !== day.date && !setDayDate(day.id, selected)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      alertDateTaken(selected);
      return;
    }
    Haptics.selectionAsync();
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.current}>{formatDateKey(selected)}</Text>
      <DateTimePicker
        value={fromDateKey(selected)}
        onValueChange={(_, picked) => setSelected(toDateKey(picked))}
        mode="date"
        display="inline" // Ay görünümünde tam takvim
        locale="tr_TR" // Ay ve gün adları Türkçe
        accentColor={RED}
      />
      {/* Başlık çubuğunda değil, içerikte: alttan açılan sayfalarda iOS başlığı her zaman göstermeyebiliyor */}
      <Pressable style={styles.button} onPress={save} accessibilityRole="button">
        <Text style={styles.buttonText}>Tamam</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 32, gap: 8 },
  current: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  button: {
    minHeight: 48,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
});
