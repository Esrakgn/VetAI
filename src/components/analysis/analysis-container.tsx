'use client';

import { useState } from 'react';
import { AnalysisInterface } from '@/components/analysis/analysis-interface';
import dynamic from 'next/dynamic';
import { Hotspot } from '@/components/analysis/live-map';

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


export function AnalysisContainer() {
    const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);

    const addHotspot = (disease: string, location: string) => {
        // NOTE: This is a simplified geocoding simulation.
        // In a real app, you would use a geocoding service to get lat/lng from location.
        // For now, we'll place it at a random-ish location for demonstration.
        const newHotspot: Hotspot = {
            id: hotspots.length + 1,
            // Simple hash function to get somewhat consistent coords for a location string
            lat: 39 + (location.charCodeAt(0) % 5) - 2.5,
            lng: 35 + (location.charCodeAt(1) % 10) - 5,
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
