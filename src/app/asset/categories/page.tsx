import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetCategoriesPage() {
  return (
    <>
      <PageHeader 
        title="Asset Categories"
        description="Manage asset classification categories"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Asset Categories"
        description="Organize assets into categories for better management"
        icon="grid"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
