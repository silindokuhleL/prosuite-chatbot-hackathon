import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetReportsPage() {
  return (
    <>
      <PageHeader 
        title="Asset Reports"
        description="Generate and view asset management reports"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Asset Reports"
        description="Generate comprehensive asset reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
