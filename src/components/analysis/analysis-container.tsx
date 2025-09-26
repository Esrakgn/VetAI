'use client';

import { useState } from 'react';
import { AnalysisInterface } from '@/components/analysis/analysis-interface';
import dynamic from 'next/dynamic';
import { Hotspot } from '@/components/analysis/live-map';
import { useToast } from '@/components/ui/use-toast';

const LiveMap = dynamic(() => import('@/components/analysis/live-map').then(mod => mod.LiveMap), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted rounded-lg flex items-center justify-center"><p>Harita Yükleniyor...</p></div>,
});

const initialHotspots: Hotspot[] = [
  { id: 1, lat: 39.9334, lng: 32.8597, disease: 'Kuş Gribi', cases: 4, risk: 'Yüksek' },
  { id: 2, lat: 38.4237, lng: 27.1428, disease: 'Şap Hastalığı', cases: 1, risk: 'Düşük' },
  { id: 3, lat: 41.0082, lng: 28.9784, disease: 'Kuduz', cases: 2, risk: 'Orta' },
  { id: 4, lat: 36.8969, lng: 30.7133, disease: 'Mavi Dil', cases: 3, risk: 'Orta' },
];

const provinceCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Adana": { lat: 37.0000, lng: 35.3213 },
  "Adıyaman": { lat: 37.7648, lng: 38.2763 },
  "Afyonkarahisar": { lat: 38.7569, lng: 30.5387 },
  "Ağrı": { lat: 39.7191, lng: 43.0503 },
  "Amasya": { lat: 40.6500, lng: 35.8333 },
  "Ankara": { lat: 39.9334, lng: 32.8597 },
  "Antalya": { lat: 36.8969, lng: 30.7133 },
  "Artvin": { lat: 41.1828, lng: 41.8194 },
  "Aydın": { lat: 37.8380, lng: 27.8456 },
  "Balıkesir": { lat: 39.6534, lng: 27.8903 },
  "Bilecik": { lat: 40.1428, lng: 29.9811 },
  "Bingöl": { lat: 38.8853, lng: 40.4983 },
  "Bitlis": { lat: 38.4000, lng: 42.1000 },
  "Bolu": { lat: 40.7347, lng: 31.6094 },
  "Burdur": { lat: 37.7269, lng: 30.2825 },
  "Bursa": { lat: 40.1826, lng: 29.0669 },
  "Çanakkale": { lat: 40.1553, lng: 26.4142 },
  "Çankırı": { lat: 40.6013, lng: 33.6152 },
  "Çorum": { lat: 40.5499, lng: 34.9546 },
  "Denizli": { lat: 37.7765, lng: 29.0864 },
  "Diyarbakır": { lat: 37.9144, lng: 40.2306 },
  "Edirne": { lat: 41.6771, lng: 26.5557 },
  "Elazığ": { lat: 38.6749, lng: 39.2225 },
  "Erzincan": { lat: 39.7499, lng: 39.4925 },
  "Erzurum": { lat: 39.9095, lng: 41.2755 },
  "Eskişehir": { lat: 39.7667, lng: 30.5206 },
  "Gaziantep": { lat: 37.0662, lng: 37.3833 },
  "Giresun": { lat: 40.9128, lng: 38.3895 },
  "Gümüşhane": { lat: 40.4572, lng: 39.4756 },
  "Hakkâri": { lat: 37.5744, lng: 43.7408 },
  "Hatay": { lat: 36.2023, lng: 36.1603 },
  "Isparta": { lat: 37.7648, lng: 30.5519 },
  "Mersin": { lat: 36.8121, lng: 34.6415 },
  "İstanbul": { lat: 41.0082, lng: 28.9784 },
  "İzmir": { lat: 38.4237, lng: 27.1428 },
  "Kars": { lat: 40.6015, lng: 43.0931 },
  "Kastamonu": { lat: 41.3784, lng: 33.7812 },
  "Kayseri": { lat: 38.7333, lng: 35.4833 },
  "Kırklareli": { lat: 41.7346, lng: 27.2254 },
  "Kırşehir": { lat: 39.1466, lng: 34.1628 },
  "Kocaeli": { lat: 40.7656, lng: 29.9406 },
  "Konya": { lat: 37.8746, lng: 32.4932 },
  "Kütahya": { lat: 39.4190, lng: 29.9856 },
  "Malatya": { lat: 38.3552, lng: 38.3095 },
  "Manisa": { lat: 38.6191, lng: 27.4287 },
  "Kahramanmaraş": { lat: 37.5753, lng: 36.9228 },
  "Mardin": { lat: 37.3122, lng: 40.7342 },
  "Muğla": { lat: 37.2153, lng: 28.3636 },
  "Muş": { lat: 38.7342, lng: 41.4917 },
  "Nevşehir": { lat: 38.6256, lng: 34.7142 },
  "Niğde": { lat: 37.9667, lng: 34.6797 },
  "Ordu": { lat: 40.9862, lng: 37.8797 },
  "Rize": { lat: 41.0201, lng: 40.5235 },
  "Sakarya": { lat: 40.7732, lng: 30.3948 },
  "Samsun": { lat: 41.2798, lng: 36.3361 },
  "Siirt": { lat: 37.9265, lng: 41.9424 },
  "Sinop": { lat: 42.0253, lng: 35.1531 },
  "Sivas": { lat: 39.7477, lng: 37.0179 },
  "Tekirdağ": { lat: 40.9781, lng: 27.5117 },
  "Tokat": { lat: 40.3235, lng: 36.5522 },
  "Trabzon": { lat: 41.0027, lng: 39.7168 },
  "Tunceli": { lat: 39.1062, lng: 39.5483 },
  "Şanlıurfa": { lat: 37.1674, lng: 38.7958 },
  "Uşak": { lat: 38.6824, lng: 29.4019 },
  "Van": { lat: 38.5012, lng: 43.3730 },
  "Yozgat": { lat: 39.8201, lng: 34.8044 },
  "Zonguldak": { lat: 41.4564, lng: 31.7987 },
  "Aksaray": { lat: 38.3686, lng: 34.0370 },
  "Bayburt": { lat: 40.2551, lng: 40.2249 },
  "Karaman": { lat: 37.1810, lng: 33.2222 },
  "Kırıkkale": { lat: 39.8468, lng: 33.5152 },
  "Batman": { lat: 37.8812, lng: 41.1351 },
  "Şırnak": { lat: 37.5165, lng: 42.4592 },
  "Bartın": { lat: 41.6339, lng: 32.3374 },
  "Ardahan": { lat: 41.1105, lng: 42.7022 },
  "Iğdır": { lat: 39.9205, lng: 44.0450 },
  "Yalova": { lat: 40.6554, lng: 29.2766 },
  "Karabük": { lat: 41.1984, lng: 32.6259 },
  "Kilis": { lat: 36.7184, lng: 37.1142 },
  "Osmaniye": { lat: 37.0746, lng: 36.2464 },
  "Düzce": { lat: 40.8438, lng: 31.1565 }
};

export function AnalysisContainer() {
    const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
    const { toast } = useToast();

    const addHotspot = (disease: string, location: string) => {
        const locationCapitalized = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
        const coords = provinceCoordinates[locationCapitalized];

        if (!coords) {
            toast({
                variant: "destructive",
                title: "Konum Bulunamadı",
                description: `"${location}" geçerli bir il olarak bulunamadı. Lütfen il ismini kontrol edin.`,
            });
            return;
        }

        const newHotspot: Hotspot = {
            id: hotspots.length + 1,
            lat: coords.lat,
            lng: coords.lng,
            disease: disease,
            cases: 1,
            risk: 'Yüksek',
        };
        setHotspots(prev => [...prev, newHotspot]);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-2 h-[500px]">
                <LiveMap hotspots={hotspots} />
            </div>
            <div className="space-y-8">
                <AnalysisInterface onReportSubmit={addHotspot} />
            </div>
        </div>
    )
}
