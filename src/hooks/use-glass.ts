// iOS 26'nın "Liquid Glass" efekti bu cihazda kullanılmalı mı?
// Cam yoksa (Android, eski iOS) ya da kullanıcı "Şeffaflığı Azalt"ı açtıysa false döner;
// o zaman bileşenler düz renkli zemine geri döner.
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Cihaz desteği uygulama çalışırken değişmez: bir kez, dosya yüklenirken hesaplıyoruz.
// isGlassEffectAPIAvailable: bazı iOS 26 betalarında API eksik ve uygulamayı çökertebiliyor (Expo belgeleri).
const GLASS_SUPPORTED = isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

export function useGlass() {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  // "Şeffaflığı Azalt" ayarı uygulama açıkken de değişebilir: ilk değeri oku ve değişikliği dinle.
  // React'in dışındaki bir sisteme (iOS ayarlarına) abone oluyoruz: useEffect'in doğru kullanım yeri.
  useEffect(() => {
    if (!GLASS_SUPPORTED) return;
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => subscription.remove(); // Ekran kapanınca dinlemeyi bırak (webdeki removeEventListener gibi)
  }, []);

  return GLASS_SUPPORTED && !reduceTransparency;
}
