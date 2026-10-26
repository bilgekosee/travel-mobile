// Planım sekmesi: gezi takvimi. Kalkıştan dönüşe bir yol; her gün bir durak.
// Sade tutuyoruz: göz sadece "hangi gün, hangi saatte, nereye" sorusunun cevabını görmeli.
// Sık yapılan iş tek dokunuş: sağdaki daire "gittim". Gerisi (not, taşıma, çıkarma) durağa dokununca açılan sayfada.
import * as Haptics from 'expo-haptics';
import { Link, router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { TripDatePicker } from '@/components/trip-date-picker';
import { TripRouteRow } from '@/components/trip-route';
import { DAY_THEME } from '@/constants/day-slots';
import { serifText } from '@/constants/fonts';
import { MAP_ITEMS } from '@/data/map-items';
import {
  addDay,
  daysBetween,
  formatDateKey,
  fromDateKey,
  orderedStops,
  removeDay,
  removeStop,
  todayKey,
  toggleStopDone,
  type TripDay,
  type TripStop,
  useTrip,
} from '@/hooks/use-trip';

const RED = '#C8102E';

export default function PlanScreen() {
  const days = useTrip();
  // ref: ScrollView'un kendi metodunu (scrollTo) çağırmak için (webde bir DOM öğesine ref verip scrollTo çağırmak gibi)
  const scrollRef = useRef<ScrollView>(null);
  // Bugüne bir kez kaydır: sonra kullanıcı gezinirken sayfa kendi kendine zıplamasın
  const scrolledToToday = useRef(false);

  function scrollToToday(y: number) {
    if (scrolledToToday.current) return;
    scrolledToToday.current = true;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: false });
  }

  return (
    <ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {/* iOS'un büyük başlığı burada çizilmiyor ama yerini boş bırakıyordu. Keşfet'teki gibi
          başlığı gizleyip kendimiz yazıyoruz: boşluk gider, başlık her zaman görünür. */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.titleRow}>
        <Text style={styles.title} maxFontSizeMultiplier={1.4}>
          Planım
        </Text>
        {days.length > 0 && (
          <Pressable
            onPress={() => Share.share({ message: shareText(days) })} // Telefonun kendi paylaşım menüsü (webdeki navigator.share)
            hitSlop={12}
            style={styles.share}
            accessibilityRole="button"
            accessibilityLabel="Planı paylaş">
            <SymbolView name={{ ios: 'square.and.arrow.up', android: 'share' }} size={22} tintColor={RED} />
          </Pressable>
        )}
      </View>

      {days.length === 0 ? <EmptyPlan /> : <Trip days={days} onTodayLayout={scrollToToday} />}
    </ScrollView>
  );
}

function Trip({ days, onTodayLayout }: { days: TripDay[]; onTodayLayout: (y: number) => void }) {
  const today = todayKey();
  const status = tripStatus(days, today);

  return (
    <>
      <Text style={styles.summary}>{tripSummary(days)}</Text>
      <View style={styles.status}>
        <SymbolView name={status.icon} size={14} tintColor={RED} />
        <Text style={styles.statusText}>{status.text}</Text>
      </View>

      <TripRouteRow marker={{ kind: 'icon', icon: { ios: 'airplane.departure', android: 'flight_takeoff' } }}>
        <Text style={styles.endpoint}>Kalkış</Text>
      </TripRouteRow>

      {days.map((day, i) => {
        const isToday = day.date === today;
        const allDone = day.stops.length > 0 && day.stops.every((s) => s.done);
        return (
          // onLayout: satır ekrana yerleşince konumunu verir (y: listenin başından uzaklığı). Bugünse oraya kaydırırız.
          <View key={day.id} onLayout={isToday ? (e) => onTodayLayout(e.nativeEvent.layout.y) : undefined}>
            <TripRouteRow marker={{ kind: 'number', value: i + 1, done: allDone }} highlight={isToday}>
              <DayBlock day={day} number={i + 1} isToday={isToday} />
            </TripRouteRow>
          </View>
        );
      })}

      <TripRouteRow marker={{ kind: 'icon', icon: { ios: 'plus', android: 'add' } }}>
        <Pressable onPress={() => addDay()} style={styles.addDay} accessibilityRole="button">
          <Text style={styles.addDayText}>Gün ekle</Text>
        </Pressable>
      </TripRouteRow>

      <TripRouteRow marker={{ kind: 'icon', icon: { ios: 'airplane.arrival', android: 'flight_land' } }} isLast>
        <Text style={styles.endpoint}>Dönüş</Text>
      </TripRouteRow>
    </>
  );
}

