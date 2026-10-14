// Alt sekme çubuğu. NativeTabs = iOS/Android'in kendi (native) sekme çubuğu.
// (tabs) parantezli bir "grup" klasörü: adrese eklenmez, sadece dosyaları gruplar.
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor="#C8102E">
      {/* name = bu klasördeki dosya/klasör adı. sf = iOS sistem ikonu (SF Symbols), md = Android ikonu */}
      <NativeTabs.Trigger name="(explore)">
        <NativeTabs.Trigger.Label>Keşfet</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>Harita</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="plan">
        <NativeTabs.Trigger.Label>Planım</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'heart', selected: 'heart.fill' }} md="favorite" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="guide">
        <NativeTabs.Trigger.Label>Rehber</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'book', selected: 'book.fill' }} md="menu_book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
