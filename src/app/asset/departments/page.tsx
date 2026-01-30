import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetDepartmentsPage() {
  return (
    <>
      <PageHeader 
        title="Departments"
        description="View assets by department"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Asset Departments"
        description="View and manage assets organized by department"
        icon="network"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
