// Durak sayfası: Planım'da bir yere dokununca alttan açılır. Adres: /stop?id=…
// Bir durakla ilgili her şey tek yerde: gittim işareti, not, başka güne/dilime taşıma, yeri açma, plandan çıkarma.
// Kendi eklenen yerde ayrıca adı, adresi ve haritadan konumu düzenlenir.
// Kaydet düğmesi yok: her değişiklik kendiliğinden kaydedilir (iOS'taki Notlar gibi). Aşağı kaydırıp kapatmak yeter.
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AttachmentList } from '@/components/attachment-list';
import { AutoSaveInput } from '@/components/auto-save-input';
import { ShowDriverButton } from '@/components/show-driver-button';
import { SlotChip } from '@/components/slot-chip';
import { StopTimePicker } from '@/components/stop-time-picker';
import { DAY_SLOTS, type DaySlot } from '@/constants/day-slots';
import { directionsUrl } from '@/constants/directions';
import { serifText } from '@/constants/fonts';
import { placeOf } from '@/data/plan-place';
import {
  addStopFiles,
  fromDateKey,
  moveStop,
  removeStop,
  removeStopFile,
  setStopNote,
  toggleStopDone,
  updateCustomPlace,
  useStop,
  useTrip,
} from '@/hooks/use-trip';

const RED = '#C8102E';

export default function StopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const found = useStop(id);
  const days = useTrip();
  const place = found && placeOf(found.stop);

  if (!found || !place) {
    return (
      <View style={styles.center}>
        <Text>Durak bulunamadı.</Text>
      </View>
    );
  }
  const { day, stop } = found;
  const item = place.item; // Uygulamadaki yerse dolu, kendi yerinse boş

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
      Alert.alert('Zaten planda', `${place!.name} o gün o saatte zaten var.`);
    }
  }

  // Önce sayfayı kapat, sonra aç: yer sayfası bu yarım sayfanın üstüne değil, Planım'ın üstüne açılsın
  function openItem() {
    if (!item) return;
    router.back();
    if (item.kind === 'place') router.push({ pathname: '/place/[id]', params: { id: item.sourceId } });
    else router.push({ pathname: '/map', params: { focus: item.id } });
  }

  function confirmRemove() {
    Alert.alert(place!.name, 'Plandan çıkarılsın mı? Notu ve belgeleri de silinecek.', [
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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" // Klavye açıkken düğmeye tek dokunuş yetsin (önce klavyeyi kapatmasın)
      automaticallyAdjustKeyboardInsets // iOS: klavye açılınca içerik onun üstüne kayabilsin, not alanı altında kalmasın
    >
      {/* Hangi yer? ("Tamam" düğmesi kök _layout'tan geliyor) */}
      <View style={styles.itemRow}>
        <View style={[styles.kindIcon, { backgroundColor: place.color }]}>
          <SymbolView name={place.icon} size={18} tintColor="#FFFFFF" />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{place.name}</Text>
          <Text style={styles.itemMeta}>{place.meta}</Text>
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

      {/* Sadece kendi eklenen yerde: adı, adresi, konumu */}
      {stop.custom && (
        <>
          <Text style={styles.sectionTitle}>Yer</Text>
          <AutoSaveInput
            initial={stop.custom.name}
            // Boş ad kaydetme: plandaki satır isimsiz kalırdı
            onSave={(name) => name.trim() && updateCustomPlace(stop.id, { name: name.trim() })}
            placeholder="Yerin adı"
            placeholderTextColor="#8A847C"
            style={styles.field}
          />
          <AutoSaveInput
            initial={stop.custom.address ?? ''}
            onSave={(address) => updateCustomPlace(stop.id, { address: address.trim() || undefined })}
            placeholder="Adres (Japonca da yazabilirsin)"
            placeholderTextColor="#8A847C"
            style={styles.field}
          />
          <Pressable
            onPress={() => router.push({ pathname: '/pick-location', params: { stop: stop.id } })}
            style={styles.action}
            accessibilityRole="button">
            <SymbolView
              name={
                stop.custom.coordinates
                  ? { ios: 'mappin.and.ellipse', android: 'where_to_vote' }
                  : { ios: 'mappin.circle', android: 'add_location' }
              }
              size={20}
              tintColor={RED}
            />
            <Text style={styles.actionText}>
              {stop.custom.coordinates ? 'Konum seçildi ✓ · Değiştir' : 'Haritadan konum seç'}
            </Text>
          </Pressable>
        </>
      )}

      <Text style={styles.sectionTitle}>Not</Text>
      <AutoSaveInput
        initial={stop.note ?? ''}
        onSave={(note) => setStopNote(stop.id, note)}
        placeholder="Ör. Rezervasyon no, giriş ücreti, kimle buluşulacak…"
        placeholderTextColor="#8A847C"
        style={styles.note}
        multiline
        textAlignVertical="top" // Android: çok satırlı alanda yazı ortadan değil üstten başlasın
      />

      <Text style={styles.sectionTitle}>Biletler ve belgeler</Text>
      <AttachmentList
        files={stop.files}
        onAdd={(files) => addStopFiles(stop.id, files)}
        onRemove={(file) => removeStopFile(stop.id, file)}
      />

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
      <StopTimePicker stopId={stop.id} time={stop.time} slot={stop.slot} />

      <View style={styles.actions}>
        {/* Adres (kendi yerinde) ya da Japonca ad (uygulamadaki yerde): hangisi varsa */}
        <ShowDriverButton text={place.address || place.japaneseName} name={place.name} />
        {item && (
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
        )}
        {/* Kendi yerinde detay sayfası yok; konumu seçildiyse doğrudan yol tarifi */}
        {!item && place.coordinates && (
          <Pressable
            onPress={() => Linking.openURL(directionsUrl(place.coordinates!))}
            style={styles.action}
            accessibilityRole="link">
            <SymbolView
              name={{ ios: 'arrow.triangle.turn.up.right.circle', android: 'directions' }}
              size={20}
              tintColor={RED}
            />
            <Text style={styles.actionText}>Yol tarifi al</Text>
          </Pressable>
        )}
        <Pressable onPress={confirmRemove} style={styles.action} accessibilityRole="button">
          <SymbolView name={{ ios: 'trash', android: 'delete' }} size={20} tintColor={RED} />
          <Text style={styles.actionText}>Plandan çıkar</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  // Tek satırlık yazı kutusu (yerin adı, adresi)
  field: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    fontSize: 16,
    color: '#1A1A1A',
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
