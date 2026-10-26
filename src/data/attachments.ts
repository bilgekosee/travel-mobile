// Biletler ve belgeler: fotoğraf (ekran görüntüsü, QR kod) ya da PDF. Duraklara, kalınan yere, uçuşlara eklenir.
// Seçilen dosya uygulamanın kendi kalıcı klasörüne kopyalanır: seçicinin verdiği kopya önbellekte duruyor,
// iOS onu istediği zaman silebilir. İnternet olmadan da açılır.
// Veride dosyanın tam yolu değil sadece adı saklanır: iOS uygulama güncellenince uygulamanın klasör yolunu
// değiştirebiliyor, tam yol eskirdi. Yol her açılışta Paths.document'tan yeniden kurulur.
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export type Attachment = {
  id: string;
  fileName: string; // attachments klasöründeki adı (benzersiz)
  title: string; // Kullanıcının gördüğü ad: "bilet.pdf", "Fotoğraf"
  kind: 'image' | 'pdf';
};

function folder() {
  const dir = new Directory(Paths.document, 'attachments');
  dir.create({ idempotent: true, intermediates: true }); // Yoksa oluştur, varsa dokunma
  return dir;
}

// Dosya adından telefondaki dosya (yol her seferinde güncel klasörden kurulur)
export function attachmentFile(fileName: string) {
  return new File(folder(), fileName);
}

// Seçicinin verdiği dosyayı kalıcı klasöre kopyala. Ad benzersiz: iki ayrı "bilet.pdf" birbirinin üstüne yazılmasın.
async function keep(uri: string, title: string, kind: Attachment['kind']): Promise<Attachment> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const extension = kind === 'pdf' ? 'pdf' : (uri.split('.').pop()?.toLowerCase() ?? 'jpg');
  const fileName = `${id}.${extension}`;
  await new File(uri).copy(new File(folder(), fileName));
  return { id, fileName, title, kind };
}

// Galeriden fotoğraf (birden çok seçilebilir). İptal edilirse boş dizi.
export async function pickImages(): Promise<Attachment[]> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsMultipleSelection: true });
  if (result.canceled) return [];
  return Promise.all(result.assets.map((a) => keep(a.uri, a.fileName ?? 'Fotoğraf', 'image')));
}

// Dosyalar'dan PDF (birden çok seçilebilir)
export async function pickPdfs(): Promise<Attachment[]> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true });
  if (result.canceled) return [];
  return Promise.all(result.assets.map((a) => keep(a.uri, a.name, 'pdf')));
}

// Belge plandan çıkarılınca dosyası da silinsin, telefonda yer kaplamasın
export function deleteAttachmentFiles(attachments: Attachment[] | undefined) {
  for (const attachment of attachments ?? []) {
    const file = attachmentFile(attachment.fileName);
    if (file.exists) file.delete();
  }
}
