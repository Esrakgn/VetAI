'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { AlertsTable } from '@/components/history/alerts-table';

export default function HistoryPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const alertsQuery = useMemoFirebase(() => 
    user ? collection(firestore, 'users', user.uid, 'alerts') : null
  , [firestore, user]);

  const { data: alerts, isLoading } = useCollection(alertsQuery);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Geçmiş Kayıtlar</h1>
        <p className="text-muted-foreground">Sistem tarafından oluşturulan tüm alarm ve olayların tam listesi.</p>
      </div>
      <AlertsTable alerts={alerts ?? []} isLoading={isLoading} />
    </>
  );
}
