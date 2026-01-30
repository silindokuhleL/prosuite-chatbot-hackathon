import { PageHeader } from '@/components/layout/header';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function HelpUserGuidePage() {
  return (
    <>
      <PageHeader 
        title="User Guide"
        description="Documentation and tutorials"
      />
      <PlaceholderPage 
        title="User Guide"
        description="Comprehensive documentation to help you use ProSuite effectively"
        icon="book"
      />
    </>
  );
}
