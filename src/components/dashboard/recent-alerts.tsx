import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock4, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const alerts = [
  {
    id: 1,
    animalId: 'İnek #842',
    description: 'Uzun süreli hareketsizlik tespit edildi.',
    timestamp: '5 dakika önce',
    severity: 'Yüksek',
  },
  {
    id: 2,
    animalId: 'Koyun #109',
    description: 'Sürüden ayrıldı.',
    timestamp: '2 saat önce',
    severity: 'Orta',
  },
  {
    id: 3,
    animalId: 'İnek #331',
    description: '2. beslemede topallama gözlendi.',
    timestamp: '8 saat önce',
    severity: 'Yüksek',
  },
  {
    id: 4,
    animalId: 'Genel',
    description: 'A Merasında sürü hareketliliğinde azalma.',
    timestamp: '1 gün önce',
    severity: 'Düşük',
  },
];

const severityMap = {
  'Yüksek': 'destructive',
  'Orta': 'secondary',
  'Düşük': 'outline',
} as const;


export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Son Anormallik Alarmları</CardTitle>
        <CardDescription>Sürünüzden gelen kritik uyarılar.</CardDescription>
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
                  <Badge variant={severityMap[alert.severity as keyof typeof severityMap] || 'default'}>
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
