// Durak sayfası: Planım'da bir yere dokununca alttan açılır. Adres: /stop?id=…
// Bir durakla ilgili her şey tek yerde: gittim işareti, not, başka güne/dilime taşıma, yeri açma, plandan çıkarma.
// Kaydet düğmesi yok: her değişiklik anında kaydedilir (iOS'taki Notlar gibi). Aşağı kaydırıp kapatmak yeter.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SlotChip } from '@/components/slot-chip';
import { DAY_SLOTS, type DaySlot } from '@/constants/day-slots';
import { serifText } from '@/constants/fonts';
import { MAP_KINDS } from '@/constants/map-kinds';
import { MAP_ITEMS } from '@/data/map-items';
import {
  fromDateKey,
  moveStop,
  removeStop,
  setStopNote,
  toggleStopDone,
  useStop,
  useTrip,
} from '@/hooks/use-trip';

const RED = '#C8102E';

export default function StopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const found = useStop(id);
  const days = useTrip();
  const item = found && MAP_ITEMS.find((i) => i.id === found.stop.itemId);

  if (!found || !item) {
    return (
      <View style={styles.center}>
        <Text>Durak bulunamadı.</Text>
      </View>
    );
  }
  const { day, stop } = found;

  function toggleDone() {
    toggleStopDone(stop.id);
    Haptics.selectionAsync();
  }

  function move(toDayId: string, slot: DaySlot) {
    if (toDayId === day.id && slot === stop.slot) return; // Zaten orada
    if (moveStop(stop.id, toDayId, slot)) {
      Haptics.selectionAsync();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Zaten planda', `${item!.name} o gün o saatte zaten var.`);
    }
  }

  // Önce sayfayı kapat, sonra aç: yer sayfası bu yarım sayfanın üstüne değil, Planım'ın üstüne açılsın
  function openItem() {
    router.back();
    if (item!.kind === 'place') router.push({ pathname: '/place/[id]', params: { id: item!.sourceId } });
    else router.push({ pathname: '/map', params: { focus: item!.id } });
  }

  function confirmRemove() {
    Alert.alert(item!.name, 'Plandan çıkarılsın mı? Notun da silinecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Plandan çıkar',
        style: 'destructive',
        onPress: () => {
          router.back(); // Önce kapat: durak silinince bu sayfanın gösterecek bir şeyi kalmaz
          removeStop(stop.id);
        },
      },
    ]);
  }

  const kind = MAP_KINDS[item.kind];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" // Klavye açıkken düğmeye tek dokunuş yetsin (önce klavyeyi kapatmasın)
      automaticallyAdjustKeyboardInsets // iOS: klavye açılınca içerik onun üstüne kayabilsin, not alanı altında kalmasın
    >
      {/* Hangi yer? ("Tamam" düğmesi kök _layout'tan geliyor) */}
      <View style={styles.itemRow}>
        <View style={[styles.kindIcon, { backgroundColor: kind.color }]}>
          <SymbolView name={kind.icon} size={18} tintColor="#FFFFFF" />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>
            {item.label} · {item.city}
          </Text>
        </View>
      </View>

      {/* Gittim: sayfanın ana eylemi, büyük ve ilk sırada */}
      <Pressable
        onPress={toggleDone}
        style={({ pressed }) => [styles.doneButton, stop.done && styles.doneButtonOn, pressed && styles.pressed]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!stop.done }}>
        <SymbolView
          name={
            stop.done
              ? { ios: 'checkmark.circle.fill', android: 'check_circle' }
              : { ios: 'circle', android: 'radio_button_unchecked' }
          }
          size={22}
          tintColor={stop.done ? '#FFFFFF' : RED}
        />
        <Text style={[styles.doneText, stop.done && styles.doneTextOn]}>{stop.done ? 'Gidildi' : 'Gittim'}</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Not</Text>
      <NoteInput stopId={stop.id} initial={stop.note ?? ''} />

      <Text style={styles.sectionTitle}>Ne zaman</Text>
      {/* Günler yan yana; çoksa yatay kaydırılır. Başka bir güne dokunmak durağı oraya taşır. */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayChips}>
        {days.map((d, i) => {
          const selected = d.id === day.id;
          return (
            <Pressable
              key={d.id}
              onPress={() => move(d.id, stop.slot)}
              style={[styles.dayChip, selected && styles.dayChipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <Text style={[styles.dayChipTitle, selected && styles.dayChipTextOn]}>{i + 1}. gün</Text>
              <Text style={[styles.dayChipDate, selected && styles.dayChipTextOn]}>
                {fromDateKey(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.slots}>
        {DAY_SLOTS.map((s) => (
          <SlotChip key={s} slot={s} selected={s === stop.slot} onPress={() => move(day.id, s)} />
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={openItem} style={styles.action} accessibilityRole="link">
          <SymbolView
            name={
              item.kind === 'place'
                ? { ios: 'info.circle', android: 'info' }
                : { ios: 'mappin.circle', android: 'location_on' }
            }
            size={20}
            tintColor={RED}
          />
          <Text style={styles.actionText}>{item.kind === 'place' ? 'Yer sayfasını aç' : 'Haritada gör'}</Text>
        </Pressable>
        <Pressable onPress={confirmRemove} style={styles.action} accessibilityRole="button">
          <SymbolView name={{ ios: 'trash', android: 'delete' }} size={20} tintColor={RED} />
          <Text style={styles.actionText}>Plandan çıkar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// Not alanı. Yazı kutunun kendi state'inde: her harf hemen görünür.
// Kayıt "debounce" ile: her harfte kaydetmek bütün planı veritabanına yazıp planı gösteren her ekranı yeniden
// çizdiriyordu, yazı takılıyordu. Şimdi yazmaya yarım saniye ara verince, kutudan çıkınca ya da sayfa kapanınca
// tek seferde kaydediyoruz.
function NoteInput({ stopId, initial }: { stopId: string; initial: string }) {
  const [text, setText] = useState(initial);
  // Ref: değişince ekranın yeniden çizilmesi gerekmeyen değerler (bekleyen zamanlayıcı, kaydedilecek son metin)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(initial);

  // Bekleyen bir kayıt varsa hemen yap
  function flush() {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    setStopNote(stopId, latest.current);
  }

  // Sayfa kapanınca (bileşen ekrandan kalkınca) son yazılanı kaybetme
  useEffect(() => flush, []); // eslint-disable-line react-hooks/exhaustive-deps -- sadece kapanırken çalışsın

  return (
    <TextInput
      value={text}
      onChangeText={(value) => {
        setText(value);
        latest.current = value;
        if (timer.current) clearTimeout(timer.current); // Her harfte sayacı baştan başlat…
        timer.current = setTimeout(flush, 500); // …500 ms yeni harf gelmezse kaydet
      }}
      onBlur={flush} // Kutudan çıkınca beklemeden kaydet
      placeholder="Ör. Bilet 10:00, rezervasyon no, kimle buluşulacak…"
      placeholderTextColor="#8A847C"
      style={styles.note}
      multiline
      textAlignVertical="top" // Android: çok satırlı alanda yazı ortadan değil üstten başlasın
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, gap: 12, paddingBottom: 40 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kindIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, gap: 2 },
  itemName: { fontSize: 22, ...serifText, color: '#1A1A1A' },
  itemMeta: { fontSize: 14, color: '#6B6B6B' },

  // Gidilmediyse açık kırmızı zeminli (davet), gidildiyse dolu kırmızı (tamam)
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#F4E3E5',
    marginTop: 4,
  },
  doneButtonOn: { backgroundColor: RED },
  pressed: { opacity: 0.7 },
  doneText: { fontSize: 17, fontWeight: '600', color: RED },
  doneTextOn: { color: '#FFFFFF' },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  note: {
    minHeight: 88,
    padding: 12,
    paddingTop: 12, // iOS çok satırlı alanda üst boşluğu ayrıca istiyor
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    fontSize: 16,
    lineHeight: 22,
    color: '#1A1A1A',
  },
  dayChips: { gap: 8 },
  dayChip: {
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EFE9E1',
    alignItems: 'center',
  },
  dayChipOn: { backgroundColor: RED },
  dayChipTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  dayChipDate: { fontSize: 12, color: '#6B6B6B', marginTop: 1 },
  dayChipTextOn: { color: '#FFFFFF' },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  actions: { marginTop: 12, gap: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  actionText: { fontSize: 16, fontWeight: '600', color: RED },
});
