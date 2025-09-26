'use client';

import { useEffect } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  useCollection,
  useFirestore,
  useUser,
  addDocumentNonBlocking,
  useMemoFirebase,
  initiateAnonymousSignIn,
  useAuth,
} from '@/firebase';
import { collection } from 'firebase/firestore';

export default function DashboardPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const alertsQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'alerts') : null),
    [firestore, user],
  );
  const { data: alerts, isLoading } = useCollection(alertsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const addAlert = (location: string, anomaly: string) => {
    if (!user) return;
    const newAlert = {
      animalId: `Konum: ${location}`,
      description: anomaly,
      timestamp: new Date().toISOString(),
      severity: 'Yüksek',
      userId: user.uid,
    };
    const alertsCol = collection(firestore, 'users', user.uid, 'alerts');
    addDocumentNonBlocking(alertsCol, newAlert);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Kontrol Paneli</h1>
        <p className="text-muted-foreground">
          Tekrar hoş geldiniz, işte hayvanlarınızın genel durumu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Toplam Hayvan"
          value="1,250"
          icon={<Users className="h-8 w-8 text-primary" />}
          description="Geçen aydan beri +12"
        />
        <StatCard
          title="Aktif Alarmlar"
          value={alerts?.length?.toString() ?? '0'}
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          description="Dinamik olarak güncellendi"
        />
        <StatCard
          title="Sağlık Durumu"
          value="%99.04"
          icon={<ShieldCheck className="h-8 w-8 text-success" />}
          description="Stabil"
        />
      </div>

      <div>
        <VideoFeeds onAnalyze={addAlert} />
      </div>
    </>
  );
}
