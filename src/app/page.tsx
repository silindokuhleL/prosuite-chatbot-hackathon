import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { ModuleWidget } from '@/components/dashboard/module-widget';
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { getDashboardMetrics, getRisks, getAssets, getIncidents, getAuditEngagements, getCompliancePackages, getGovernancePolicies } from '@/lib/data';
import { getEnabledModuleConfigs } from '@/lib/modules';
import { getTenant } from '@/lib/data';

function getModuleStats(slug: string) {
  switch (slug) {
    case 'risk': {
      const risks = getRisks();
      return {
        primary: { label: 'Total Risks', value: risks.length },
        secondary: { label: 'Critical', value: risks.filter(r => r.inherit_risk_score >= 20).length },
        items: risks.slice(0, 3).map(r => ({
          id: r.id,
          title: r.title,
          status: r.inherit_risk_score >= 20 ? 'Critical' : r.inherit_risk_score >= 13 ? 'High' : 'Medium',
          statusColor: r.inherit_risk_score >= 20 ? '#dc2626' : r.inherit_risk_score >= 13 ? '#f97316' : '#eab308',
        })),
      };
    }
    case 'asset': {
      const assets = getAssets();
      return {
        primary: { label: 'Total Assets', value: assets.length },
        secondary: { label: 'Active', value: assets.filter(a => a.assetStatus_id === 1).length },
        items: assets.slice(0, 3).map(a => ({
          id: a.id,
          title: a.description,
          status: a.assetStatus_name,
          statusColor: a.assetStatus_id === 1 ? '#22c55e' : '#f97316',
        })),
      };
    }
    case 'incident': {
      const incidents = getIncidents();
      return {
        primary: { label: 'Total Incidents', value: incidents.length },
        secondary: { label: 'Open', value: incidents.filter(i => i.status_id !== 4).length },
        items: incidents.slice(0, 3).map(i => ({
          id: i.id,
          title: i.title,
          status: i.status_id === 1 ? 'New' : i.status_id === 2 ? 'Investigating' : 'Resolved',
          statusColor: i.status_id === 1 ? '#3b82f6' : i.status_id === 2 ? '#f97316' : '#22c55e',
        })),
      };
    }
    case 'audit': {
      const audits = getAuditEngagements();
      return {
        primary: { label: 'Engagements', value: audits.length },
        secondary: { label: 'Active', value: audits.filter(a => a.status_id !== 4).length },
        items: audits.slice(0, 3).map(a => ({
          id: a.id,
          title: a.title,
          status: a.status_id === 1 ? 'Planning' : a.status_id === 2 ? 'Fieldwork' : 'Completed',
          statusColor: a.status_id === 1 ? '#3b82f6' : a.status_id === 2 ? '#f97316' : '#22c55e',
        })),
      };
    }
    case 'compliance': {
      const packages = getCompliancePackages();
      const avgScore = packages.reduce((acc, p) => acc + p.compliance_score, 0) / packages.length;
      return {
        primary: { label: 'Packages', value: packages.length },
        secondary: { label: 'Avg Score', value: `${Math.round(avgScore)}%` },
        items: packages.slice(0, 3).map(p => ({
          id: p.id,
          title: p.name,
          status: `${p.compliance_score}%`,
          statusColor: p.compliance_score >= 80 ? '#22c55e' : p.compliance_score >= 60 ? '#eab308' : '#dc2626',
        })),
      };
    }
    case 'governance': {
      const policies = getGovernancePolicies();
      return {
        primary: { label: 'Policies', value: policies.length },
        secondary: { label: 'Approved', value: policies.filter(p => p.policy_status_id === 3).length },
        items: policies.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title,
          status: p.policy_status_id === 3 ? 'Approved' : p.policy_status_id === 2 ? 'Review' : 'Draft',
          statusColor: p.policy_status_id === 3 ? '#22c55e' : p.policy_status_id === 2 ? '#3b82f6' : '#6b7280',
        })),
      };
    }
    default:
      return {
        primary: { label: 'Items', value: 0 },
      };
  }
}

export default function DashboardPage() {
  const tenant = getTenant();
  const metrics = getDashboardMetrics();
  const modules = getEnabledModuleConfigs().filter(m => m.slug !== 'performance');

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        description={`Welcome to ${tenant?.tenant_name || 'ProSuite'} GRC Platform`}
        breadcrumbs={[{ label: 'Home' }]}
      />

      <div className="space-y-6">
        <MetricsGrid metrics={metrics} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RiskHeatmap />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Module Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <ModuleWidget
                key={module.slug}
                module={module}
                stats={getModuleStats(module.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
