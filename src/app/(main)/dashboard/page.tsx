'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useUser, initiateAnonymousSignIn, useAuth } from '@/firebase';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentAlerts, type Alert } from '@/components/dashboard/recent-alerts';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { Activity, ShieldAlert, PawPrint, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCollection } from '@/firebase/firestore/use-collection';


export default function DashboardPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const signInTriedRef = useRef(false);

  useEffect(() => {
    if (!isUserLoading && !user && !signInTriedRef.current) {
      signInTriedRef.current = true;
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const alertsQuery = useMemo(
    () =>
      user
        ? query(
            collection(firestore, 'users', user.uid, 'alerts'),
            orderBy('timestamp', 'desc'),
            limit(5)
          )
        : null,
    [firestore, user?.uid]
  );
  
  const { data: alerts, isLoading } = useCollection<Alert>(alertsQuery);

  const handleNewAnomaly = useCallback(async (location: string, anomaly: string) => {
    if (!user?.uid || !firestore) {
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
  }, [user?.uid, firestore, toast]);

  const totalAnimals = 58;
  const activeAlertsCount = alerts?.filter(a => !a.isResolved).length ?? 0;
  const healthyAnimals = totalAnimals - activeAlertsCount;
  
  const PawPrintIcon = useMemo(() => <PawPrint className="text-muted-foreground" />, []);
  const ActivityIcon = useMemo(() => <Activity className="text-muted-foreground" />, []);
  const ShieldAlertIcon = useMemo(() => <ShieldAlert className="text-muted-foreground" />, []);
  const AlertCircleIcon = useMemo(() => <AlertCircle className="text-muted-foreground" />, []);


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
          icon={PawPrintIcon}
          description="Sistemde kayıtlı toplam hayvan sayısı"
        />
        <StatCard
          title="Sağlıklı Hayvanlar"
          value={healthyAnimals.toString()}
          icon={ActivityIcon}
          description={`${((healthyAnimals / totalAnimals) * 100).toFixed(1)}% sağlıklı`}
        />
        <StatCard
          title="Aktif Alarmlar"
          value={activeAlertsCount.toString()}
          icon={ShieldAlertIcon}
          description="Müdahale gerektiren uyarılar"
        />
        <StatCard
          title="Sistem Durumu"
          value="Aktif"
          icon={AlertCircleIcon}
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
