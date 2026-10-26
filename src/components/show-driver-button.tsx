// "Taksiciye göster" düğmesi (durak sayfası, kalınan yer sayfası). Gösterilecek Japonca metin yoksa çizilmez.
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text } from 'react-native';

const RED = '#C8102E';

type Props = { text?: string; name?: string };

export function ShowDriverButton({ text, name }: Props) {
  if (!text?.trim()) return null;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/show-driver', params: { text: text.trim(), name } })}
      style={styles.row}
      accessibilityRole="button"
      accessibilityHint="Japonca adı büyük yazıyla gösterir">
      <SymbolView name={{ ios: 'car.fill', android: 'local_taxi' }} size={20} tintColor={RED} />
      <Text style={styles.text}>Taksiciye göster</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  text: { fontSize: 16, fontWeight: '600', color: RED },
});
