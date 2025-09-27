'use client';

import { useState } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { Heart, AlertTriangle, ShieldCheck } from 'lucide-react';
import { addDocumentNonBlocking, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useUser } from '@/firebase/provider';
import { collection } from 'firebase/firestore';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const alertsQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'alerts') : null),
    [firestore, user]
  );
  const { data: alerts, isLoading } = useCollection(alertsQuery);

  const handleCreateAlert = (location: string, anomaly: string) => {
    if (!user) return;
    const alertsCollection = collection(firestore, 'users', user.uid, 'alerts');
    addDocumentNonBlocking(alertsCollection, {
      animalId: location,
      timestamp: new Date().toISOString(),
      alertType: 'Behavioral Anomaly',
      message: `Anormal davranış tespit edildi: ${anomaly}`,
      description: `Konumda (${location}) bir hayvanda "${anomaly}" davranışı tespit edildi.`,
      isResolved: false,
      userId: user.uid,
      severity: 'Yüksek',
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Toplam Hayvan Sayısı"
          value="150"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
          description="+20.1% geçen aydan"
        />
        <StatCard
          title="Aktif Alarmlar"
          value={alerts?.filter(a => !a.isResolved).length.toString() ?? '0'}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          description="Şu anda dikkat gerektiren 2 alarm"
        />
        <StatCard
          title="Genel Sağlık Skoru"
          value="92%"
          icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
          description="Tüm hayvanlar için ortalama"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <VideoFeeds onAnalyze={handleCreateAlert} />
        </div>
        <div>
          <RecentAlerts alerts={alerts ?? []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
