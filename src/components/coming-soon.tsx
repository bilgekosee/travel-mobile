// Henüz yapılmamış sekmeler için geçici "yakında" ekranı.
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function ComingSoon({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    // contentInsetAdjustmentBehavior: içerik büyük başlığın ve sekme çubuğunun altında kalmasın
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.badge}>Yakında</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    alignItems: 'center',
    gap: 8,
    padding: 32,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  emoji: { fontSize: 56 },
  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  description: { fontSize: 15, color: '#555555', textAlign: 'center', lineHeight: 21 },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FDE8EC',
    color: '#C8102E',
    fontSize: 13,
    fontWeight: '700',
  },
});
