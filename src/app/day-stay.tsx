// "Kalınan yer" sayfası: o gece hangi otelde kalınıyor? Planım'da günün altındaki 🛏 satırından alttan açılır.
// Adres: /day-stay?day=…
// Çoğu zaman aynı otelde birkaç gece kalınır: diğer günlere yazılan oteller öneri olarak çıkar, tek dokunuşla seçilir.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AttachmentList } from '@/components/attachment-list';
import { ShowDriverButton } from '@/components/show-driver-button';
import { addStayFiles, formatDateKey, removeStayFile, setDayStay, type TripDay, useTrip } from '@/hooks/use-trip';

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
  // Diğer günlerdeki oteller, adresleriyle birlikte (her ad bir kez). Map: aynı ad ikinci kez gelirse üstüne yazar.
  const suggestions = [
    ...new Map(
      days.filter((d) => d.stay && d.stay !== day.stay).map((d) => [d.stay!, { name: d.stay!, address: d.stayAddress }]),
    ).values(),
  ];
  return <StayForm day={day} suggestions={suggestions} />;
}

type Suggestion = { name: string; address?: string };

// Ayrı bileşen: useState'in başlangıç değeri günün oteli olsun (gün bulunduktan sonra)
function StayForm({ day, suggestions }: { day: TripDay; suggestions: Suggestion[] }) {
  // Henüz kaydedilmemiş metin. Aşağı kaydırıp kapatınca kaybolur = vazgeçmek.
  const [text, setText] = useState(day.stay ?? '');
  const [address, setAddress] = useState(day.stayAddress ?? '');

  function save(name: string, addr: string) {
    setDayStay(day.id, name, addr);
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
          onSubmitEditing={() => save(text, address)} // Klavyedeki "Bitti" de kaydeder
        />
      </View>
      <View style={styles.inputRow}>
        <SymbolView name={{ ios: 'mappin.and.ellipse', android: 'place' }} size={18} tintColor="#6E6860" />
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Adres (rezervasyondaki Japonca adres)"
          placeholderTextColor="#8A847C"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={() => save(text, address)}
        />
      </View>
      {/* Otele dönerken: Japonca adres yoksa en azından otelin adı */}
      <ShowDriverButton text={address || text} name={text} />

      {/* Rezervasyon belgesi: Kaydet'i beklemez, eklenince hemen kaydedilir */}
      <Text style={styles.sectionTitle}>Rezervasyon</Text>
      <AttachmentList
        files={day.stayFiles}
        onAdd={(files) => addStayFiles(day.id, files)}
        onRemove={(file) => removeStayFile(day.id, file)}
      />

      {suggestions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Diğer günlerden</Text>
          {suggestions.map((s) => (
            <Pressable
              key={s.name}
              onPress={() => save(s.name, s.address ?? '')}
              style={styles.suggestion}
              accessibilityRole="button">
              <SymbolView name={{ ios: 'arrow.uturn.left', android: 'replay' }} size={15} tintColor={RED} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s.name}
              </Text>
            </Pressable>
          ))}
        </>
      )}

      <Pressable style={styles.button} onPress={() => save(text, address)} accessibilityRole="button">
        <Text style={styles.buttonText}>Kaydet</Text>
      </Pressable>
      {/* Kayıtlı bir otel varsa silmek için: metni elle silip kaydetmekten daha açık */}
      {day.stay && (
        <Pressable style={styles.remove} onPress={() => save('', '')} accessibilityRole="button">
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
