// Belgeyi tam ekran gösterir. Belgeler şeridinde bir karta dokununca açılır. Adres: /attachment?file=…&kind=…&title=…
// Fotoğraf: siyah zeminde, iOS'ta iki parmakla yakınlaştırılabilir (küçük QR kodu büyütmek için).
// PDF: iOS'ta uygulamanın içinde (WebView'in tarayıcı motoru PDF'i kendisi çiziyor). Android'in WebView'i PDF
// gösteremiyor: orada telefondaki PDF uygulamasıyla açıyoruz.
// Üst çubuğu kendimiz çiziyoruz: fotoğraf görüntüleyicilerin alışılmış görünümü, kapat solda, paylaş sağda.
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { attachmentFile } from '@/data/attachments';

const RED = '#C8102E';

export default function AttachmentScreen() {
  const { file: fileName, kind, title } = useLocalSearchParams<{ file: string; kind: 'image' | 'pdf'; title: string }>();
  const insets = useSafeAreaInsets();
  const file = attachmentFile(fileName);
  const isImage = kind === 'image';
  const mimeType = isImage ? 'image/*' : 'application/pdf';

  // Telefonun paylaşım menüsü: WhatsApp'a gönder, yazdır, Dosyalar'a kaydet…
  const share = () => Sharing.shareAsync(file.uri, { mimeType, dialogTitle: title });

  // Fotoğrafta koyu zemin, PDF'te açık zemin: içerik hangisinde rahat okunuyorsa
  const tint = isImage ? '#FFFFFF' : '#1A1A1A';

  return (
    <View style={[styles.container, { backgroundColor: isImage ? '#000000' : '#FAF7F2' }]}>
      <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Kapat">
          <SymbolView name={{ ios: 'xmark', android: 'close' }} size={20} weight="semibold" tintColor={tint} />
        </Pressable>
        <Text style={[styles.title, { color: tint }]} numberOfLines={1}>
          {title}
        </Text>
        <Pressable onPress={share} hitSlop={12} accessibilityRole="button" accessibilityLabel="Paylaş">
          <SymbolView name={{ ios: 'square.and.arrow.up', android: 'share' }} size={20} tintColor={tint} />
        </Pressable>
      </View>

      {!file.exists ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: tint }]}>Dosya telefonda bulunamadı.</Text>
        </View>
      ) : isImage ? (
        // maximumZoomScale: iki parmakla 4 kata kadar yakınlaştır (iOS). centerContent: küçükken ortada dursun.
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.flex}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <Image source={{ uri: file.uri }} style={styles.flex} contentFit="contain" />
        </ScrollView>
      ) : Platform.OS === 'ios' ? (
        <WebView
          source={{ uri: file.uri }}
          originWhitelist={['*']} // file:// adresine izin ver
          allowingReadAccessToURL={file.parentDirectory.uri} // iOS: uygulamanın kendi klasöründeki dosyayı okuyabilsin
          style={styles.flex}
        />
      ) : (
        <View style={styles.center}>
          <SymbolView name={{ ios: 'doc.text.fill', android: 'picture_as_pdf' }} size={56} tintColor={RED} />
          <Pressable style={styles.button} onPress={share} accessibilityRole="button">
            <Text style={styles.buttonText}>PDF’i aç</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingBottom: 10 },
  title: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  message: { fontSize: 15, textAlign: 'center' },
  button: {
    minHeight: 48,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
});
