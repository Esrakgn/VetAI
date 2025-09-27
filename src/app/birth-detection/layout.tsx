import { AppLayout } from '@/components/layout/app-layout';

export default function BirthDetectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