// "15 – 21 Nisan · 7 gün". Günler zaten tarihe göre sıralı (store sıralıyor).
function tripSummary(days: TripDay[]) {
  const format = (key: string, withMonth: boolean) =>
    fromDateKey(key).toLocaleDateString('tr-TR', withMonth ? { day: 'numeric', month: 'long' } : { day: 'numeric' });
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const count = `${days.length} gün`;
  if (first === last) return `${format(first, true)} · ${count}`;
  const sameMonth = first.slice(0, 7) === last.slice(0, 7); // "2027-04" aynıysa ay adını bir kez yaz
  return `${format(first, !sameMonth)} – ${format(last, true)} · ${count}`;
}

// Gezinin neresindeyiz? Öncesi: geri sayım. Sırası: kaçıncı gün + ilerleme. Sonrası: kısa özet.
// "2027-04-15" biçimindeki tarihler metin olarak da doğru sıralanıyor: < ve > ile karşılaştırabiliriz.
function tripStatus(days: TripDay[], today: string) {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const stops = days.flatMap((day) => day.stops);
  const visited = `${stops.filter((s) => s.done).length}/${stops.length} yer gezildi`;

  if (today < first) {
    const left = daysBetween(today, first);
    return {
      icon: { ios: 'airplane', android: 'flight' },
      text: left === 1 ? 'Gezi yarın başlıyor!' : `Geziye ${left} gün kaldı`,
    } as const;
  }
  if (today > last) {
    return {
      icon: { ios: 'checkmark.seal.fill', android: 'verified' },
      text: stops.length > 0 ? `Gezi bitti · ${visited}` : 'Gezi bitti',
    } as const;
  }
  const index = days.findIndex((day) => day.date === today);
  // Bugün planda bir gün olmayabilir (iki gün arasında boşluk bırakılmışsa)
  const dayText = index >= 0 ? `Bugün ${index + 1}. gün` : 'Gezi sürüyor';
  return {
    icon: { ios: 'figure.walk', android: 'directions_walk' },
    text: stops.length > 0 ? `${dayText} · ${visited}` : dayText,
  } as const;
}

// Planın düz metin hali: WhatsApp'a, notlara yapıştırılabilir
function shareText(days: TripDay[]) {
  const lines = [`🇯🇵 Japonya gezim · ${tripSummary(days)}`];
  days.forEach((day, i) => {
    lines.push('', `${i + 1}. gün · ${formatDateKey(day.date)}`);
    for (const stop of orderedStops(day)) {
      const item = MAP_ITEMS.find((it) => it.id === stop.itemId);
      if (!item) continue;
      const note = stop.note?.trim() ? ` (${stop.note.trim()})` : '';
      lines.push(`${DAY_THEME[stop.slot].emoji} ${item.name}${note}${stop.done ? ' ✓' : ''}`);
    }
    if (day.stay) lines.push(`🛏 ${day.stay}`);
  });
  return lines.join('\n');
}

