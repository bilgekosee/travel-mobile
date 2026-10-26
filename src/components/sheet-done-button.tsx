// Alttan açılan sayfaların sağ üstündeki "Tamam" düğmesi: sayfayı kapatır.
// iOS 26 başlık çubuğundaki düğmeleri cam bir kabarcığın içine koyuyor; düz kırmızı yazı istediğimiz için
// hidesSharedBackground ile o zemini kapatıyoruz. Bu ayar sadece iOS'un "header items" API'sinde var,
// Android eski usul headerRight'ı kullanmaya devam ediyor.
import { router } from 'expo-router';
import type { NativeStackNavigationOptions } from 'expo-router/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';

function DoneButton() {
  return (
    <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
      <Text style={styles.text}>Tamam</Text>
    </Pressable>
  );
}

// Kök _layout'taki sayfa ayarlarına eklenir: { ...SHEET_OPTIONS, ...SHEET_DONE_OPTIONS }
export const SHEET_DONE_OPTIONS: NativeStackNavigationOptions = {
  headerRight: () => <DoneButton />, // Android
  // iOS: unstable_ = API yeni, ileride adı değişebilir. 'custom' = kendi bileşenimizi çiz
  unstable_headerRightItems: () => [{ type: 'custom', element: <DoneButton />, hidesSharedBackground: true }],
};

const styles = StyleSheet.create({
  text: { fontSize: 17, fontWeight: '600', color: '#C8102E' },
});
