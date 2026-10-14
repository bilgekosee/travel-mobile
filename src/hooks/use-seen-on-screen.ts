// "Bu öğe ekrana girdi mi?" Webdeki IntersectionObserver'ın basit bir karşılığı.
// Sayfa kaydırıldıkça öğenin ekrandaki yerini ölçer; ekranın görünen kısmına girince `seen` true olur ve öyle kalır.
// Her şey UI thread'de çalışır: kaydırma sırasında JavaScript devreye girmez, sayfa takılmaz.
import { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  type AnimatedRef,
  measure,
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';

const BOTTOM_MARGIN = 100; // Sekme çubuğunun arkası "görünür" sayılmasın

// Sayfanın ne kadar kaydırıldığı. Öğenin içinde olduğu ScrollView bunu sağlar (bkz. şehir sayfası).
// Context: değeri aradaki bileşenlere props olarak geçirmeden derindeki bileşene ulaştırır (webdeki React ile aynı).
export const ScrollOffsetContext = createContext<SharedValue<number> | null>(null);

export function useSeenOnScreen(ref: AnimatedRef<Animated.View>) {
  const scrollOffset = useContext(ScrollOffsetContext);
  const { height: screenHeight } = useWindowDimensions();
  const seen = useSharedValue(false);
  // Öğe ilk çizildiğinde de bir kez kontrol edilsin: kaydırmadan zaten ekrandaysa da görülmüş sayılsın
  const layoutCount = useSharedValue(0);

  // Sayfa her kaydırıldığında ve öğe her çizildiğinde çalışır
  useAnimatedReaction(
    () => [scrollOffset?.value ?? 0, layoutCount.value],
    () => {
      if (seen.value || !scrollOffset) return;
      const box = measure(ref); // Öğenin ekrandaki konumu; henüz çizilmediyse null
      if (!box || box.height === 0) return;
      if (box.pageY > 0 && box.pageY + box.height < screenHeight - BOTTOM_MARGIN) {
        seen.value = true;
      }
    },
  );

  return {
    seen,
    // Kaydıran bir sayfa yoksa (Context boş) öğe hiç "görülmez"; bileşen buna göre hareketsiz bir hal seçmeli
    hasScroll: scrollOffset !== null,
    // Öğenin onLayout'una verilir
    onLayout: () => layoutCount.set((c) => c + 1),
  };
}
