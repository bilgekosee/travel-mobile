// Belgeler şeridi: yatay kaydırılan küçük kartlar + sonda "+ Fotoğraf" ve "+ PDF".
// Karta dokun → tam ekran açılır. Basılı tut → silmek için sorar (Planım'daki duraklarla aynı dil).
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { type Attachment, attachmentFile, pickImages, pickPdfs } from '@/data/attachments';

const RED = '#C8102E';
const TILE = 84;

type Props = {
  files?: Attachment[];
  onAdd: (files: Attachment[]) => void;
  onRemove: (file: Attachment) => void;
  photosOnly?: boolean; // Anı fotoğrafları: "+ PDF" düğmesi gösterilmez
};

export function AttachmentList({ files = [], onAdd, onRemove, photosOnly }: Props) {
  async function add(pick: () => Promise<Attachment[]>) {
    try {
      const picked = await pick();
      if (picked.length > 0) {
        onAdd(picked);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      Alert.alert('Eklenemedi', 'Dosya kopyalanırken bir sorun oldu. Tekrar dener misin?');
    }
  }

  function open(file: Attachment) {
    router.push({ pathname: '/attachment', params: { file: file.fileName, kind: file.kind, title: file.title } });
  }

  function confirmRemove(file: Attachment) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(file.title, 'Bu belge silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => onRemove(file) },
    ]);
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {files.map((file) => (
        <Pressable
          key={file.id}
          onPress={() => open(file)}
          onLongPress={() => confirmRemove(file)}
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${file.kind === 'pdf' ? 'PDF' : 'Fotoğraf'}: ${file.title}`}
          accessibilityHint="Açmak için dokun"
          accessibilityActions={[{ name: 'remove', label: 'Sil' }]}
          onAccessibilityAction={(e) => e.nativeEvent.actionName === 'remove' && onRemove(file)}>
          {file.kind === 'image' ? (
            <Image source={{ uri: attachmentFile(file.fileName).uri }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={styles.pdf}>
              <SymbolView name={{ ios: 'doc.text.fill', android: 'picture_as_pdf' }} size={26} tintColor={RED} />
              <Text style={styles.pdfName} numberOfLines={2}>
                {file.title}
              </Text>
            </View>
          )}
        </Pressable>
      ))}

      <Pressable onPress={() => add(pickImages)} style={[styles.tile, styles.add]} accessibilityRole="button">
        <SymbolView name={{ ios: 'photo.badge.plus', android: 'add_photo_alternate' }} size={24} tintColor={RED} />
        <Text style={styles.addText}>Fotoğraf</Text>
      </Pressable>
      {!photosOnly && (
        <Pressable onPress={() => add(pickPdfs)} style={[styles.tile, styles.add]} accessibilityRole="button">
          <SymbolView name={{ ios: 'doc.badge.plus', android: 'note_add' }} size={24} tintColor={RED} />
          <Text style={styles.addText}>PDF</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  tile: { width: TILE, height: TILE, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFE9E1' },
  pressed: { opacity: 0.6 },
  thumb: { width: '100%', height: '100%' },
  pdf: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6 },
  pdfName: { fontSize: 11, color: '#4A4A4A', textAlign: 'center' },
  // Ekleme kartları: kesik kenarlı, "buraya bir şey konabilir" hissi
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9C2B8',
  },
  addText: { fontSize: 13, fontWeight: '600', color: RED },
});
