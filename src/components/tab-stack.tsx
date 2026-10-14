// Her sekmenin kendi Stack'i olur; böylece üstte büyük başlık çubuğu çıkar.
// Dört sekmede aynı ayarları tekrar yazmamak için ortak bileşen.
import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/constants/navigation';

export function TabStack({ title }: { title: string }) {
  return (
    // ...stackScreenOptions: ortak ayarları al, üstüne sekmelere özel olanı ekle
    <Stack screenOptions={{ ...stackScreenOptions, headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  );
}
