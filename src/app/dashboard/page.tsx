
'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { RecentAlerts, type Alert } from '@/components/dashboard/recent-alerts';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';

const initialAlerts: Alert[] = [
  {
    id: 1,
    animalId: 'Hayvan #842',
    description: 'Uzun süreli hareketsizlik tespit edildi.',
    timestamp: '5 dakika önce',
    severity: 'Yüksek',
  },
  {
    id: 2,
    animalId: 'Hayvan #109',
    description: 'Grupdan ayrıldı.',
    timestamp: '2 saat önce',
    severity: 'Orta',
  },
  {
    id: 3,
    animalId: 'Hayvan #331',
    description: 'Beslenme zamanı topallama gözlendi.',
    timestamp: '8 saat önce',
    severity: 'Yüksek',
  },
  {
    id: 4,
    animalId: 'Genel',
    description: 'A Bölgesinde grup hareketliliğinde azalma.',
    timestamp: '1 gün önce',
    severity: 'Düşük',
  },
];


export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const addAlert = (location: string, anomaly: string) => {
    const newAlert: Alert = {
      id: alerts.length + 1,
      animalId: `Konum: ${location}`,
      description: anomaly,
      timestamp: 'Şimdi',
      severity: 'Yüksek'
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  };
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Kontrol Paneli</h1>
        <p className="text-muted-foreground">Tekrar hoş geldiniz, işte hayvanlarınızın genel durumu.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Toplam Hayvan" value="1,250" icon={<Users className="h-8 w-8 text-primary" />} description="Geçen aydan beri +12" />
        <StatCard title="Aktif Alarmlar" value={alerts.length.toString()} icon={<AlertTriangle className="h-8 w-8 text-destructive" />} description="Dinamik olarak güncellendi" />
        <StatCard title="Sağlık Durumu" value="%99.04" icon={<ShieldCheck className="h-8 w-8 text-success" />} description="Stabil" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <VideoFeeds onAnalyze={addAlert} />
        </div>
        <div className="space-y-8">
          <RecentAlerts alerts={alerts} />
        </div>
      </div>
    </>
  );
}
