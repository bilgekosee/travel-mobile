// "Yer ekle" sayfası: Planım'da bir güne gidilecek yeri ve günün hangi diliminde gidileceğini seçersin.
// Planım'daki "+ Yer ekle"den alttan açılır. Adres: /add-stop?day=… (isteğe bağlı &slot=Öğle)
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SlotChip } from '@/components/slot-chip';
import { DAY_SLOTS, type DaySlot } from '@/constants/day-slots';
import { MAP_KINDS } from '@/constants/map-kinds';
import { normalize } from '@/constants/search';
import { MAP_ITEMS, type MapItem } from '@/data/map-items';
import { CUSTOM_PLACE_THEME, placeOf } from '@/data/plan-place';
import { addCustomStop, addStop, formatDateKey, useTrip } from '@/hooks/use-trip';

export default function AddStopScreen() {
  const params = useLocalSearchParams<{ day: string; slot?: string }>();
  const days = useTrip();
  const day = days.find((d) => d.id === params.day);
  // Adresten bir dilim geldiyse o seçili açılır (önce gerçekten bir dilim adı mı diye kontrol), yoksa Sabah
  const [slot, setSlot] = useState<DaySlot>(DAY_SLOTS.find((s) => s === params.slot) ?? 'Sabah');
  const [query, setQuery] = useState('');

  if (!day) {
    return (
      <View style={styles.center}>
        <Text>Gün bulunamadı.</Text>
      </View>
    );
  }

  // Bu güne daha önce eklenen yerlerin şehirleri: listede önce bunlar gösterilir (bir günde genelde tek şehir gezilir)
  const dayCities = new Set(day.stops.map((s) => placeOf(s)?.city).filter((c) => c !== undefined));
  const q = normalize(query.trim());
  const results = MAP_ITEMS.filter(
    (item) => !q || normalize(`${item.name} ${item.japaneseName} ${item.city} ${item.label}`).includes(q),
  ).sort((a, b) => Number(dayCities.has(b.city)) - Number(dayCities.has(a.city)));

  function choose(item: MapItem) {
    addStop(day!.id, slot, item.id);
    Haptics.selectionAsync();
    router.back();
  }

  // Listede olmayan yer: aranan adla ekle, sonra durak sayfasını aç (adres ve konum orada girilir).
  // replace: bu sayfa durak sayfasına dönüşür; kapatınca tekrar "Yer ekle"ye düşülmez (webdeki history.replaceState)
  function chooseCustom() {
    const stopId = addCustomStop(day!.id, slot, query);
    Haptics.selectionAsync();
    router.replace({ pathname: '/stop', params: { id: stopId } });
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic" // İçerik başlık çubuğunun altından başlasın, altında kalmasın
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      stickyHeaderIndices={[0]} // İlk çocuk (gün + arama) kaydırırken üstte yapışık kalır (CSS'teki position: sticky)
    >
      <View style={styles.top}>
        {/* Hangi güne, günün hangi dilimine ekliyoruz? */}
        <Text style={styles.targetText}>{formatDateKey(day.date)}</Text>
        <View style={styles.slots}>
          {DAY_SLOTS.map((s) => (
            <SlotChip key={s} slot={s} selected={s === slot} onPress={() => setSlot(s)} />
          ))}
        </View>

        <View style={styles.search}>
          <SymbolView name={{ ios: 'magnifyingglass', android: 'search' }} size={18} tintColor="#6E6860" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Yer, şehir ya da tür ara"
            placeholderTextColor="#6E6860"
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        {/* Arama boşken: kendi yer ekleme özelliğini keşfettirmek için küçük bir ipucu */}
        {query.trim() === '' && (
          <Text style={styles.hint}>Aradığın yer listede yok mu? Adını yaz, kendi yerin olarak ekle.</Text>
        )}
      </View>

      {/* Bir şey yazıldıysa en üstte: "bu adla kendi yerini ekle". Sonuç olsa da gösteriyoruz: aranan yer
          listedekiyle aynı ad taşıyan başka bir yer olabilir. */}
      {query.trim() !== '' && (
        <Pressable onPress={chooseCustom} style={styles.row} accessibilityRole="button">
          <View style={[styles.kindIcon, { backgroundColor: CUSTOM_PLACE_THEME.color }]}>
            <SymbolView name={CUSTOM_PLACE_THEME.icon} size={15} tintColor="#FFFFFF" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              “{query.trim()}” ekle
            </Text>
            <Text style={styles.rowMeta}>Kendi yerin · adres ve konumu sonra girersin</Text>
          </View>
          <SymbolView name={{ ios: 'plus', android: 'add' }} size={16} tintColor="#8A847C" />
        </Pressable>
      )}

      {results.map((item) => {
        const kind = MAP_KINDS[item.kind];
        return (
          <Pressable key={item.id} onPress={() => choose(item)} style={styles.row} accessibilityRole="button">
            <View style={[styles.kindIcon, { backgroundColor: kind.color }]}>
              <SymbolView name={kind.icon} size={15} tintColor="#FFFFFF" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowMeta}>
                {item.city} · {item.label}
              </Text>
            </View>
            <SymbolView name={{ ios: 'plus', android: 'add' }} size={16} tintColor="#8A847C" />
          </Pressable>
        );
      })}
      {results.length === 0 && <Text style={styles.empty}>Listede “{query.trim()}” yok. Yukarıdan kendin ekleyebilirsin.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { paddingHorizontal: 20, gap: 4, paddingBottom: 40 },
  // Yapışkan üst kısım: zemin rengi şart, yoksa altından kayan satırlar arkasında görünür
  top: { backgroundColor: '#FAF7F2', paddingTop: 12 },
  targetText: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  slots: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    minHeight: 46,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  hint: { fontSize: 13, color: '#6B6B6B', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 6 },
  kindIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  rowMeta: { fontSize: 13, color: '#6B6B6B' },
  empty: { fontSize: 15, color: '#6B6B6B', textAlign: 'center', paddingTop: 24 },
});
