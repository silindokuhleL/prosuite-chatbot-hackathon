import { AppLayout } from '@/components/layout/app-layout';

export default function AssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
