'use client';

import { AnalysisInterface } from '@/components/analysis/analysis-interface';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/analysis/live-map').then(mod => mod.LiveMap), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted rounded-lg flex items-center justify-center"><p>Harita Yükleniyor...</p></div>,
});


export function AnalysisContainer() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-2 h-[500px]">
                <LiveMap />
            </div>
            <div className="space-y-8">
                <AnalysisInterface />
            </div>
        </div>
    )
}