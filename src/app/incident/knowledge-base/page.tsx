import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function IncidentKnowledgeBasePage() {
  return (
    <>
      <PageHeader 
        title="Knowledge Base"
        description="Solutions and procedures for incident resolution"
        textColor={PROSUITE_COLORS.incident.text}
        accentColor={PROSUITE_COLORS.incident.accent}
      />
      <PlaceholderPage 
        title="Knowledge Base"
        description="Access solutions and best practices for incident handling"
        icon="book"
        color={PROSUITE_COLORS.incident.text}
      />
    </>
  );
}
