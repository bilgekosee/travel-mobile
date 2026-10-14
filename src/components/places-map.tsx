// Haritanın kendisi (iOS: Apple Maps, Android: Google Maps). Pinleri çizer, dokunulanı üst bileşene bildirir.
// Aynı klasördeki places-map.web.tsx tarayıcıda bunun yerine kullanılır: react-native-maps web'de çalışmıyor.
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef } from 'react';
import MapView, { Marker, type Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapZoomButtons } from '@/components/map-zoom-buttons';
import { MAP_KINDS } from '@/constants/map-kinds';
import type { MapItem } from '@/data/map-items';

// Harita hazır olana kadar gösterilecek kaba bölge.
// Region = merkez noktası + ne kadar alan görüneceği (delta, derece cinsinden: büyük = uzak).
const JAPAN_REGION = {
  latitude: 35.0,
  longitude: 136.0,
  latitudeDelta: 5.5,
  longitudeDelta: 7.5,
};

type Props = {
  items: MapItem[];
  focus?: MapItem | null; // Verilirse harita bu noktaya yaklaşır (ör. şehir sayfasındaki "Haritada göster")
  onSelect: (item: MapItem) => void;
  onDeselect: () => void;
};

// Pinler ekranın kenarına, filtre satırının ve sekme çubuğunun altına yapışmasın
const FIT_PADDING = { top: 140, right: 70, bottom: 160, left: 70 };

// + / − düğmelerinin sınırları (derece): en yakın birkaç sokak, en uzak bütün Japonya
const MIN_DELTA = 0.003;
const MAX_DELTA = 20;

// Bir noktaya yakından bakış: ~2 km'lik alan. Merkezi noktanın biraz güneyine kaydırıyoruz ki
// pin ekranın üst yarısında kalsın, alttan açılan kartın arkasına düşmesin.
function regionAround(item: MapItem): Region {
  return {
    latitude: item.coordinates.latitude - 0.006,
    longitude: item.coordinates.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };
}

export function PlacesMap({ items, focus, onSelect, onDeselect }: Props) {
  // ref: haritanın kendi metodlarını çağırmak için (webdeki useRef ile DOM öğesine erişmek gibi)
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  // Haritanın son görüş alanı. State değil ref: ekranda bir şeyi değiştirmiyor, sadece düğmeye basınca okunuyor.
  // (State olsaydı harita her kaydırıldığında bileşen boşuna yeniden çizilirdi.)
  const lastRegion = useRef<Region>(JAPAN_REGION);

  // factor < 1: yaklaş (0.5 = 2 kat yakın), factor > 1: uzaklaş. Merkez aynı kalır.
  function zoomBy(factor: number) {
    const r = lastRegion.current;
    const clamp = (d: number) => Math.min(MAX_DELTA, Math.max(MIN_DELTA, d * factor));
    mapRef.current?.animateToRegion(
      { ...r, latitudeDelta: clamp(r.latitudeDelta), longitudeDelta: clamp(r.longitudeDelta) },
      300,
    );
  }

  // Harita zaten açıkken focus değişirse oraya kayarak git
  useEffect(() => {
    if (focus) mapRef.current?.animateToRegion(regionAround(focus), 600);
  }, [focus]);

  return (
    // Fragment (<>…</>): harita ve üstünde yüzen düğmeler, fazladan bir kutu olmadan yan yana
    <>
      <MapView
        ref={mapRef}
        // Telefon ekranı dar ve uzun; sabit bir bölge her ekranda farklı kırpılıyor.
        // Bunun yerine harita hazır olunca tüm pinleri sığdıracak kadar yakınlaştırıyoruz.
        // Ama bir noktaya odaklanarak açıldıysak (focus), doğrudan oraya gidiyoruz.
        onMapReady={() => {
          if (focus) {
            mapRef.current?.animateToRegion(regionAround(focus), 0);
          } else {
            mapRef.current?.fitToCoordinates(
              items.map((item) => item.coordinates),
              { edgePadding: FIT_PADDING, animated: false },
            );
          }
        }}
        style={StyleSheet.absoluteFill} // Tüm ekranı kapla (CSS'teki position:absolute; inset:0)
        initialRegion={JAPAN_REGION}
        showsPointsOfInterests={false} // Haritanın kendi dükkan/restoran ikonları bizimkilere karışmasın
        toolbarEnabled={false} // Android: pine dokununca çıkan Google Maps düğmelerini gizle
        onPress={onDeselect} // Boş bir yere dokununca alttaki kart kapansın
        onRegionChangeComplete={(region) => (lastRegion.current = region)} // + / − bunu temel alır
      >
        {items.map((item) => {
          const kind = MAP_KINDS[item.kind];
          return (
            <Marker
              key={item.id}
              coordinate={item.coordinates}
              onPress={() => onSelect(item)}
              stopPropagation // iOS: pine dokunmak haritanın onPress'ini tetiklemesin (yoksa kart hemen kapanırdı)
              tracksViewChanges={false} // Pin hiç değişmiyor; haritanın onu sürekli yeniden çizmesine gerek yok
              accessibilityLabel={`${item.name}, ${kind.label}`} // VoiceOver pine dokununca bunu okur
            >
              {/* Marker'ın içine bileşen koyunca harita hazır pin yerine bunu çizer */}
              <View style={[styles.pin, { backgroundColor: kind.color }]}>
                <SymbolView name={kind.icon} size={15} tintColor="#FFFFFF" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Sağda, filtre satırının hemen altında */}
      <MapZoomButtons
        onZoomIn={() => zoomBy(0.5)}
        onZoomOut={() => zoomBy(2)}
        style={{ position: 'absolute', right: 16, top: insets.top + 64 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // Beyaz kenarlıklı yuvarlak rozet: haritanın hem mavi denizinde hem yeşil karasında seçilsin
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
});
