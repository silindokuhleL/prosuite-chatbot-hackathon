import { AppLayout } from '@/components/layout/app-layout';

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
