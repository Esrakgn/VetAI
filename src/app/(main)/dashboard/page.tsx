
'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase, initiateAnonymousSignIn, useAuth } from '@/firebase';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentAlerts, type Alert } from '@/components/dashboard/recent-alerts';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { Activity, ShieldAlert, PawPrint, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';


export default function DashboardPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const alertsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, 'users', user.uid, 'alerts'),
            orderBy('timestamp', 'desc'),
            limit(5)
          )
        : null,
    [firestore, user]
  );
  
  const { data: alerts, isLoading } = useCollection<Alert>(alertsQuery);

  const handleNewAnomaly = useCallback(async (location: string, anomaly: string) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcı oturumu aktif değil. Alarm oluşturulamadı.',
      });
      return;
    }

    const newAlert: Omit<Alert, 'id' | 'timestamp'> & { timestamp: any } = {
      animalId: location,
      description: anomaly,
      severity: 'high',
      timestamp: serverTimestamp(),
      isResolved: false,
      alertType: 'Behavioral Anomaly',
      message: `Abnormal behavior detected: ${anomaly}`,
      userId: user.uid,
    };

    try {
      await addDoc(collection(firestore, 'users', user.uid, 'alerts'), newAlert);
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

  const totalAnimals = 58;
  const activeAlertsCount = alerts?.filter(a => !a.isResolved).length ?? 0;
  const healthyAnimals = totalAnimals - activeAlertsCount;

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
          value={activeAlertsCount.toString()}
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
          <RecentAlerts alerts={alerts ?? []} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
