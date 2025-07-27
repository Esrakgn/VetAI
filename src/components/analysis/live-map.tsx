'use client';

import Map, { Marker, Popup, GeolocateControl } from 'react-map-gl/maplibre';
import { useState } from 'react';
import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Hotspot = {
  id: number;
  lat: number;
  lng: number;
  disease: string;
  cases: number;
  risk: 'Yüksek' | 'Orta' | 'Düşük';
};

type LiveMapProps = {
  hotspots: Hotspot[];
}

export function LiveMap({ hotspots }: LiveMapProps) {
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
                <Pin className="w-8 h-8 text-destructive fill-destructive" />
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
