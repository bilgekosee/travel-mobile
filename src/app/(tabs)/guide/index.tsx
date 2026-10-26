// Rehber sekmesi: internetsiz okunan pratik bilgiler. Üstte dört bölüm: İfadeler · Görgü · Ulaşım · Acil.
// İfadeye dokununca Japoncası tam ekran büyük yazıyla açılır: telefonu karşındakine uzatırsın.
// 🔊 Japoncasını telefonun Japonca sesiyle okur (expo-speech; telefonun kendi sesi, internet gerekmez).
// Acil numaraya dokununca arama başlar.
import { router, Stack } from 'expo-router';
import * as Speech from 'expo-speech';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { serifText } from '@/constants/fonts';
import { EMERGENCY, ETIQUETTE, PHRASE_GROUPS, type Tip, TRANSPORT } from '@/data/guide';

const RED = '#C8102E';

const SECTIONS = [
  { key: 'phrases', label: 'İfadeler' },
  { key: 'etiquette', label: 'Görgü' },
  { key: 'transport', label: 'Ulaşım' },
  { key: 'emergency', label: 'Acil' },
] as const;
type Section = (typeof SECTIONS)[number]['key'];

export default function GuideScreen() {
  const [section, setSection] = useState<Section>('phrases');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {/* Planım'daki gibi: iOS'un büyük başlığı yerine kendi başlığımız */}
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title} maxFontSizeMultiplier={1.4}>
        Rehber
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {SECTIONS.map((s) => (
          <Chip key={s.key} label={s.label} active={section === s.key} onPress={() => setSection(s.key)} />
        ))}
      </ScrollView>

      {section === 'phrases' && <Phrases />}
      {section === 'etiquette' && <Tips tips={ETIQUETTE} />}
      {section === 'transport' && <Tips tips={TRANSPORT} />}
      {section === 'emergency' && <Emergency />}
    </ScrollView>
  );
}

// İfadeler duruma göre gruplu. Karta dokun → büyük göster; 🔊 → Japoncasını telefonun Japonca sesiyle dinle.
function Phrases() {
  // Şu an okunan ifade (düğmesi kırmızı olsun). Aynı anda tek ifade okunur.
  const [speaking, setSpeaking] = useState<string | null>(null);

  // Rehber'den çıkınca (bileşen ekrandan kalkınca) konuşma da sussun
  useEffect(() => () => void Speech.stop(), []);

  function speak(ja: string) {
    Speech.stop(); // Önceki okunuyorsa kes
    setSpeaking(ja);
    // Bittiğinde/kesildiğinde düğmeyi söndür. (Kesilen eski ifadenin onStopped'ı yenisini söndürmesin diye karşılaştırıyoruz.)
    const clear = () => setSpeaking((current) => (current === ja ? null : current));
    Speech.speak(ja, {
      language: 'ja-JP',
      rate: 0.85, // Biraz yavaş: öğrenirken daha anlaşılır
      onDone: clear,
      onStopped: clear,
      onError: clear,
    });
  }

  return (
    <View style={styles.list}>
      <Text style={styles.intro}>
        Dokun: Japoncası büyük yazıyla açılır. 🔊 ile nasıl söylendiğini dinle (ses gelmezse sessiz modu kapat).
      </Text>
      {PHRASE_GROUPS.map((group) => (
        <View key={group.title} style={styles.group}>
          <View style={styles.groupHeader}>
            <SymbolView name={group.icon} size={16} tintColor={RED} />
            <Text style={styles.groupTitle} accessibilityRole="header">
              {group.title}
            </Text>
          </View>
          {group.phrases.map((p) => {
            const isSpeaking = speaking === p.ja;
            return (
              <View key={p.ja} style={styles.phraseCard}>
                <Pressable
                  onPress={() => router.push({ pathname: '/show-driver', params: { text: p.ja, name: p.tr, plain: '1' } })}
                  style={({ pressed }) => [styles.phraseText, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.tr}. Okunuşu: ${p.romaji}`}
                  accessibilityHint="Japoncasını büyük gösterir">
                  <Text style={styles.phraseTr}>{p.tr}</Text>
                  <Text style={styles.phraseJa}>{p.ja}</Text>
                  <Text style={styles.phraseRomaji}>{p.romaji}</Text>
                </Pressable>
                {/* Dinle: dokunma alanı 44 nokta, okunurken dolu kırmızı */}
                <Pressable
                  onPress={() => speak(p.ja)}
                  style={[styles.speak, isSpeaking && styles.speakOn]}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.tr}: Japoncasını dinle`}>
                  <SymbolView
                    name={{ ios: 'speaker.wave.2.fill', android: 'volume_up' }}
                    size={18}
                    tintColor={isSpeaking ? '#FFFFFF' : RED}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function Tips({ tips }: { tips: Tip[] }) {
  return (
    <View style={styles.list}>
      {tips.map((tip) => (
        <View key={tip.title} style={styles.card}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <Text style={styles.tipText}>{tip.text}</Text>
        </View>
      ))}
    </View>
  );
}

function Emergency() {
  return (
    <View style={styles.list}>
      {EMERGENCY.map((e) => (
        <Pressable
          key={e.number}
          // tel: adresi telefonun arama ekranını açar (webdeki <a href="tel:…"> gibi)
          onPress={() => Linking.openURL(`tel:${e.number.replace(/-/g, '')}`)}
          style={({ pressed }) => [styles.card, styles.emergency, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${e.label}: ${e.number}. Ara`}>
          <View style={styles.emergencyIcon}>
            <SymbolView name={e.icon} size={20} tintColor="#FFFFFF" />
          </View>
          <View style={styles.flex}>
            <Text style={styles.tipTitle}>{e.label}</Text>
            <Text style={styles.tipText}>{e.note}</Text>
          </View>
          <Text style={styles.number}>{e.number}</Text>
        </Pressable>
      ))}
      <Text style={styles.intro}>
        Japonca bilmesen de 110 ve 119’da İngilizce yardım istenebilir. Adresini söyleyemiyorsan “Taksiciye göster”
        ekranındaki Japonca adresi oku ya da yakındaki birinden yardım iste.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 12, paddingBottom: 32, gap: 14 },
  title: { fontSize: 40, ...serifText, color: '#1A1A1A', marginTop: 8 },
  chips: { gap: 8 },
  list: { gap: 10 },
  intro: { fontSize: 14, lineHeight: 20, color: '#6B6B6B' },
  card: {
    padding: 14,
    gap: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  pressed: { opacity: 0.6 },
  // İfade grupları: başlık + kartlar; gruplar arası daha geniş boşluk
  group: { gap: 8, marginTop: 8 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupTitle: { fontSize: 13, fontWeight: '700', color: '#6B6B6B', letterSpacing: 1, textTransform: 'uppercase' },
  // İfade kartı: solda metin (dokununca büyük göster), sağda dinle düğmesi
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  phraseText: { flex: 1, gap: 4, paddingVertical: 14 },
  speak: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E3E5',
  },
  speakOn: { backgroundColor: RED },
  phraseTr: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  phraseJa: { fontSize: 22, color: '#1A1A1A' },
  phraseRomaji: { fontSize: 13, color: '#6B6B6B', fontStyle: 'italic' },
  tipTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  tipText: { fontSize: 15, lineHeight: 21, color: '#4A4A4A' },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  flex: { flex: 1 },
  number: { fontSize: 18, fontWeight: '700', color: RED, fontVariant: ['tabular-nums'] },
});
