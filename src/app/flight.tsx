// Uçuş sayfası: Planım'daki Kalkış / Dönüş satırına dokununca alttan açılır. Adres: /flight?leg=outbound|return
// Uçuş no, saat, nereden → nereye, not ve biniş kartı. Tarih sorulmaz: gidiş planın ilk günü, dönüş son günü.
// Her alan yazdıkça kaydedilir; kapatmak yeter.
import { Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AttachmentList } from '@/components/attachment-list';
import { AutoSaveInput } from '@/components/auto-save-input';
import { formatDateKey, useTrip } from '@/hooks/use-trip';
import {
  addFlightFiles,
  type FlightLeg,
  removeFlightFile,
  updateFlight,
  useTripInfo,
} from '@/hooks/use-trip-info';

const RED = '#C8102E';

export default function FlightScreen() {
  const { leg: legParam } = useLocalSearchParams<{ leg: string }>();
  const leg: FlightLeg = legParam === 'return' ? 'return' : 'outbound';
  const flight = useTripInfo().flights[leg];
  const days = useTrip();
  const date = leg === 'outbound' ? days[0]?.date : days[days.length - 1]?.date;
  const isOutbound = leg === 'outbound';

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Stack.Screen options={{ title: isOutbound ? 'Gidiş uçuşu' : 'Dönüş uçuşu' }} />

      <View style={styles.dateRow}>
        <SymbolView
          name={isOutbound ? { ios: 'airplane.departure', android: 'flight_takeoff' } : { ios: 'airplane.arrival', android: 'flight_land' }}
          size={20}
          tintColor={RED}
        />
        <Text style={styles.date}>{date ? formatDateKey(date) : 'Önce plana gün ekle'}</Text>
      </View>

      <Text style={styles.label}>Uçuş</Text>
      <View style={styles.pair}>
        <AutoSaveInput
          initial={flight.number ?? ''}
          onSave={(number) => updateFlight(leg, { number })}
          placeholder="Uçuş no (TK 52)"
          placeholderTextColor="#8A847C"
          autoCapitalize="characters" // Uçuş kodları büyük harf
          style={[styles.field, styles.flex]}
          returnKeyType="next"
        />
        <AutoSaveInput
          initial={flight.time ?? ''}
          onSave={(time) => updateFlight(leg, { time })}
          placeholder="Saat"
          placeholderTextColor="#8A847C"
          keyboardType="numbers-and-punctuation" // Rakam + ":" aynı klavyede
          style={[styles.field, styles.time]}
          returnKeyType="next"
        />
      </View>

      <Text style={styles.label}>Güzergâh</Text>
      <View style={styles.pair}>
        <AutoSaveInput
          initial={flight.from ?? ''}
          onSave={(from) => updateFlight(leg, { from })}
          placeholder={isOutbound ? 'İstanbul' : 'Tokyo (HND)'}
          placeholderTextColor="#8A847C"
          style={[styles.field, styles.flex]}
          returnKeyType="next"
        />
        <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward' }} size={16} tintColor="#8A847C" />
        <AutoSaveInput
          initial={flight.to ?? ''}
          onSave={(to) => updateFlight(leg, { to })}
          placeholder={isOutbound ? 'Tokyo (HND)' : 'İstanbul'}
          placeholderTextColor="#8A847C"
          style={[styles.field, styles.flex]}
          returnKeyType="next"
        />
      </View>

      <Text style={styles.label}>Not</Text>
      <AutoSaveInput
        initial={flight.note ?? ''}
        onSave={(note) => updateFlight(leg, { note })}
        placeholder="Rezervasyon kodu (PNR), bagaj hakkı, aktarma…"
        placeholderTextColor="#8A847C"
        style={[styles.field, styles.note]}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Biniş kartı ve bilet</Text>
      <AttachmentList
        files={flight.files}
        onAdd={(files) => addFlightFiles(leg, files)}
        onRemove={(file) => removeFlightFile(leg, file)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10, paddingBottom: 40 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  date: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  pair: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
  field: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    fontSize: 16,
    color: '#1A1A1A',
  },
  time: { width: 96, textAlign: 'center' },
  note: { minHeight: 80, paddingTop: 12, lineHeight: 22 },
});
