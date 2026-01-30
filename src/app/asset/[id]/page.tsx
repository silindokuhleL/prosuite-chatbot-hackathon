import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { getAsset } from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const asset = getAsset(Number(id));

  if (!asset) {
    notFound();
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };

  const statusColors: Record<number, string> = {
    1: '#22c55e',
    2: '#f97316',
    3: '#6b7280',
    4: '#dc2626',
  };

  return (
    <AppLayout>
      <PageHeader
        title={asset.description}
        description={asset.assetTag}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Asset Management', href: '/asset' },
          { label: asset.assetTag },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="download" size={16} className="mr-2" />
              Export
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Asset Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Brand</h4>
                  <p className="mt-1 text-sm">{asset.brand}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                  <p className="mt-1 text-sm">{asset.entity_model}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Serial Number</h4>
                  <p className="mt-1 font-mono text-sm">{asset.serialNumber || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="mt-1 text-sm">{asset.category_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                  <p className="mt-1 text-sm">{asset.department_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Condition</h4>
                  <p className="mt-1 text-sm">{asset.condition}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p className="mt-1 text-sm">{asset.site_name} - {asset.location_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    <StatusBadge
                      status={asset.assetStatus_name}
                      color={statusColors[asset.assetStatus_id] || '#6b7280'}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Purchase Cost</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {formatCurrency(asset.cost)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Purchase Date</p>
                  <p className="mt-1 text-sm font-medium">{asset.purchaseDate}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Asset Life</p>
                  <p className="mt-1 text-sm font-medium">{asset.assetLife || '-'} years</p>
                </div>
              </div>

              {asset.isDepreciable && (
                <>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Depreciation Method</p>
                    <p className="mt-1 text-sm font-medium">{asset.depreciationMethod_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="mt-1 text-sm font-medium">{asset.depreciationRate}%</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Residual Value</p>
                      <p className="mt-1 text-sm font-medium">{formatCurrency(asset.residualValue || 0)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Procurement Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">PO Number</h4>
                  <p className="mt-1 font-mono text-sm">{asset.purchaseOrderNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Invoice Number</h4>
                  <p className="mt-1 font-mono text-sm">{asset.invoiceNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Service Provider</h4>
                  <p className="mt-1 text-sm">{asset.serviceProvider}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Supplier</h4>
                  <p className="mt-1 text-sm">{asset.supplier || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Warranty Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Warranty Period</h4>
                  <p className="mt-1 text-sm">{asset.warrantyPeriod || '-'} months</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Warranty Expiration</h4>
                  <p className="mt-1 text-sm">{asset.warrantyExpiration || '-'}</p>
                </div>
              </div>
              {asset.warrantyExpiration && (
                <div className="mt-4">
                  <Badge 
                    color={new Date(asset.warrantyExpiration) > new Date() ? '#22c55e' : '#dc2626'}
                  >
                    {new Date(asset.warrantyExpiration) > new Date() ? 'Under Warranty' : 'Warranty Expired'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
