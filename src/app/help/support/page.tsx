import { PageHeader } from '@/components/layout/header';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function HelpSupportPage() {
  return (
    <>
      <PageHeader 
        title="Contact Support"
        description="Get help from our support team"
      />
      <PlaceholderPage 
        title="Contact Support"
        description="Reach out to our support team for assistance"
        icon="life-buoy"
      />
    </>
  );
}
