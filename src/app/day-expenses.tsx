// Günün harcamaları: Planım'da günün altındaki 💴 satırından alttan açılır. Adres: /day-expenses?day=…
// Üstte hızlı ekleme (ne için + kaç yen), altında liste, en altta toplam ve kur.
// Art arda birkaç harcama girilebilsin diye eklenince alanlar temizlenir, imleç "ne için"e döner.
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AutoSaveInput } from '@/components/auto-save-input';
import { addExpense, formatDateKey, removeExpense, totalYen, useTrip } from '@/hooks/use-trip';
import { formatTry, formatYen, setExchangeRate, useTripInfo } from '@/hooks/use-trip-info';

const RED = '#C8102E';

export default function DayExpensesScreen() {
  const { day: dayId } = useLocalSearchParams<{ day: string }>();
  const days = useTrip();
  const day = days.find((d) => d.id === dayId);
  const { tryPer100Yen } = useTripInfo();
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  // ref: TextInput'un kendi metodunu (focus) çağırmak için (webdeki input.focus())
  const labelRef = useRef<TextInput>(null);

  if (!day) {
    return (
      <View style={styles.center}>
        <Text>Gün bulunamadı.</Text>
      </View>
    );
  }

  const yen = Number(amount.replace(/\D/g, '')); // Sadece rakamlar: "1.200" da "1200" da olur
  const canAdd = yen > 0;

  function add() {
    if (!canAdd) return;
    addExpense(day!.id, label, yen);
    Haptics.selectionAsync();
    setLabel('');
    setAmount('');
    labelRef.current?.focus(); // Sıradaki harcama için
  }

  const expenses = day.expenses ?? [];
  const dayTotal = totalYen([day]);
  const tripTotal = totalYen(days);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Text style={styles.date}>{formatDateKey(day.date)}</Text>

      {/* Hızlı ekleme satırı */}
      <View style={styles.addRow}>
        <TextInput
          ref={labelRef}
          value={label}
          onChangeText={setLabel}
          placeholder="Ne için? (ramen, Suica…)"
          placeholderTextColor="#8A847C"
          style={[styles.field, styles.flex]}
          returnKeyType="next"
        />
        <View style={[styles.field, styles.amountBox]}>
          <Text style={styles.yenSign}>¥</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="#8A847C"
            keyboardType="number-pad" // Sadece rakam klavyesi
            style={styles.amount}
            returnKeyType="done"
            onSubmitEditing={add}
          />
        </View>
        <Pressable
          onPress={add}
          disabled={!canAdd}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Harcamayı ekle"
          accessibilityState={{ disabled: !canAdd }}>
          <SymbolView
            name={{ ios: 'plus.circle.fill', android: 'add_circle' }}
            size={34}
            tintColor={canAdd ? RED : '#C9C2B8'}
          />
        </Pressable>
      </View>

      {expenses.length === 0 ? (
        <Text style={styles.empty}>Bugün henüz harcama yok.</Text>
      ) : (
        <View style={styles.list}>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.item}>
              <Text style={styles.itemLabel} numberOfLines={1}>
                {expense.label}
              </Text>
              <Text style={styles.itemAmount}>{formatYen(expense.yen)}</Text>
              <Pressable
                onPress={() => removeExpense(day.id, expense.id)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`${expense.label} harcamasını sil`}>
                <SymbolView name={{ ios: 'xmark.circle.fill', android: 'cancel' }} size={20} tintColor="#C9C2B8" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Toplamlar */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Bugün</Text>
          <Text style={styles.totalValue}>
            {formatYen(dayTotal)} <Text style={styles.try}>{formatTry(dayTotal, tryPer100Yen)}</Text>
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Bütün gezi</Text>
          <Text style={styles.totalValue}>
            {formatYen(tripTotal)} <Text style={styles.try}>{formatTry(tripTotal, tryPer100Yen)}</Text>
          </Text>
        </View>
      </View>

      {/* Kur: bir kez girilir, bütün gezi için geçerli */}
      <View style={styles.rateRow}>
        <Text style={styles.rateText}>100 ¥ =</Text>
        <AutoSaveInput
          initial={tryPer100Yen ? String(tryPer100Yen).replace('.', ',') : ''}
          onSave={(text) => {
            const value = Number(text.replace(',', '.')); // "21,5" de "21.5" de olur
            setExchangeRate(value > 0 ? value : undefined);
          }}
          placeholder="?"
          placeholderTextColor="#8A847C"
          keyboardType="decimal-pad"
          style={[styles.field, styles.rate]}
        />
        <Text style={styles.rateText}>₺</Text>
        <Text style={styles.rateHint}>TL karşılığı için kuru gir</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, gap: 14, paddingBottom: 40 },
  date: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
  field: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    fontSize: 16,
    color: '#1A1A1A',
  },
  amountBox: { width: 108, flexDirection: 'row', alignItems: 'center', gap: 4 },
  yenSign: { fontSize: 16, color: '#6B6B6B' },
  amount: { flex: 1, fontSize: 16, color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  empty: { fontSize: 15, color: '#6B6B6B' },
  list: { gap: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  itemLabel: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  itemAmount: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  totals: { gap: 6, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#C9C2B8' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 15, color: '#4A4A4A' },
  totalValue: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  try: { fontSize: 14, fontWeight: '400', color: '#6B6B6B' },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rateText: { fontSize: 15, color: '#4A4A4A' },
  rate: { width: 80, textAlign: 'center' },
  rateHint: { fontSize: 13, color: '#8A847C' },
});
