// Planım'daki yol. Her satırın solunda bir durak (gün numarası ya da ikon) ve duraktan bir sonrakine
// inen kesik çizgi var. Satırlar art arda gelince kalkıştan dönüşe tek bir yol oluşur.
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type ReactNode, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const RED = '#C8102E';
const ROUTE = '#C9A9A0'; // Yolun rengi: kırmızının soluk, toprak tonu; içerikle yarışmasın
const COLUMN = 44; // Sol sütunun genişliği
const NODE = 30; // Durak dairesinin çapı

// done: günün bütün yerleri gezildi → numara yerine ✓
type Marker = { kind: 'number'; value: number; done?: boolean } | { kind: 'icon'; icon: SymbolViewProps['name'] };

type Props = {
  marker: Marker;
  isLast?: boolean; // Son satırın altında yol yok
  highlight?: boolean; // Bugün: durağın çevresinde hale
  children: ReactNode;
};

export function TripRouteRow({ marker, isLast, highlight, children }: Props) {
  // Satırın yüksekliği içeriğe göre değişiyor (dolu gün boş günden uzun): ölçüp eğriyi ona göre çiziyoruz
  const [height, setHeight] = useState(0);

  // Duraktan bir sonrakine düz çizgi. (Önce dalgalıydı; sade ekranda gözü yerlerden uzaklaştırıyordu.)
  const x = COLUMN / 2;
  const top = NODE; // Durağın hemen altından başla
  const path = `M ${x} ${top} L ${x} ${height}`; // M: kalemi buraya koy, L: buraya kadar çiz

  return (
    <View style={styles.row} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      <View style={styles.column}>
        {!isLast && height > top && (
          <Svg width={COLUMN} height={height} style={StyleSheet.absoluteFill}>
            {/* strokeDasharray: 5 birim çizgi, 5 birim boşluk → kesik çizgili "yol" (CSS'teki dashed) */}
            <Path d={path} stroke={ROUTE} strokeWidth={2} strokeDasharray="5 5" fill="none" strokeLinecap="round" />
          </Svg>
        )}
        <View style={[styles.node, marker.kind === 'number' && styles.nodeNumber, highlight && styles.nodeHighlight]}>
          {marker.kind === 'number' && marker.done ? (
            <SymbolView name={{ ios: 'checkmark', android: 'check' }} size={14} weight="bold" tintColor="#FFFFFF" />
          ) : marker.kind === 'number' ? (
            <Text style={styles.nodeText} maxFontSizeMultiplier={1.2}>
              {marker.value}
            </Text>
          ) : (
            <SymbolView name={marker.icon} size={15} tintColor={RED} />
          )}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  column: { width: COLUMN, alignItems: 'center' },
  // Durak: beyaz daire, kırmızı kenar. Gün durağı dolu kırmızı.
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNumber: { backgroundColor: RED },
  // Dördüncü değer "spread": bulanıklık yok, daireyi 5 nokta büyüten düz bir halka (CSS'teki gibi)
  nodeHighlight: { boxShadow: '0 0 0 5px rgba(200,16,46,0.18)' },
  nodeText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  // Eğri bir sonraki durağa uzansın diye içerik satırın dibine kadar boşluk bırakır
  content: { flex: 1, paddingBottom: 18 },
});
