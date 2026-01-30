import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AssetLocationsPage() {
  return (
    <>
      <PageHeader 
        title="Locations"
        description="Manage asset locations within sites"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
      />
      <PlaceholderPage 
        title="Locations"
        description="Track specific locations where assets are placed"
        icon="map-pin"
        color={PROSUITE_COLORS.asset.text}
      />
    </>
  );
}
