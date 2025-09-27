import { AppLayout } from '@/components/layout/app-layout';

export default function AssistanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
