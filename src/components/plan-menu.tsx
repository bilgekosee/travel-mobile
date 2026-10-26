// Planım'ın sağ üstündeki ⋯ menüsü: metin olarak paylaş, yedek al, yedekten geri yükle.
// Menünün başlığı son yedeğin tarihini hatırlatır. Menü telefonun kendi menüsü (iOS'ta SwiftUI, Android'de Material).
// İşin kendisi data/backup.ts'te; burada sadece akış: onay sor, hata göster, titreşim.
import { MenuView } from '@expo/ui/community/menu';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Alert, Share, StyleSheet, View } from 'react-native';

import { exportBackup, pickBackup, restoreBackup } from '@/data/backup';
import { useTripInfo } from '@/hooks/use-trip-info';

const RED = '#C8102E';

// Yedek dosyasını seç → özetini göster → onaylanırsa geri yükle. Boş plan ekranı da kullanır.
export async function restoreFromBackup() {
  try {
    const preview = await pickBackup();
    if (!preview) return; // Vazgeçti
    const date = new Date(preview.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    Alert.alert(
      'Yedek geri yüklensin mi?',
      `${date} tarihli yedek: ${preview.days} gün, ${preview.stops} yer, ${preview.files} belge.\nŞu anki planının yerine geçecek.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Geri yükle',
          style: 'destructive',
          onPress: () => {
            restoreBackup(preview.backup);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  } catch (error) {
    Alert.alert('Geri yüklenemedi', error instanceof Error ? error.message : 'Bir sorun oldu.');
  }
}

async function backup() {
  try {
    await exportBackup();
  } catch {
    Alert.alert('Yedek alınamadı', 'Dosya hazırlanırken bir sorun oldu. Telefonda yer olduğundan emin olup tekrar dener misin?');
  }
}

export function PlanMenu({ shareText }: { shareText: () => string }) {
  const { lastBackupAt } = useTripInfo();
  const title = lastBackupAt
    ? `Son yedek: ${new Date(lastBackupAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`
    : 'Henüz yedek alınmadı';

  return (
    <MenuView
      title={title}
      actions={[
        { id: 'share', title: 'Metin olarak paylaş', image: 'square.and.arrow.up' },
        { id: 'backup', title: 'Yedek al', image: 'externaldrive.badge.plus' },
        { id: 'restore', title: 'Yedekten geri yükle', image: 'arrow.counterclockwise' },
      ]}
      onPressAction={({ nativeEvent }) => {
        if (nativeEvent.event === 'share') Share.share({ message: shareText() }); // Telefonun paylaşım menüsü
        if (nativeEvent.event === 'backup') backup();
        if (nativeEvent.event === 'restore') restoreFromBackup();
      }}>
      {/* Menüyü açan düğme: dokunma alanı 44 nokta */}
      <View style={styles.button} accessibilityRole="button" accessibilityLabel="Plan seçenekleri">
        <SymbolView name={{ ios: 'ellipsis.circle', android: 'more_horiz' }} size={26} tintColor={RED} />
      </View>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});
