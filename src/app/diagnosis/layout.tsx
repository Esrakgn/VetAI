import { AppLayout } from '@/components/layout/app-layout';

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
