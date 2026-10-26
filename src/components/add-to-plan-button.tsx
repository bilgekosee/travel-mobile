// "Plana ekle" düğmesi. Dokununca alttan "Plana ekle" sayfası açılır (gün + dilim seçilir).
// İki görünümü var:
//   icon   → sadece takvim ikonu: yer kartlarında ve harita kartında
//   button → yazılı büyük düğme: yer sayfasında
// Yer zaten plandaysa ikon tikli takvime döner, düğme "Planda · Düzenle" yazar: kullanıcı bunu ilk bakışta görsün.
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useIsInPlan } from '@/hooks/use-trip';

const RED = '#C8102E';

type Props = {
  id: string; // Haritadaki biçimde: "place-sensoji", "shop-akihabara"
  name: string; // VoiceOver'ın okuyacağı yer adı
  variant?: 'icon' | 'button';
  size?: number;
};

export function AddToPlanButton({ id, name, variant = 'icon', size = 22 }: Props) {
  const inPlan = useIsInPlan(id);
  const open = () => router.push({ pathname: '/add-to-plan', params: { item: id } });
  const icon = inPlan
    ? ({ ios: 'calendar.badge.checkmark', android: 'event_available' } as const)
    : ({ ios: 'calendar.badge.plus', android: 'calendar_add_on' } as const);

  if (variant === 'button') {
    return (
      <Pressable
        onPress={open}
        // Plandaysa açık zeminli (ikincil), değilse kırmızı dolu (ana eylem)
        style={({ pressed }) => [styles.button, inPlan && styles.buttonInPlan, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={inPlan ? `${name} planda. Günleri düzenle` : `${name} plana ekle`}>
        <SymbolView name={icon} size={18} tintColor={inPlan ? RED : '#FFFFFF'} />
        <Text style={[styles.buttonText, inPlan && styles.buttonTextInPlan]}>
          {inPlan ? 'Planda · Düzenle' : 'Plana ekle'}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={open}
      hitSlop={12} // Küçük ikonun dokunma alanını büyüt (en az 44pt)
      accessibilityRole="button"
      accessibilityLabel={inPlan ? `${name}, planda. Günleri düzenle` : `${name}, plana ekle`}>
      <SymbolView name={icon} size={size} tintColor={inPlan ? RED : '#6B6B6B'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: RED,
  },
  buttonInPlan: { backgroundColor: '#F4E3E5' },
  pressed: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  buttonTextInPlan: { color: RED },
});
