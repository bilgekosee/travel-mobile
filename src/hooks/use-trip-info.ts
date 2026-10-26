// Gezinin bütününe ait bilgiler (günlere değil): gidiş ve dönüş uçuşu. Telefona kaydedilir.
// use-trip ile aynı desen: React'in dışında duran küçük bir store + useSyncExternalStore.
import 'expo-sqlite/localStorage/install';

import { useSyncExternalStore } from 'react';

import { type Attachment, deleteAttachmentFiles } from '@/data/attachments';

// Hepsi serbest metin: "TK 52", "13:45", "İstanbul (IST)". Saat dilimi farkları, aktarmalar… kullanıcı nasıl isterse.
export type Flight = {
  number?: string;
  time?: string;
  from?: string;
  to?: string;
  note?: string;
  files?: Attachment[]; // Biniş kartı, e-bilet
};
export type FlightLeg = 'outbound' | 'return'; // Gidiş / dönüş

export type TripInfo = { flights: Record<FlightLeg, Flight> };

const STORAGE_KEY = 'trip-info';
const EMPTY: TripInfo = { flights: { outbound: {}, return: {} } };

function load(): TripInfo {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // { ...EMPTY, ...kayıt }: sonradan eklenen alanlar eski kayıtta yoksa varsayılanı gelsin
    return saved ? { ...EMPTY, ...JSON.parse(saved) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

let info: TripInfo = load();
const listeners = new Set<() => void>();

function update(next: TripInfo) {
  info = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  listeners.forEach((listener) => listener());
}

function mapFlight(leg: FlightLeg, change: (flight: Flight) => Flight) {
  update({ ...info, flights: { ...info.flights, [leg]: change(info.flights[leg]) } });
}

// --- İşlemler ---
// Sadece verilen alanlar değişir. Boş metin = alanı sil.
export function updateFlight(leg: FlightLeg, changes: Partial<Omit<Flight, 'files'>>) {
  const cleaned = Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v?.trim() || undefined]));
  mapFlight(leg, (flight) => ({ ...flight, ...cleaned }));
}

export function addFlightFiles(leg: FlightLeg, files: Attachment[]) {
  mapFlight(leg, (flight) => ({ ...flight, files: [...(flight.files ?? []), ...files] }));
}

export function removeFlightFile(leg: FlightLeg, file: Attachment) {
  deleteAttachmentFiles([file]);
  mapFlight(leg, (flight) => ({ ...flight, files: flight.files?.filter((f) => f.id !== file.id) }));
}

// --- Hook ---
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTripInfo() {
  return useSyncExternalStore(subscribe, () => info);
}

// "TK 52 · 13:45 · İstanbul → Haneda": dolu alanlardan kısa özet (Planım'daki satır için). Hiçbiri yoksa boş.
export function flightSummary(flight: Flight) {
  const route = flight.from || flight.to ? `${flight.from ?? '?'} → ${flight.to ?? '?'}` : '';
  return [flight.number, flight.time, route].filter(Boolean).join(' · ');
}
