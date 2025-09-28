'use client';

import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useCollection } from '@/firebase';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { Activity, ShieldAlert, PawPrint, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Alert } from '@/components/dashboard/recent-alerts';

export default function DashboardPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [localAlerts, setLocalAlerts] = useState<Alert[]>([]);

  const alertsQuery = user ? collection(firestore, 'users', user.uid, 'alerts') : null;
  const { data: remoteAlerts, isLoading } = useCollection<Alert>(alertsQuery);

  const handleNewAnomaly = useCallback(async (location: string, anomaly: string) => {
    const newAlert: Omit<Alert, 'id' | 'timestamp'> & { timestamp: any } = {
      animalId: location,
      description: anomaly,
      severity: 'high',
      timestamp: serverTimestamp(),
      isResolved: false,
      alertType: 'Behavioral Anomaly',
      message: `Abnormal behavior detected: ${anomaly}`,
      userId: user?.uid ?? 'unknown',
    };

    try {
      if (user && firestore) {
        // Add to Firestore
        await addDoc(collection(firestore, 'users', user.uid, 'alerts'), newAlert);
      } else {
        // Fallback to local state if user/firestore is not available
        const localNewAlert: Alert = {
          ...newAlert,
          id: `local-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        setLocalAlerts(prev => [localNewAlert, ...prev]);
        console.warn("User or Firestore not available, alert saved to local state.");
      }
      
      toast({
        variant: 'destructive',
        title: 'Alarm: Anormallik Tespit Edildi',
        description: `${location}: ${anomaly}`,
      });

    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Alarm oluşturulurken bir hata oluştu.',
      });
    }
  }, [user, firestore, toast]);

  const allAlerts = [...localAlerts, ...(remoteAlerts || [])]
    .sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());

  const uniqueAlerts = Array.from(new Map(allAlerts.map(a => [a.id, a])).values());

  const totalAnimals = 58;
  const healthyAnimals = totalAnimals - uniqueAlerts.length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Kontrol Paneli</h1>
        <p className="text-muted-foreground">Sisteminizin genel durumuna ve son olaylara göz atın.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Hayvan"
          value={totalAnimals.toString()}
          icon={<PawPrint className="text-muted-foreground" />}
          description="Sistemde kayıtlı toplam hayvan sayısı"
        />
        <StatCard
          title="Sağlıklı Hayvanlar"
          value={healthyAnimals.toString()}
          icon={<Activity className="text-muted-foreground" />}
          description={`${((healthyAnimals / totalAnimals) * 100).toFixed(1)}% sağlıklı`}
        />
        <StatCard
          title="Aktif Alarmlar"
          value={uniqueAlerts.length.toString()}
          icon={<ShieldAlert className="text-muted-foreground" />}
          description="Müdahale gerektiren uyarılar"
        />
        <StatCard
          title="Sistem Durumu"
          value="Aktif"
          icon={<AlertCircle className="text-muted-foreground" />}
          description="Tüm sistemler normal çalışıyor"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <VideoFeeds onAnalyze={handleNewAnomaly} />
        </div>
        <div className="lg:col-span-1">
          <RecentAlerts alerts={uniqueAlerts} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
