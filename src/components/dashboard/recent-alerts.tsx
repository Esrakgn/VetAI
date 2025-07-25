import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock4, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const alerts = [
  {
    id: 1,
    animalId: 'Cow #842',
    description: 'Prolonged inactivity detected.',
    timestamp: '5 mins ago',
    severity: 'High',
  },
  {
    id: 2,
    animalId: 'Sheep #109',
    description: 'Separated from herd.',
    timestamp: '2 hours ago',
    severity: 'Medium',
  },
  {
    id: 3,
    animalId: 'Cow #331',
    description: 'Limping observed on feed 2.',
    timestamp: '8 hours ago',
    severity: 'High',
  },
  {
    id: 4,
    animalId: 'General',
    description: 'Reduced herd movement in Pasture A.',
    timestamp: '1 day ago',
    severity: 'Low',
  },
];

export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Anomaly Alerts</CardTitle>
        <CardDescription>Critical warnings from your herd.</CardDescription>
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
                  <Badge variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'secondary' : 'outline'}>
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
          View All Alerts
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
