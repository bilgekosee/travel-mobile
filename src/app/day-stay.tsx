// "Kalınan yer" sayfası: o gece hangi otelde kalınıyor? Planım'da günün altındaki 🛏 satırından alttan açılır.
// Adres: /day-stay?day=…
// Çoğu zaman aynı otelde birkaç gece kalınır: diğer günlere yazılan oteller öneri olarak çıkar, tek dokunuşla seçilir.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { formatDateKey, setDayStay, type TripDay, useTrip } from '@/hooks/use-trip';

const RED = '#C8102E';

export default function DayStayScreen() {
  const { day: dayId } = useLocalSearchParams<{ day: string }>();
  const days = useTrip();
  const day = days.find((d) => d.id === dayId);

  if (!day) {
    return (
      <View style={styles.center}>
        <Text>Gün bulunamadı.</Text>
      </View>
    );
  }
  // Diğer günlerdeki oteller (her biri bir kez)
  // "s is string": TypeScript'e "bu süzgeçten geçenler kesin metin" diyoruz, undefined elendi
  const suggestions = [...new Set(days.map((d) => d.stay).filter((s): s is string => !!s && s !== day.stay))];
  return <StayForm day={day} suggestions={suggestions} />;
}

// Ayrı bileşen: useState'in başlangıç değeri günün oteli olsun (gün bulunduktan sonra)
function StayForm({ day, suggestions }: { day: TripDay; suggestions: string[] }) {
  // Henüz kaydedilmemiş metin. Aşağı kaydırıp kapatınca kaybolur = vazgeçmek.
  const [text, setText] = useState(day.stay ?? '');

  function save(value: string) {
    setDayStay(day.id, value);
    Haptics.selectionAsync();
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{formatDateKey(day.date)}</Text>
      <Text style={styles.hint}>Bu gece nerede kalıyorsun?</Text>

      <View style={styles.inputRow}>
        <SymbolView name={{ ios: 'bed.double.fill', android: 'hotel' }} size={18} tintColor="#6E6860" />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Otel, ryokan ya da adres"
          placeholderTextColor="#8A847C"
          style={styles.input}
          autoFocus // Sayfa açılınca klavye hemen gelsin: buraya yazmak için gelindi
          returnKeyType="done"
          onSubmitEditing={() => save(text)} // Klavyedeki "Bitti" de kaydeder
        />
      </View>

      {suggestions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Diğer günlerden</Text>
          {suggestions.map((s) => (
            <Pressable key={s} onPress={() => save(s)} style={styles.suggestion} accessibilityRole="button">
              <SymbolView name={{ ios: 'arrow.uturn.left', android: 'replay' }} size={15} tintColor={RED} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s}
              </Text>
            </Pressable>
          ))}
        </>
      )}

      <Pressable style={styles.button} onPress={() => save(text)} accessibilityRole="button">
        <Text style={styles.buttonText}>Kaydet</Text>
      </Pressable>
      {/* Kayıtlı bir otel varsa silmek için: metni elle silip kaydetmekten daha açık */}
      {day.stay && (
        <Pressable style={styles.remove} onPress={() => save('')} accessibilityRole="button">
          <Text style={styles.removeText}>Kalınan yeri kaldır</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, gap: 12, paddingBottom: 40 },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  hint: { fontSize: 15, color: '#555555' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
  },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  suggestionText: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  button: {
    minHeight: 48,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  remove: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  removeText: { fontSize: 16, fontWeight: '600', color: RED },
});
