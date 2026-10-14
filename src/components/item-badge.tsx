// Dükkanlarda "ne alınır" etiketi: ikon + ad. Şehir sayfasında ve harita kartında aynı görünür.
// Rengi alışverişin indigosu: haritadaki çanta pinleriyle aynı dili konuşur.
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { MAP_KINDS } from '@/constants/map-kinds';
import type { ShopItem } from '@/data/shops';

const COLOR = MAP_KINDS.shop.color;

export function ItemBadge({ item }: { item: ShopItem }) {
  return (
    <View style={styles.badge}>
      <SymbolView name={item.icon} size={13} tintColor={COLOR} />
      <Text style={styles.text}>{item.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLOR + '1A', // Aynı rengin %10 opaklıkta hali: açık indigo zemin
  },
  // Koyu indigo yazı, açık indigo zemin üstünde ~8:1 kontrast (WCAG en az 4,5:1 istiyor)
  text: { fontSize: 14, fontWeight: '500', color: COLOR },
});
