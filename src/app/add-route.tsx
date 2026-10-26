// "Bu rotayı plana ekle": şehir sayfasındaki "1 günde" rotasını tek dokunuşla plana yazar. Adres: /add-route?city=kyoto
// Önce hangi güne (en üstte "Yeni gün": bir şehrin rotası genelde kendi gününe yazılır), sonra onay ekranı.
// Uygulamadaki yere bağlı adımlar o yer olarak, bağlı olmayanlar ("Gion'da yürüyüş") kendi yerin olarak eklenir.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DAY_THEME } from '@/constants/day-slots';
import { serifText } from '@/constants/fonts';
import { getCityGuide } from '@/data/city-guides';
import { getCity } from '@/data/places';
import { placeOf } from '@/data/plan-place';
import { addDay, addRoute, formatDateKey, getDays, type RouteStep, useTrip } from '@/hooks/use-trip';

const RED = '#C8102E';

export default function AddRouteScreen() {
  const { city: cityId } = useLocalSearchParams<{ city: string }>();
  const city = getCity(cityId);
  const guide = getCityGuide(cityId);
  const days = useTrip();
  // Eklendikten sonra: hangi güne, kaç yer (onay ekranı için)
  const [result, setResult] = useState<{ dayNumber: number; added: number } | null>(null);

  if (!city || !guide) {
    return (
      <View style={styles.center}>
        <Text>Rota bulunamadı.</Text>
      </View>
    );
  }

  const steps: RouteStep[] = guide.dayPlan.map((step) => ({
    slot: step.time,
    itemId: step.placeId ? `place-${step.placeId}` : undefined,
    name: step.title,
  }));

  function add(dayId: string) {
    const added = addRoute(dayId, steps);
    // Günler tarihe göre sıralı ve yeni gün araya girebilir: numarayı eklemeden sonraki güncel listeden bul
    const dayNumber = getDays().findIndex((d) => d.id === dayId) + 1;
    setResult({ dayNumber, added });
    Haptics.notificationAsync(
      added > 0 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
    );
  }

  if (result) {
    return (
      <View style={styles.done}>
        <SymbolView
          name={result.added > 0 ? { ios: 'checkmark.circle.fill', android: 'check_circle' } : { ios: 'info.circle.fill', android: 'info' }}
          size={56}
          tintColor={RED}
        />
        <Text style={styles.doneTitle}>
          {result.added > 0 ? `${result.added} yer ${result.dayNumber}. güne eklendi` : 'Bu rota o günde zaten var'}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            router.back();
            router.navigate('/plan'); // Planım sekmesine geç
          }}
          accessibilityRole="button">
          <Text style={styles.buttonText}>Planım’a git</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.secondaryText}>Tamam</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <Text style={styles.title}>1 günde {city.name}</Text>

      {/* Rotanın özeti: ne eklenecek */}
      <View style={styles.preview}>
        {guide.dayPlan.map((step, i) => (
          <View key={i} style={styles.previewRow}>
            <SymbolView name={DAY_THEME[step.time].icon} size={15} tintColor={DAY_THEME[step.time].color} />
            <Text style={styles.previewText} numberOfLines={1}>
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>Hangi güne eklensin?</Text>

      {/* En sık seçilecek: yeni gün (son günün ertesi; plan boşsa bugün) */}
      <Pressable onPress={() => add(addDay())} style={[styles.option, styles.optionPrimary]} accessibilityRole="button">
        <SymbolView name={{ ios: 'plus.circle.fill', android: 'add_circle' }} size={22} tintColor="#FFFFFF" />
        <Text style={styles.optionPrimaryText}>Yeni gün olarak ekle</Text>
      </Pressable>

      {days.map((day, i) => {
        // Günde zaten hangi şehirler var: doğru günü seçmeye yardım eder
        const cities = [...new Set(day.stops.map((s) => placeOf(s)?.city).filter(Boolean))].join(' · ');
        const meta = day.stops.length > 0 ? `${cities ? `${cities} · ` : ''}${day.stops.length} yer` : 'Boş gün';
        return (
          <Pressable key={day.id} onPress={() => add(day.id)} style={styles.option} accessibilityRole="button">
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{i + 1}</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{formatDateKey(day.date)}</Text>
              <Text style={styles.optionMeta}>{meta}</Text>
            </View>
            <SymbolView name={{ ios: 'plus', android: 'add' }} size={16} tintColor="#8A847C" />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, gap: 10, paddingBottom: 40 },
  title: { fontSize: 24, ...serifText, color: '#1A1A1A' },
  preview: { gap: 8, padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewText: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  hint: { fontSize: 15, color: '#555555', marginTop: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  optionPrimary: { backgroundColor: RED },
  optionPrimaryText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  dayBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: RED },
  dayBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  optionText: { flex: 1, gap: 2 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  optionMeta: { fontSize: 13, color: '#6B6B6B' },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 },
  doneTitle: { fontSize: 20, ...serifText, color: '#1A1A1A', textAlign: 'center' },
  button: {
    alignSelf: 'stretch',
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
    marginTop: 8,
  },
  buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  secondary: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 16, fontWeight: '600', color: RED },
});
