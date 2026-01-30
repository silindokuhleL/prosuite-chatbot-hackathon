// Data Context Builder - Provides real module data to AI
import { getCollection } from '@/lib/crud';

export interface ModuleDataContext {
  risks: unknown[];
  assets: unknown[];
  incidents: unknown[];
  auditFindings: unknown[];
  complianceControls: unknown[];
  policies: unknown[];
  kpis: unknown[];
  summary: {
    totalRisks: number;
    criticalRisks: number;
    totalAssets: number;
    activeIncidents: number;
    openFindings: number;
    complianceScore: number;
    totalPolicies: number;
    kpiCount: number;
  };
}

// Get all module data for AI context
export function getFullDataContext(): ModuleDataContext {
  const risks = getCollection('risk.risks');
  const assets = getCollection('asset.assets');
  const incidents = getCollection('incident.incidents');
  const auditFindings = getCollection('audit.audit_findings');
  const complianceControls = getCollection('compliance.compliance_packages');
  const policies = getCollection('governance.governance_policies');
  const kpis = getCollection('performance.kpis');

  // Calculate summary metrics
  const criticalRisks = (risks as Record<string, unknown>[]).filter(r => 
    r.priority === 'Critical' || r.risk_level === 'Critical'
  ).length;

  const activeIncidents = (incidents as Record<string, unknown>[]).filter(i => 
    i.status === 'Open' || i.status === 'In Progress'
  ).length;

  const openFindings = (auditFindings as Record<string, unknown>[]).filter(f => 
    f.status === 'Open' || f.status === 'In Progress'
  ).length;

  // Calculate compliance score
  const compliantControls = (complianceControls as Record<string, unknown>[]).filter(c => 
    c.status === 'Compliant' || c.status === 'Active'
  ).length;
  const complianceScore = complianceControls.length > 0 
    ? Math.round((compliantControls / complianceControls.length) * 100) 
    : 100;

  return {
    risks: risks.slice(0, 20), // Limit to prevent token overflow
    assets: assets.slice(0, 20),
    incidents: incidents.slice(0, 15),
    auditFindings: auditFindings.slice(0, 15),
    complianceControls: complianceControls.slice(0, 15),
    policies: policies.slice(0, 10),
    kpis: kpis.slice(0, 10),
    summary: {
      totalRisks: risks.length,
      criticalRisks,
      totalAssets: assets.length,
      activeIncidents,
      openFindings,
      complianceScore,
      totalPolicies: policies.length,
      kpiCount: kpis.length,
    },
  };
}

// Format data for AI prompt
export function formatDataForPrompt(data: ModuleDataContext): string {
  const { summary, risks, assets, incidents, auditFindings, policies, kpis } = data;

  return `
## Current ProSuite Data Summary
- **Total Risks**: ${summary.totalRisks} (${summary.criticalRisks} critical)
- **Total Assets**: ${summary.totalAssets}
- **Active Incidents**: ${summary.activeIncidents}
- **Open Audit Findings**: ${summary.openFindings}
- **Compliance Score**: ${summary.complianceScore}%
- **Total Policies**: ${summary.totalPolicies}
- **KPIs Tracked**: ${summary.kpiCount}

## Risk Register (Top Items)
${formatRisksTable(risks)}

## Asset List (Top Items)
${formatAssetsTable(assets)}

## Active Incidents
${formatIncidentsTable(incidents)}

## Audit Findings
${formatFindingsTable(auditFindings)}

## Policies
${formatPoliciesTable(policies)}

## KPIs
${formatKPIsTable(kpis)}
`;
}

type DataRecord = Record<string, unknown>;

function formatRisksTable(risks: unknown[]): string {
  if (risks.length === 0) return '_No risks found_';
  const data = risks as DataRecord[];
  const header = '| ID | Title | Category | Priority | Status | Owner |';
  const divider = '|-----|-------|----------|----------|--------|-------|';
  const rows = data.slice(0, 10).map(r => 
    `| ${r.id} | ${r.title || r.name || '-'} | ${r.category || '-'} | ${r.priority || r.risk_level || '-'} | ${r.status || '-'} | ${r.owner || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}

function formatAssetsTable(assets: unknown[]): string {
  if (assets.length === 0) return '_No assets found_';
  const data = assets as DataRecord[];
  const header = '| ID | Name | Type | Location | Status | Value |';
  const divider = '|-----|------|------|----------|--------|-------|';
  const rows = data.slice(0, 10).map(a => 
    `| ${a.id} | ${a.name || '-'} | ${a.type || a.category || '-'} | ${a.location || '-'} | ${a.status || '-'} | ${a.value || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}

function formatIncidentsTable(incidents: unknown[]): string {
  if (incidents.length === 0) return '_No incidents found_';
  const data = incidents as DataRecord[];
  const header = '| ID | Title | Severity | Status | Date | Assigned To |';
  const divider = '|-----|-------|----------|--------|------|-------------|';
  const rows = data.slice(0, 10).map(i => 
    `| ${i.id} | ${i.title || '-'} | ${i.severity || i.priority || '-'} | ${i.status || '-'} | ${i.date_occurred || i.created_at || '-'} | ${i.assigned_to || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}

function formatFindingsTable(findings: unknown[]): string {
  if (findings.length === 0) return '_No findings found_';
  const data = findings as DataRecord[];
  const header = '| ID | Title | Severity | Status | Due Date |';
  const divider = '|-----|-------|----------|--------|----------|';
  const rows = data.slice(0, 10).map(f => 
    `| ${f.id} | ${f.title || '-'} | ${f.severity || f.risk_rating || '-'} | ${f.status || '-'} | ${f.due_date || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}

function formatPoliciesTable(policies: unknown[]): string {
  if (policies.length === 0) return '_No policies found_';
  const data = policies as DataRecord[];
  const header = '| ID | Name | Status | Review Date | Owner |';
  const divider = '|-----|------|--------|-------------|-------|';
  const rows = data.slice(0, 10).map(p => 
    `| ${p.id} | ${p.name || p.title || '-'} | ${p.status || '-'} | ${p.next_review_date || '-'} | ${p.owner || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}

function formatKPIsTable(kpis: unknown[]): string {
  if (kpis.length === 0) return '_No KPIs found_';
  const data = kpis as DataRecord[];
  const header = '| ID | Name | Target | Actual | Status |';
  const divider = '|-----|------|--------|--------|--------|';
  const rows = data.slice(0, 10).map(k => 
    `| ${k.id} | ${k.name || k.title || '-'} | ${k.target_value || k.target || '-'} | ${k.actual_value || k.current_value || '-'} | ${k.status || '-'} |`
  );
  return [header, divider, ...rows].join('\n');
}
