
'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnalysisInterface } from '@/components/analysis/analysis-interface';
import { type LatLngExpression } from 'leaflet';

// Mock data for hotspots
const hotspots: { id: number; position: LatLngExpression; disease: string; color: string; }[] = [
  { id: 1, position: [39.9334, 32.8597], disease: 'Kuş Gribi', color: 'red' }, // Ankara
  { id: 2, position: [41.0082, 28.9784], disease: 'Şap Hastalığı', color: 'blue' }, // Istanbul
  { id: 3, position: [38.4237, 27.1428], disease: 'Düşük Hareketlilik', color: 'yellow' }, // Izmir
  { id: 4, position: [36.8969, 30.7133], disease: 'Kuş Gribi', color: 'red' }, // Antalya
  { id: 5, position: [40.1826, 29.0669], disease: 'Şap Hastalığı', color: 'blue' }, // Bursa
];


// Dynamically import the map component to ensure it's client-side only
const LiveMap = dynamic(() => import('@/components/analysis/live-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted flex items-center justify-center"><p>Harita yükleniyor...</p></div>,
});


export default function AnalysisPage() {

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Bölgesel Analiz</h1>
        <p className="text-muted-foreground">
          Harita üzerinde hastalık yayılımını ve düşük hareketlilik bölgelerini görüntüleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Canlı Hastalık Haritası</CardTitle>
                    <CardDescription>Bölgenizdeki salgınları ve riskleri takip edin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-muted">
                        <LiveMap hotspots={hotspots} />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <AnalysisInterface />
        </div>
      </div>
    </>
  );
}
