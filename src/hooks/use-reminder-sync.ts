// Plan değişince telefondaki hatırlatmaları güncel tutar. Kök _layout'ta bir kez çağrılır.
// Sadece hatırlatmayı etkileyen bir şey değişince çalışır: not yazarken, "gittim" dışında bir alan değişirken
// boşuna bildirimleri silip yeniden kurmasın.
import { useEffect } from 'react';

import { reminderList, syncReminders } from '@/data/reminders';
import { useTrip } from '@/hooks/use-trip';

export function useReminderSync() {
  const days = useTrip();
  // Listeyi metne çeviriyoruz: içerik aynıysa metin de aynı → effect çalışmaz.
  // (Dizi her seferinde yeni bir nesne; doğrudan bağımlılık yapsak her değişiklikte çalışırdı.)
  const signature = JSON.stringify(reminderList(days));

  useEffect(() => {
    syncReminders(JSON.parse(signature));
  }, [signature]);
}
