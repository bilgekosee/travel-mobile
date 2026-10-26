// Hazırlık listesi: Planım'daki "Hazırlık" kartından açılır. Adres: /plan/checklist
// Japonya'ya özel hazır maddeler + kullanıcının kendi maddeleri. Satırın tamamına dokunmak işaretler,
// basılı tutmak siler. En altta yeni madde eklenir.
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { ChecklistItem } from '@/data/checklist-defaults';
import {
  addChecklistItem,
  checklistOf,
  removeChecklistItem,
  toggleChecklistItem,
  useTripInfo,
} from '@/hooks/use-trip-info';

const RED = '#C8102E';

export default function ChecklistScreen() {
  const items = checklistOf(useTripInfo());
  const [text, setText] = useState('');
  const done = items.filter((i) => i.done).length;

  function add() {
    if (!text.trim()) return;
    addChecklistItem(text);
    setText('');
    Haptics.selectionAsync();
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Stack.Screen options={{ title: 'Hazırlık' }} />

      {/* İlerleme: çubuk + sayı */}
      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${items.length ? (done / items.length) * 100 : 0}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {done}/{items.length} hazır
        </Text>
      </View>

      {items.map((item) => (
        <Row key={item.id} item={item} />
      ))}

      <View style={styles.addRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Madde ekle (ör. ilaçlar)"
          placeholderTextColor="#8A847C"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={add}
          submitBehavior="submit" // "Bitti"de klavye açık kalsın: art arda madde eklenebilsin
        />
        <Pressable onPress={add} disabled={!text.trim()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Ekle">
          <SymbolView
            name={{ ios: 'plus.circle.fill', android: 'add_circle' }}
            size={32}
            tintColor={text.trim() ? RED : '#C9C2B8'}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Row({ item }: { item: ChecklistItem }) {
  function toggle() {
    toggleChecklistItem(item.id);
    Haptics.selectionAsync();
  }

  function confirmRemove() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(item.text, 'Listeden çıkarılsın mı?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Çıkar', style: 'destructive', onPress: () => removeChecklistItem(item.id) },
    ]);
  }

  return (
    <Pressable
      onPress={toggle}
      onLongPress={confirmRemove}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!item.done }}
      accessibilityLabel={item.hint ? `${item.text}. ${item.hint}` : item.text}
      accessibilityActions={[{ name: 'remove', label: 'Listeden çıkar' }]}
      onAccessibilityAction={(e) => e.nativeEvent.actionName === 'remove' && removeChecklistItem(item.id)}>
      <View style={[styles.circle, item.done && styles.circleDone]}>
        {item.done && <SymbolView name={{ ios: 'checkmark', android: 'check' }} size={12} weight="bold" tintColor="#FFFFFF" />}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.text, item.done && styles.textDone]}>{item.text}</Text>
        {item.hint ? <Text style={styles.hint}>{item.hint}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#EFE9E1', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: RED },
  progressText: { fontSize: 14, fontWeight: '600', color: RED, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, minHeight: 48 },
  pressed: { opacity: 0.5 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C9C2B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  circleDone: { backgroundColor: RED, borderColor: RED },
  rowText: { flex: 1, gap: 2 },
  text: { fontSize: 16, color: '#1A1A1A' },
  textDone: { color: '#9A948C' },
  hint: { fontSize: 13, color: '#6B6B6B', lineHeight: 18 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#EFE9E1',
    fontSize: 16,
    color: '#1A1A1A',
  },
});
