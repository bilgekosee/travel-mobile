// Aramayı esnek yapmak için: küçük harfe çevir ve aksanları at ("Sensō-ji" → "senso-ji", "İ" → "i").
// Keşfet'teki arama ve "Durak ekle" sayfası birlikte kullanır.
export function normalize(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
