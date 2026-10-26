// Durak hatırlatmaları: telefonun kendi kurduğu (yerel) bildirimler. İnternet ve sunucu gerekmez, Expo Go'da çalışır.
// Eşitleme yöntemi: plan her değiştiğinde kurulu bütün bildirimleri iptal edip plandakileri yeniden kuruyoruz.
// Saat, gün, tarih değişince ya da durak silinince tek tek takip etmekten daha basit ve hep doğru.
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

import { placeOf } from '@/data/plan-place';
import { fromDateKey, type TripDay } from '@/hooks/use-trip';

export const REMINDER_OPTIONS = [15, 30, 60]; // Dakika

export function reminderLabel(minutes: number) {
  return minutes >= 60 ? `${minutes / 60} saat` : `${minutes} dk`;
}

const CHANNEL_ID = 'reminders';

// Uygulama açıkken gelen bildirim de üstten görünsün (handler yoksa uygulama açıkken gösterilmiyor)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Kurulması gereken bir hatırlatma: ne zaman, başlık, metin
export type Reminder = { at: number; title: string; body: string };

// Plandan hatırlatma listesi. Saf fonksiyon: native hiçbir şeye dokunmaz, sadece veri üretir.
export function reminderList(days: TripDay[]): Reminder[] {
  return days.flatMap((day) =>
    day.stops.flatMap((stop) => {
      if (!stop.time || !stop.remindBefore || stop.done) return []; // Gidilmiş yere hatırlatma yok
      const place = placeOf(stop);
      if (!place) return [];
      const [h, m] = stop.time.split(':').map(Number);
      const at = fromDateKey(day.date);
      at.setHours(h, m - stop.remindBefore, 0, 0); // setHours dakika eksiye düşerse saati kendisi geri alır
      const note = stop.note?.trim();
      return [
        {
          at: at.getTime(),
          title: `${place.name} · ${stop.time}`,
          body: `${reminderLabel(stop.remindBefore)} sonra${note ? ` · ${note}` : ''}`,
        },
      ];
    }),
  );
}

// İzin var mı? Yoksa iste. Reddedilmişse Ayarlar'a yönlendir. (İlk hatırlatma açılırken çağrılır.)
export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (current.canAskAgain) {
    const asked = await Notifications.requestPermissionsAsync();
    if (asked.granted) return true;
  }
  Alert.alert('Bildirimler kapalı', 'Hatırlatmalar için Ayarlar’dan bu uygulamaya bildirim izni ver.', [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Ayarlar’ı aç', onPress: () => Linking.openSettings() },
  ]);
  return false;
}

// Eşitlemeler sırayla çalışsın: üst üste gelirse biri diğerinin kurduğunu silmesin
let queue = Promise.resolve();

export function syncReminders(reminders: Reminder[]) {
  queue = queue.then(() => apply(reminders)).catch(() => {}); // Bir hata sonrakileri durdurmasın
}

async function apply(reminders: Reminder[]) {
  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;
  // Android 8+: her bildirim bir kanala ait olmalı (kullanıcı Ayarlar'da kanal kanal kapatabiliyor)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Hatırlatmalar',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = Date.now();
  for (const reminder of reminders) {
    if (reminder.at <= now) continue; // Zamanı geçmiş
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.at, channelId: CHANNEL_ID },
    });
  }
}
