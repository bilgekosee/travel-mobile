// iOS'un kompakt saat seçicisi: küçük "10:30" düğmesi, dokununca çark açılır.
// SwiftUI bileşenleri doğrudan: hazır DateTimePicker sadece yüksekliği içeriğe uyduruyordu; satırda genişliği
// belirsiz kalıp sola taşıyor, yanındaki ikonun üstüne biniyordu.
// ".ios.tsx": Metro bu dosyayı sadece iOS paketine koyar. SwiftUI görünümleri Android'de yok; orada
// compact-time-picker.tsx (boş) kullanılır.
import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle, environment, labelsHidden, tint } from '@expo/ui/swift-ui/modifiers';

type Props = { value: Date; onChange: (date: Date) => void; color: string };

export function CompactTimePicker({ value, onChange, color }: Props) {
  return (
    // matchContents: genişlik de yükseklik de içerik kadar
    <Host matchContents>
      <DatePicker
        selection={value}
        displayedComponents={['hourAndMinute']}
        onDateChange={onChange}
        modifiers={[
          datePickerStyle('compact'),
          labelsHidden(), // SwiftUI'nin boş etiket alanını kaldır
          tint(color),
          environment('locale', 'tr_TR'), // 24 saat biçimi
        ]}
      />
    </Host>
  );
}
