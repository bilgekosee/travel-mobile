// Fotoğrafın köşesindeki "📷 Fotoğrafçı · Lisans" etiketi.
// CC lisansları fotoğrafçıyı belirtmeyi şart koşar. Dokununca kaynak sayfa uygulama içi tarayıcıda açılır.
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Photo } from '@/data/places';

export function PhotoCredit({ photo }: { photo: Photo }) {
  return (
    <Pressable
      style={styles.credit}
      onPress={() => WebBrowser.openBrowserAsync(photo.sourceUrl)}
      accessibilityRole="link"
      accessibilityLabel={`Fotoğraf: ${photo.author}, lisans ${photo.license}. Kaynağı aç.`}>
      <Text style={styles.text} numberOfLines={1}>
        📷 {photo.author} · {photo.license}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  credit: {
    margin: 8,
    maxWidth: '80%', // Uzun fotoğrafçı adları fotoğrafın tamamını kaplamasın
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: { color: '#FFFFFF', fontSize: 11 },
});
