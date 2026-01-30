import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { 
  getAuditEngagement, 
  getUser, 
  getAuditEngagementStatuses,
  getAuditFindingsByEngagement,
  getAuditFindingStatuses,
  getAuditFindingRiskRatings,
  getAuditWorkpapersByEngagement,
  getAuditWorkpaperStatuses,
  getAuditWorkpaperTypes,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuditDetailPage({ params }: PageProps) {
  const { id } = await params;
  const engagement = getAuditEngagement(Number(id));

  if (!engagement) {
    notFound();
  }

  const leadAuditor = getUser(engagement.lead_auditor_id);
  const statuses = getAuditEngagementStatuses();
  const status = statuses.find(s => s.id === engagement.status_id);
  const findings = getAuditFindingsByEngagement(engagement.id);
  const findingStatuses = getAuditFindingStatuses();
  const findingRatings = getAuditFindingRiskRatings();
  const workpapers = getAuditWorkpapersByEngagement(engagement.id);
  const workpaperStatuses = getAuditWorkpaperStatuses();
  const workpaperTypes = getAuditWorkpaperTypes();

  return (
    <AppLayout>
      <PageHeader
        title={engagement.title}
        description={engagement.engagement_id}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Audit Management', href: '/audit' },
          { label: engagement.engagement_id },
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
              <CardTitle className="text-base">Engagement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Scope</h4>
                <p className="mt-1 text-sm">{engagement.scope}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Lead Auditor</h4>
                  <p className="mt-1 text-sm">{leadAuditor?.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                  <p className="mt-1 text-sm">{engagement.start_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                  <p className="mt-1 text-sm">{engagement.end_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-4xl font-bold text-cyan-600">{findings.length}</p>
                <p className="text-sm text-muted-foreground">Findings</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-4xl font-bold text-blue-600">{workpapers.length}</p>
                <p className="text-sm text-muted-foreground">Workpapers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Findings ({findings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No findings recorded</p>
            ) : (
              <div className="space-y-3">
                {findings.map((finding) => {
                  const findingStatus = findingStatuses.find(s => s.id === finding.status_id);
                  const rating = findingRatings.find(r => r.id === finding.risk_rating_id);
                  const owner = getUser(finding.owner_id);
                  return (
                    <div 
                      key={finding.id} 
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {finding.finding_id}
                          </span>
                          <p className="font-medium">{finding.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Owner: {owner?.name || '-'} | Due: {finding.due_date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge 
                          status={rating?.name || '-'} 
                          color={rating?.color || '#6b7280'} 
                        />
                        <StatusBadge 
                          status={findingStatus?.name || '-'} 
                          color={findingStatus?.color || '#6b7280'} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workpapers ({workpapers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {workpapers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workpapers uploaded</p>
            ) : (
              <div className="space-y-3">
                {workpapers.map((workpaper) => {
                  const wpStatus = workpaperStatuses.find(s => s.id === workpaper.status_id);
                  const wpType = workpaperTypes.find(t => t.id === workpaper.type_id);
                  const preparedBy = getUser(workpaper.prepared_by);
                  const reviewedBy = getUser(workpaper.reviewed_by);
                  return (
                    <div 
                      key={workpaper.id} 
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">{workpaper.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {wpType?.name} | Prepared by: {preparedBy?.name || '-'} | Reviewed by: {reviewedBy?.name || '-'}
                        </p>
                      </div>
                      <StatusBadge 
                        status={wpStatus?.name || '-'} 
                        color={wpStatus?.color || '#6b7280'} 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
