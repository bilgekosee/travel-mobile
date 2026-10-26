// Yazdıkça kendiliğinden kaydeden yazı kutusu (durak notu, kendi yerinin adı ve adresi).
// Yazı kutunun kendi state'inde: her harf hemen görünür.
// Kayıt "debounce" ile: her harfte kaydetmek bütün planı veritabanına yazıp planı gösteren her ekranı yeniden
// çizdiriyordu, yazı takılıyordu. Yazmaya yarım saniye ara verince, kutudan çıkınca ya da sayfa kapanınca kaydediyoruz.
import { useEffect, useRef, useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  initial: string;
  onSave: (value: string) => void;
};

export function AutoSaveInput({ initial, onSave, onBlur, ...rest }: Props) {
  const [text, setText] = useState(initial);
  // Ref: değişince ekranın yeniden çizilmesi gerekmeyen değerler (bekleyen zamanlayıcı, kaydedilecek son metin)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(initial);
  const save = useRef(onSave);
  // En güncel onSave'i tut (kapanırken eskisi çağrılmasın). Render sırasında ref'e yazılmaz: effect'te güncelliyoruz.
  useEffect(() => {
    save.current = onSave;
  });

  // Bekleyen bir kayıt varsa hemen yap
  function flush() {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    save.current(latest.current);
  }

  // Sayfa kapanınca (bileşen ekrandan kalkınca) son yazılanı kaybetme
  useEffect(() => flush, []); // [] → sadece ekrandan kalkarken çalışır

  return (
    <TextInput
      {...rest} // Geri kalan bütün ayarlar (placeholder, multiline, style…) olduğu gibi TextInput'a
      value={text}
      onChangeText={(value) => {
        setText(value);
        latest.current = value;
        if (timer.current) clearTimeout(timer.current); // Her harfte sayacı baştan başlat…
        timer.current = setTimeout(flush, 500); // …500 ms yeni harf gelmezse kaydet
      }}
      onBlur={(e) => {
        flush(); // Kutudan çıkınca beklemeden kaydet
        onBlur?.(e);
      }}
    />
  );
}
