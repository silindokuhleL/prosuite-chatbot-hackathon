import { PageHeader } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icons';
import { getPerformanceReports, getDashboardMetrics, getBusinessObjectives, getBusinessObjectiveStatuses } from '@/lib/data';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function PerformancePage() {
  const reports = getPerformanceReports();
  const metrics = getDashboardMetrics();
  const objectives = getBusinessObjectives();
  const objectiveStatuses = getBusinessObjectiveStatuses();

  const getStatusColor = (statusId: number) => {
    const status = objectiveStatuses.find(s => s.id === statusId);
    return status?.color || '#6b7280';
  };

  const getStatusName = (statusId: number) => {
    const status = objectiveStatuses.find(s => s.id === statusId);
    return status?.name || 'Unknown';
  };

  return (
    <>
      <PageHeader
        title="Performance Management"
        description="Track KPIs and organizational performance metrics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Performance Management' },
        ]}
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-pink-100 p-3 dark:bg-pink-900/30">
                  <Icon name="target" size={24} className="text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{objectives.length}</p>
                  <p className="text-sm text-muted-foreground">Strategic Objectives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Icon name="checkCircle" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics.complianceScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Icon name="activity" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics.activeAudits}</p>
                  <p className="text-sm text-muted-foreground">Active Audits</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <Icon name="alertCircle" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics.criticalRisks}</p>
                  <p className="text-sm text-muted-foreground">Critical Risks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strategic Objectives Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.map((objective) => (
                <div 
                  key={objective.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{objective.title}</h4>
                      <p className="text-sm text-muted-foreground">{objective.strategic_goal}</p>
                      <p className="text-xs text-muted-foreground">
                        KPIs: {objective.performance_indicator}
                      </p>
                    </div>
                    <Badge color={getStatusColor(objective.status_id)}>
                      {getStatusName(objective.status_id)}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Start: {objective.start_date}</span>
                    <span>End: {objective.end_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon name="barChart" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.ai_enabled && (
                      <Badge variant="secondary" className="text-xs">
                        AI Enabled
                      </Badge>
                    )}
                    <Icon name="chevronRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
