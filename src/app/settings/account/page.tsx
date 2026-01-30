import { PageHeader } from '@/components/layout/header';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function SettingsAccountPage() {
  return (
    <>
      <PageHeader 
        title="Account Settings"
        description="Manage your account preferences"
      />
      <PlaceholderPage 
        title="Account Settings"
        description="Update your profile, preferences, and security settings"
        icon="user"
      />
    </>
  );
}
