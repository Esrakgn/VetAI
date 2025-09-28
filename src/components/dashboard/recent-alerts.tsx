'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock4 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from '../ui/skeleton';

export type Alert = {
  id: string;
  animalId: string;
  description: string;
  timestamp: string | number | Date;
  severity: "low" | "medium" | "high" | "critical" | string; // toleranslı
  isResolved?: boolean;
  alertType?: string;
  message?: string;
  userId?: string;
};

export type RecentAlertsProps = {
  alerts: Alert[];
  isLoading: boolean;
};

const trToEn: Record<string, string> = { 'Düşük': 'low', 'Orta': 'medium', 'Yüksek': 'high', 'Kritik': 'critical' };

const severityMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  'high': 'destructive',
  'medium': 'secondary',
  'low': 'outline',
  'critical': 'destructive',
};


export function RecentAlerts({ alerts, isLoading }: RecentAlertsProps) {
  // Dedupe + stabil key (olası çift kayda karşı)
  const unique = Array.from(new Map(alerts.map(a => [a.id, a])).values());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Son Anormallik Alarmları</CardTitle>
        <CardDescription>Hayvanlarınızdan gelen kritik uyarılar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
        )}

        {!isLoading && unique.length === 0 && (
          <div className="rounded-md border p-4 text-center text-muted-foreground">
            Aktif alarm bulunmamaktadır.
          </div>
        )}

        {!isLoading && unique.length > 0 && (
          <div className="space-y-4">
            {unique.slice(0, 5).map((alert) => {
              const sev = trToEn[alert.severity] ?? alert.severity.toLowerCase();
              const ts = new Date(alert.timestamp);
              return (
                <div key={alert.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{alert.animalId}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-1">
                      <Clock4 className="h-3 w-3 -mt-[2px]" />
                      <span>{formatDistanceToNow(ts, { addSuffix: true, locale: tr })}</span>
                    </div>
                  </div>
                  <Badge variant={severityMap[sev] || "default"} className="whitespace-nowrap">{alert.severity}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
