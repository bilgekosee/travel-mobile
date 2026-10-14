import { TabStack } from '@/components/tab-stack';

// anchor: Bu Stack'in "çapası" (en alttaki ekranı) index olsun.
// Uygulama bir linkle doğrudan /city/tokyo'da açılsa bile altına Keşfet konur → geri düğmesi çıkar.
export const unstable_settings = {
  anchor: 'index',
};

// Keşfet'in ana ekranı kendi başlığını çiziyor (index.tsx'te headerShown: false).
// Buradaki başlık, şehir sayfasındaki geri düğmesinde görünür.
export default function ExploreLayout() {
  return <TabStack title="Keşfet" />;
}
