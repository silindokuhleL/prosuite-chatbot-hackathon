import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetListPage() {
  return (
    <>
      <PageHeader 
        title="Assets"
        description="View and manage all organizational assets"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Asset List"
        description="Comprehensive view of all assets in your organization"
        icon="list"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
