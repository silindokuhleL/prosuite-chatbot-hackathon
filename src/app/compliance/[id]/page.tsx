import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { 
  getCompliancePackage, 
  getCompliancePackageStatuses,
  getCompliancePackageItemsByPackage,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ComplianceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pkg = getCompliancePackage(Number(id));

  if (!pkg) {
    notFound();
  }

  const statuses = getCompliancePackageStatuses();
  const status = statuses.find(s => s.id === pkg.compliance_package_status_id);
  const items = getCompliancePackageItemsByPackage(pkg.id);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#dc2626';
  };

  const getItemStatusColor = (itemStatus: string) => {
    switch (itemStatus) {
      case 'compliant': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'non_compliant': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={pkg.name}
        description={`Version ${pkg.version} | ${pkg.publisher_name}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Compliance Management', href: '/compliance' },
          { label: pkg.name },
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
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p 
                className="text-4xl font-bold"
                style={{ color: getScoreColor(pkg.compliance_score) }}
              >
                {pkg.compliance_score}%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Compliance Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600">{pkg.completed_requirements}</p>
              <p className="mt-1 text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-red-600">{pkg.overdue_requirements}</p>
              <p className="mt-1 text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-orange-600">{pkg.missing_evidence_count}</p>
              <p className="mt-1 text-sm text-muted-foreground">Missing Evidence</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="mt-1 text-sm">{pkg.description}</p>
              </div>

              {pkg.comments && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                  <p className="mt-1 text-sm">{pkg.comments}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Publisher</h4>
                  <p className="mt-1 text-sm">{pkg.publisher_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Version</h4>
                  <p className="mt-1 text-sm">{pkg.version}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Pending Reviews</h4>
                  <p className="mt-1 text-sm">{pkg.pending_reviews_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${pkg.compliance_score}%`,
                      backgroundColor: getScoreColor(pkg.compliance_score),
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {pkg.completed_requirements} of {pkg.total_requirements} requirements
                  </span>
                  <span className="font-medium">{Math.round((pkg.completed_requirements / pkg.total_requirements) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requirements ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requirements defined</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${getItemStatusColor(item.status)}20` }}
                      >
                        {item.status === 'compliant' ? (
                          <Icon name="checkCircle" size={16} style={{ color: getItemStatusColor(item.status) }} />
                        ) : item.status === 'non_compliant' ? (
                          <Icon name="xCircle" size={16} style={{ color: getItemStatusColor(item.status) }} />
                        ) : (
                          <Icon name="clock" size={16} style={{ color: getItemStatusColor(item.status) }} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.evidence_required && (
                          <p className="text-xs text-muted-foreground">Evidence required</p>
                        )}
                      </div>
                    </div>
                    <StatusBadge 
                      status={item.status.replace('_', ' ')} 
                      color={getItemStatusColor(item.status)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
