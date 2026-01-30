import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceCOIPage() {
  return (
    <>
      <PageHeader 
        title="Conflict of Interest"
        description="Manage conflict of interest declarations"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Conflict of Interest"
        description="Track and manage conflict of interest declarations and resolutions"
        icon="handshake"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
