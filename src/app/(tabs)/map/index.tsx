// Harita sekmesi: tam ekran harita + üstte filtre düğmeleri + pine dokununca altta bilgi kartı.
import { GlassView } from 'expo-glass-effect';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/chip';
import { ItemBadge } from '@/components/item-badge';
import { PlacesMap } from '@/components/places-map';
import { serifText } from '@/constants/fonts';
import { MAP_KINDS } from '@/constants/map-kinds';
import { MAP_ITEMS, type MapItem } from '@/data/map-items';
import { useGlass } from '@/hooks/use-glass';

type Filter = 'all' | MapItem['kind'];

// "Tümü" + MAP_KINDS'taki her tür. Yeni bir tür eklenince filtresi kendiliğinden gelir.
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  ...(Object.keys(MAP_KINDS) as MapItem['kind'][]).map((kind) => ({ value: kind, label: MAP_KINDS[kind].label })),
];

// Sekme çubuğu içeriğin üstünde yüzüyor; kart onun altında kalmasın diye bu kadar yukarıda durur.
const TAB_BAR_HEIGHT = 60;

// Telefonun kendi harita uygulamasında yol tarifini açan adres
function directionsUrl({ latitude, longitude }: MapItem['coordinates']) {
  return Platform.OS === 'ios'
    ? `https://maps.apple.com/?daddr=${latitude},${longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export default function MapScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<MapItem | null>(null);
  const [focused, setFocused] = useState<MapItem | null>(null);
  // Çentik/Dynamic Island ve alt çubuk için bırakılması gereken boşluklar
  const insets = useSafeAreaInsets();

  // Başka bir ekrandan "/map?focus=shop-akihabara" adresiyle gelindiyse o noktayı seç ve oraya git.
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  // Parametre değiştiyse state'i çizim sırasında güncelliyoruz (useEffect'te değil):
  // effect ekran çizildikten sonra çalışır, ekranın bir kez daha çizilmesine yol açardı.
  // https://react.dev/learn/you-might-not-need-an-effect
  // Başta undefined: harita sekmesi ilk kez bir bağlantıyla açılsa da parametre işlensin
  const [handledFocus, setHandledFocus] = useState<string | undefined>(undefined);
  if (focus !== handledFocus) {
    setHandledFocus(focus);
    const item = MAP_ITEMS.find((i) => i.id === focus);
    if (item) {
      setFilter('all'); // Önceden seçilmiş bir filtre bu pini gizlemesin
      setSelected(item);
      // { ...item }: her seferinde yeni bir nesne. Aynı yere ikinci kez gelindiğinde de
      // PlacesMap "focus değişti" diye algılasın ve tekrar oraya gitsin.
      setFocused({ ...item });
    }
  }
  // Parametreyi adresten sil: aynı bağlantıya tekrar dokunulunca adres yine değişsin, ekran yine tepki versin.
  // Router React'in dışında bir şey olduğu için bu iş useEffect'in doğru kullanım yeri.
  useEffect(() => {
    if (focus) router.setParams({ focus: undefined });
  }, [focus]);

  const items = filter === 'all' ? MAP_ITEMS : MAP_ITEMS.filter((item) => item.kind === filter);

  function changeFilter(value: Filter) {
    setFilter(value);
    // Seçili pin artık görünmüyorsa kartı da kapat
    if (selected && value !== 'all' && selected.kind !== value) setSelected(null);
  }

  return (
    <View style={styles.container}>
      {/* Harita tüm ekranı kaplasın: başlık çubuğunu gizliyoruz */}
      <Stack.Screen options={{ headerShown: false }} />

      <PlacesMap items={items} focus={focused} onSelect={setSelected} onDeselect={() => setSelected(null)} />

      {/* Haritanın üstünde yüzen filtre satırı. Yatay kaydırılabilir: küçük ekranlarda ve büyük yazıda sığmazsa kesilmez. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filters, { top: insets.top + 8 }]}
        contentContainerStyle={styles.filtersContent}>
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            count={f.value === 'all' ? MAP_ITEMS.length : MAP_ITEMS.filter((item) => item.kind === f.value).length}
            active={filter === f.value}
            onPress={() => changeFilter(f.value)}
            floating
          />
        ))}
      </ScrollView>

      {selected && (
        <CardShell style={[styles.card, { bottom: insets.bottom + TAB_BAR_HEIGHT }]}>
          {/* Etiket ve düğme, seçilen türün rengini alır (kırmızı / turuncu / indigo) */}
          <Text style={[styles.label, { color: MAP_KINDS[selected.kind].color }]}>
            {selected.label.toLocaleUpperCase('tr')} · {selected.city}
          </Text>
          <Text style={styles.name}>{selected.name}</Text>
          <Text style={styles.japanese}>{selected.japaneseName}</Text>
          <Text style={styles.summary}>{selected.summary}</Text>

          {/* Sadece dükkanlarda var: ne alınır + nasıl gidilir */}
          {selected.items && (
            <>
              <Text style={styles.detailTitle}>Ne alınır</Text>
              <View style={styles.items}>
                {selected.items.map((item) => (
                  <ItemBadge key={item.name} item={item} />
                ))}
              </View>
            </>
          )}
          {selected.access && (
            <>
              <Text style={styles.detailTitle}>Nasıl gidilir</Text>
              <Text style={styles.summary}>{selected.access}</Text>
            </>
          )}

          {selected.kind === 'place' ? (
            // asChild: Link kendi bileşenini çizmez, tıklamayı içindeki Pressable'a verir (webdeki <a> sarmalayıcısı gibi)
            <Link href={{ pathname: '/place/[id]', params: { id: selected.sourceId } }} asChild>
              <Pressable style={styles.button} accessibilityRole="link">
                <Text style={styles.buttonText}>Detayları gör</Text>
              </Pressable>
            </Link>
          ) : (
            <Pressable
              style={[styles.button, { backgroundColor: MAP_KINDS[selected.kind].color }]}
              accessibilityRole="link"
              onPress={() => Linking.openURL(directionsUrl(selected.coordinates))}>
              <Text style={styles.buttonText}>Yol tarifi al</Text>
            </Pressable>
          )}
        </CardShell>
      )}
    </View>
  );
}

// Kartın dış kabuğu: iOS 26'da cam, değilse düz bej zemin. İçerik iki durumda da aynı.
function CardShell({ style, children }: { style: ViewStyle[]; children: ReactNode }) {
  const glass = useGlass();

  if (glass) {
    return (
      <GlassView
        style={style}
        glassEffectStyle="regular" // "clear" fazla şeffaf: haritanın yazıları metne karışırdı
        colorScheme="light" // Karanlık modda da açık kalsın; koyu yazımız okunsun
      >
        {children}
      </GlassView>
    );
  }
  return <View style={[...style, styles.cardSolid]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { position: 'absolute', left: 0, right: 0, flexGrow: 0 },
  filtersContent: { paddingHorizontal: 16, gap: 8 },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 18,
    gap: 4,
    borderRadius: 20,
  },
  // Sadece cam yokken: düz zemin + gölge (cam kendi kenar ışığını ve gölgesini çiziyor)
  cardSolid: { backgroundColor: '#FAF7F2', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1 }, // renk MAP_KINDS'tan gelir
  name: { fontSize: 24, ...serifText, color: '#1A1A1A' },
  japanese: { fontSize: 14, color: '#6B6B6B' },
  summary: { fontSize: 15, lineHeight: 21, color: '#4A4A4A', marginTop: 4 },
  detailTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  // Etiketler yan yana dizilir, sığmayan alt satıra geçer (CSS'teki flex-wrap gibi)
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  button: {
    marginTop: 12,
    minHeight: 44, // Apple'ın önerdiği en küçük dokunma yüksekliği
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C8102E',
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
