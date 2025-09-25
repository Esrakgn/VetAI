'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import type { Alert } from '@/components/dashboard/recent-alerts';

type AlertsTableProps = {
  alerts: Alert[];
  isLoading: boolean;
};

const severityMap = {
  'Yüksek': 'destructive',
  'Orta': 'secondary',
  'Düşük': 'outline',
} as const;

export function AlertsTable({ alerts, isLoading }: AlertsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alarm Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hayvan ID / Konum</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Önem Düzeyi</TableHead>
              <TableHead>Zaman</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
              ))
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.animalId}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>
                    <Badge variant={severityMap[alert.severity] || 'default'}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(alert.timestamp), 'PPP p', { locale: tr })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Geçmiş kayıt bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
