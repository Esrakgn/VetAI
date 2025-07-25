import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock4, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type Alert = {
  id: number;
  animalId: string;
  description: string;
  timestamp: string;
  severity: 'Yüksek' | 'Orta' | 'Düşük';
};

const severityMap = {
  'Yüksek': 'destructive',
  'Orta': 'secondary',
  'Düşük': 'outline',
} as const;

type RecentAlertsProps = {
  alerts: Alert[];
};

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Son Anormallik Alarmları</CardTitle>
        <CardDescription>Hayvanlarınızdan gelen kritik uyarılar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4">
              <div className="mt-1">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-foreground">{alert.animalId}</p>
                  <Badge variant={severityMap[alert.severity] || 'default'}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center text-xs text-muted-foreground/80 mt-1">
                  <Clock4 className="h-3 w-3 mr-1.5" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Tüm Alarmları Görüntüle
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
