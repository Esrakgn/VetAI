'use client';

import Map, { Marker, Popup, GeolocateControl } from 'react-map-gl/maplibre';
import { useState } from 'react';
import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Hotspot = {
  id: number;
  lat: number;
  lng: number;
  disease: string;
  cases: number;
  risk: 'Yüksek' | 'Orta' | 'Düşük';
};

const hotspots: Hotspot[] = [
  { id: 1, lat: 39.9334, lng: 32.8597, disease: 'Kuş Gribi', cases: 4, risk: 'Yüksek' },
  { id: 2, lat: 38.4237, lng: 27.1428, disease: 'Şap Hastalığı', cases: 1, risk: 'Düşük' },
  { id: 3, lat: 41.0082, lng: 28.9784, disease: 'Kuduz', cases: 2, risk: 'Orta' },
  { id: 4, lat: 36.8969, lng: 30.7133, disease: 'Mavi Dil', cases: 3, risk: 'Orta' },
];

export function LiveMap() {
    const [popupInfo, setPopupInfo] = useState<Hotspot | null>(null);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
        <Map
        initialViewState={{
          longitude: 35.2433,
          latitude: 39.0000,
          zoom: 5,
        }}
        style={{width: '100%', height: '100%'}}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=rTRWOseduldWVihjLMs3"
        >
        
        <GeolocateControl position="top-left" />

        {hotspots.map(hotspot => (
            <Marker
                key={`marker-${hotspot.id}`}
                longitude={hotspot.lng}
                latitude={hotspot.lat}
                anchor="bottom"
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo(hotspot);
                }}
            >
                <Pin className="w-8 h-8 text-primary fill-primary" />
            </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.lng)}
            latitude={Number(popupInfo.lat)}
            onClose={() => setPopupInfo(null)}
            className="[&_.maplibregl-popup-content]:bg-card [&_.maplibregl-popup-content]:text-card-foreground [&_.maplibregl-popup-close-button]:text-card-foreground"
          >
            <div className="space-y-1 text-sm p-1">
              <h3 className="font-bold text-base">{popupInfo.disease}</h3>
              <p>Risk: <span className="font-semibold">{popupInfo.risk}</span></p>
              <p>Vaka: <span className="font-semibold">{popupInfo.cases}</span></p>
              <Button size="sm" className="mt-2 w-full">Detayları Gör</Button>
            </div>
          </Popup>
        )}
        </Map>
    </div>
  );
};

export default LiveMap;