// Bir gün: tarih (dokununca değişir), şehirler + ilerleme, sabah→öğle→akşam sırasıyla yerler, "+ Yer ekle", kalınan yer.
// Kart yok: yol ve duraklar günleri zaten birbirinden ayırıyor.
function DayBlock({ day, number, isToday }: { day: TripDay; number: number; isToday: boolean }) {
  // Güne eklenen yerlerin şehirleri: "Kyoto · Nara" (aynı şehir bir kez)
  const cities = [
    ...new Set(day.stops.map((s) => MAP_ITEMS.find((i) => i.id === s.itemId)?.city).filter(Boolean)),
  ].join(' · ');
  const stops = orderedStops(day);
  const doneCount = stops.filter((s) => s.done).length;
  const progress = stops.length > 0 ? `${doneCount}/${stops.length} gezildi` : '';
  const subtitle = [cities, progress].filter(Boolean).join(' · ');
  // Bugünse sıradaki yer: henüz gidilmemiş ilk durak
  const nextStopId = isToday ? stops.find((s) => !s.done)?.id : undefined;

  function remove() {
    // Boş günü sormadan sil; dolu günde onay iste (içindeki yerler de gidecek, geri alınamaz)
    if (day.stops.length === 0) return removeDay(day.id);
    Alert.alert(`${number}. günü sil?`, 'Bu güne eklediğin yerler de plandan çıkacak.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeDay(day.id) },
    ]);
  }

  // ⋯ menüsü: seyrek yapılan işlemler burada, ekranı kalabalıklaştırmasın
  function openMenu() {
    Alert.alert(`${number}. gün`, undefined, [
      { text: 'Tarihi değiştir', onPress: () => router.push({ pathname: '/pick-date', params: { day: day.id } }) },
      { text: 'Günü sil', style: 'destructive', onPress: remove },
      { text: 'Vazgeç', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.day}>
      {isToday && <Text style={styles.todayTag}>BUGÜN</Text>}
      <View style={styles.dayHeader}>
        <View style={styles.dayDate}>
          <TripDatePicker dayId={day.id} date={day.date} subtitle={subtitle} />
        </View>
        <View style={styles.dayActions}>
          {stops.length > 0 && (
            <Link href={{ pathname: '/plan/day-map', params: { day: day.id } }} asChild>
              <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`${number}. günü haritada gör`}>
                <SymbolView name={{ ios: 'map', android: 'map' }} size={20} tintColor={RED} />
              </Pressable>
            </Link>
          )}
          <Pressable onPress={openMenu} hitSlop={10} accessibilityRole="button" accessibilityLabel={`${number}. gün seçenekleri`}>
            <SymbolView name={{ ios: 'ellipsis', android: 'more_horiz' }} size={20} tintColor="#8A847C" />
          </Pressable>
        </View>
      </View>

      {stops.map((stop) => (
        <StopRow key={stop.id} day={day} stop={stop} isNext={stop.id === nextStopId} />
      ))}

      <Link href={{ pathname: '/add-stop', params: { day: day.id } }} asChild>
        <Pressable style={styles.addStop} hitSlop={6} accessibilityRole="button">
          <Text style={styles.addStopText}>+ Yer ekle</Text>
        </Pressable>
      </Link>

      {/* O gece nerede kalınıyor? Boşsa soluk bir davet, doluysa otelin adı. Dokununca alttan sayfa açılır. */}
      <Link href={{ pathname: '/day-stay', params: { day: day.id } }} asChild>
        <Pressable
          style={styles.stay}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={day.stay ? `Kalınan yer: ${day.stay}. Değiştir` : 'Kalınan yer ekle'}>
          <SymbolView
            name={{ ios: 'bed.double.fill', android: 'hotel' }}
            size={15}
            tintColor={day.stay ? '#4A4A4A' : '#8A847C'}
          />
          <Text style={day.stay ? styles.stayText : styles.addStopText} numberOfLines={1}>
            {day.stay ?? 'Kalınan yer'}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

// Bir yer: solda dilimin küçük ikonu (yazı yok: doğan güneş / güneş / ay herkesin anladığı semboller), yanında adı
// ve varsa notu, sağda "gittim" dairesi. Satıra dokununca durak sayfası açılır; basılı tutunca plandan çıkarılır.
function StopRow({ day, stop, isNext }: { day: TripDay; stop: TripStop; isNext: boolean }) {
  const item = MAP_ITEMS.find((i) => i.id === stop.itemId);
  if (!item) return null; // Veriden kaldırılmış bir yer: sessizce atla
  const theme = DAY_THEME[stop.slot];

  function open() {
    router.push({ pathname: '/stop', params: { id: stop.id } });
  }

  function toggleDone() {
    // Bu dokunuşla günün son yeri de işaretleniyorsa küçük bir kutlama titreşimi, yoksa hafif bir "tık"
    const completesDay = !stop.done && day.stops.every((s) => s.id === stop.id || s.done);
    toggleStopDone(stop.id);
    if (completesDay) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.selectionAsync();
  }

  function remove() {
    removeStop(stop.id);
    Haptics.selectionAsync();
  }

  function confirmRemove() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Basılı tutma algılandı
    Alert.alert(item!.name, undefined, [
      { text: 'Plandan çıkar', style: 'destructive', onPress: remove },
      { text: 'Vazgeç', style: 'cancel' },
    ]);
  }

  const note = stop.note?.trim();

  return (
    // Sıradaki durak: açık kırmızı zemin. Bugün gezerken göz önce onu bulsun.
    <View style={[styles.stop, isNext && styles.stopNext]}>
      <Pressable
        onPress={open}
        onLongPress={confirmRemove}
        style={({ pressed }) => [styles.stopMain, pressed && styles.stopPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${stop.slot}: ${item.name}${isNext ? ', sıradaki' : ''}${note ? `. Not: ${note}` : ''}`}
        accessibilityHint="Not, taşıma ve diğer seçenekler"
        // Basılı tutmak VoiceOver'da zor bir hareket: aynı işlemi bir erişilebilirlik eylemi olarak da sunuyoruz
        accessibilityActions={[{ name: 'remove', label: 'Plandan çıkar' }]}
        onAccessibilityAction={(e) => e.nativeEvent.actionName === 'remove' && remove()}>
        <SymbolView name={theme.icon} size={15} tintColor={theme.color} style={stop.done && styles.faded} />
        <View style={styles.stopText}>
          <Text style={[styles.stopName, stop.done && styles.stopNameDone]} numberOfLines={1}>
            {item.name}
          </Text>
          {/* note ? … : null — "note && …" boş metinde '' döndürür; React Native onu Text dışında çizemez, hata verir */}
          {note ? (
            <Text style={styles.stopNote} numberOfLines={1}>
              {note}
            </Text>
          ) : null}
        </View>
        {isNext && <Text style={styles.nextTag}>SIRADAKİ</Text>}
      </Pressable>

      {/* "Gittim" dairesi. Daire küçük ama hitSlop ile dokunma alanı ~44 nokta: parmak ıskalamasın */}
      <Pressable
        onPress={toggleDone}
        hitSlop={12}
        style={styles.check}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!stop.done }}
        accessibilityLabel={`${item.name}: gittim`}>
        <View style={[styles.checkCircle, stop.done && styles.checkCircleDone]}>
          {stop.done && (
            <SymbolView name={{ ios: 'checkmark', android: 'check' }} size={12} weight="bold" tintColor="#FFFFFF" />
          )}
        </View>
      </Pressable>
    </View>
  );
}

// Boş durum: kullanıcıyı çıkmazda bırakmak yerine bir sonraki adımı gösterir
function EmptyPlan() {
  return (
    <View style={styles.empty}>
      <SymbolView name={{ ios: 'map', android: 'map' }} size={56} tintColor={RED} />
      <Text style={styles.emptyTitle}>Gezini planla</Text>
      <Text style={styles.emptyText}>
        Gün gün, sabah-öğle-akşam nereye gideceğini yaz. Bir yerin sayfasında ya da haritadaki kartında takvim
        ikonuna dokunarak da plana ekleyebilirsin.
      </Text>
      <Pressable style={styles.button} onPress={() => addDay()} accessibilityRole="button">
        <Text style={styles.buttonText}>İlk günü ekle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 12, paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 40, ...serifText, color: '#1A1A1A', marginTop: 8 },
  share: { padding: 4, marginTop: 8 },
  summary: { fontSize: 15, color: '#6B6B6B' },
  // Durum "hapı": açık kırmızı zemin, kırmızı yazı. Özetin altında, yolun üstünde.
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Satırı doldurmasın, yazı kadar genişlesin
    gap: 6,
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#F4E3E5',
  },
  statusText: { fontSize: 14, fontWeight: '600', color: RED },
  endpoint: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginTop: 4 },
  addDay: { minHeight: 30, justifyContent: 'center', alignSelf: 'flex-start' },
  addDayText: { fontSize: 16, fontWeight: '600', color: RED },

  day: { gap: 2, paddingBottom: 8 },
  dayHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  dayDate: { flex: 1 }, // Tarih kalan genişliği alır; düğmeler hep sağda kalır
  dayActions: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingTop: 4 },
  todayTag: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: RED, marginBottom: 2 },

  // Satır kenara kadar uzanıyor; sıradaki durağın zemini görünsün diye içeride biraz boşluk
  stop: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40, borderRadius: 10, paddingHorizontal: 6, marginHorizontal: -6 },
  stopNext: { backgroundColor: '#F4E3E5' },
  stopMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  stopPressed: { opacity: 0.5 },
  stopText: { flex: 1 },
  stopName: { fontSize: 16, color: '#1A1A1A' },
  stopNameDone: { color: '#9A948C' }, // Gidildi: soluk ama okunur (üstünü çizmiyoruz, ad hâlâ işe yarayabilir)
  stopNote: { fontSize: 13, color: '#6B6B6B', marginTop: 1 },
  faded: { opacity: 0.45 },
  nextTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: RED },
  check: { padding: 4 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C9C2B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: { backgroundColor: RED, borderColor: RED },
  addStop: { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' },
  addStopText: { fontSize: 15, fontWeight: '600', color: '#8A847C' },
  stay: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 36, alignSelf: 'flex-start', maxWidth: '100%' },
  stayText: { fontSize: 15, color: '#4A4A4A', flexShrink: 1 },

  // Dikey ortalamıyoruz: iOS içeriği başlığın altından başlattığı için "orta" gerçek ortanın altında kalıyordu
  empty: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, gap: 12 },
  emptyTitle: { fontSize: 24, ...serifText, color: '#1A1A1A', textAlign: 'center', marginTop: 8 },
  emptyText: { fontSize: 15, lineHeight: 22, color: '#555555', textAlign: 'center' },
  button: {
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
    marginTop: 12,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
