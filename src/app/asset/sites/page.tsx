import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetSitesPage() {
  return (
    <>
      <PageHeader 
        title="Sites"
        description="Manage organizational sites"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Sites"
        description="View and manage organizational sites and buildings"
        icon="building"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
