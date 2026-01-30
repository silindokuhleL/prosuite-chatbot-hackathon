import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { AssetList } from './asset-list';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function AssetPage() {
  return (
    <>
      <PageHeader
        title="Asset Management"
        description="Track, manage, and depreciate organizational assets"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Asset Management' },
        ]}
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icon name="filter" size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="download" size={16} className="mr-2" />
              Export
            </Button>
            <Button size="sm" style={{ backgroundColor: PROSUITE_COLORS.asset.text }}>
              <Icon name="plus" size={16} className="mr-2" />
              New Asset
            </Button>
          </>
        }
      />
      <AssetList />
    </>
  );
}
