// iOS dışı: kompakt saat seçici yok (SwiftUI sadece iOS'ta). Android saat penceresini stop-when-card kendisi açıyor.
// iOS'ta Metro bunun yerine compact-time-picker.ios.tsx'i kullanır.
type Props = { value: Date; onChange: (date: Date) => void; color: string };

export function CompactTimePicker(_: Props) {
  return null;
}
