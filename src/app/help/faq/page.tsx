import { PageHeader } from '@/components/layout/header';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function HelpFAQPage() {
  return (
    <>
      <PageHeader 
        title="FAQs"
        description="Frequently asked questions"
      />
      <PlaceholderPage 
        title="Frequently Asked Questions"
        description="Find answers to common questions about using ProSuite"
        icon="message"
      />
    </>
  );
}
