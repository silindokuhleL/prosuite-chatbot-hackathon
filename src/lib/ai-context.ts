// ============================================
// Mazwi Context Provider
// Comprehensive system context for AI assistants
// ============================================

import { 
  getData, 
  getMetadata, 
  getTenant,
  getDashboardMetrics,
  getRisks,
  getAssets,
  getIncidents,
  getAuditEngagements,
  getCompliancePackages,
  getGovernancePolicies,
} from './data';
import { getAllModules } from './modules';

export interface AIContextSummary {
  system: {
    name: string;
    version: string;
    tenant: string;
    generatedAt: string;
  };
  modules: {
    name: string;
    slug: string;
    enabled: boolean;
    itemCount: number;
  }[];
  metrics: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    totalAssets: number;
    activeAssets: number;
    openIncidents: number;
    criticalIncidents: number;
    activeAudits: number;
    complianceScore: number;
    activePolicies: number;
    activeObjectives: number;
  };
  recentActivity: {
    type: string;
    title: string;
    status: string;
    module: string;
  }[];
  criticalItems: {
    type: string;
    id: number;
    title: string;
    severity: string;
    module: string;
  }[];
}

export function generateAIContext(): AIContextSummary {
  const metadata = getMetadata();
  const tenant = getTenant();
  const metrics = getDashboardMetrics();
  const moduleConfigs = getAllModules();

  const risks = getRisks();
  const incidents = getIncidents();

  const modules = moduleConfigs.map(m => ({
    name: m.name,
    slug: m.slug,
    enabled: m.enabled,
    itemCount: getModuleItemCount(m.slug),
  }));

  const criticalItems = [
    ...risks
      .filter(r => r.inherit_risk_score >= 20)
      .map(r => ({
        type: 'risk',
        id: r.id,
        title: r.title,
        severity: 'Critical',
        module: 'risk',
      })),
    ...incidents
      .filter(i => i.severity_level_id === 1)
      .map(i => ({
        type: 'incident',
        id: i.id,
        title: i.title,
        severity: 'Critical',
        module: 'incident',
      })),
  ];

  const recentActivity = [
    ...risks.slice(0, 2).map((r: { title: string; inherit_risk_score: number }) => ({
      type: 'risk',
      title: r.title,
      status: r.inherit_risk_score >= 20 ? 'Critical' : 'Active',
      module: 'risk',
    })),
    ...incidents.slice(0, 2).map((i: { title: string; status_id: number }) => ({
      type: 'incident',
      title: i.title,
      status: i.status_id === 1 ? 'New' : 'In Progress',
      module: 'incident',
    })),
  ];

  return {
    system: {
      name: 'ProSuite GRC Platform',
      version: metadata.version,
      tenant: tenant?.tenant_name || 'Unknown',
      generatedAt: new Date().toISOString(),
    },
    modules,
    metrics,
    recentActivity,
    criticalItems,
  };
}

function getModuleItemCount(slug: string): number {
  switch (slug) {
    case 'risk': return getRisks().length;
    case 'asset': return getAssets().length;
    case 'incident': return getIncidents().length;
    case 'audit': return getAuditEngagements().length;
    case 'compliance': return getCompliancePackages().length;
    case 'governance': return getGovernancePolicies().length;
    default: return 0;
  }
}

export function generateSystemPrompt(): string {
  const context = generateAIContext();
  
  return `You are an AI assistant for ${context.system.tenant}'s ProSuite GRC (Governance, Risk, Compliance) Platform.

## System Overview
- Platform: ${context.system.name}
- Version: ${context.system.version}
- Tenant: ${context.system.tenant}

## Available Modules
${context.modules.map(m => `- **${m.name}** (${m.slug}): ${m.itemCount} items`).join('\n')}

## Current Metrics
- Total Risks: ${context.metrics.totalRisks} (${context.metrics.criticalRisks} critical, ${context.metrics.highRisks} high)
- Active Assets: ${context.metrics.activeAssets} of ${context.metrics.totalAssets}
- Open Incidents: ${context.metrics.openIncidents} (${context.metrics.criticalIncidents} critical)
- Active Audits: ${context.metrics.activeAudits}
- Average Compliance Score: ${context.metrics.complianceScore}%
- Active Policies: ${context.metrics.activePolicies}
- Active Objectives: ${context.metrics.activeObjectives}

## Critical Items Requiring Attention
${context.criticalItems.length > 0 
  ? context.criticalItems.map(item => `- [${item.module.toUpperCase()}] ${item.title} (${item.severity})`).join('\n')
  : 'No critical items at this time.'
}

## Your Capabilities
1. Answer questions about risks, assets, incidents, audits, compliance, and governance
2. Provide insights and analysis on GRC data
3. Help users navigate the platform
4. Explain GRC concepts and best practices
5. Assist with reporting and data interpretation

When responding:
- Be concise and professional
- Reference specific data when available
- Provide actionable recommendations
- Highlight critical items that need attention
- Use the module names consistently`;
}

export function getEntityContext(module: string, id: number): string {
  const data = getData();
  
  switch (module) {
    case 'risk': {
      const risk = data.risk.risks.find(r => r.id === id);
      if (!risk) return 'Risk not found';
      return `Risk: ${risk.title} (${risk.risk_number})
Score: ${risk.inherit_risk_score} (Residual: ${risk.residual_score})
Description: ${risk.description}
Causes: ${risk.causes.join(', ')}
Consequences: ${risk.consequences.join(', ')}`;
    }
    case 'asset': {
      const asset = data.asset.assets.find(a => a.id === id);
      if (!asset) return 'Asset not found';
      return `Asset: ${asset.description} (${asset.assetTag})
Brand: ${asset.brand}
Cost: R${asset.cost.toLocaleString()}
Status: ${asset.assetStatus_name}
Location: ${asset.site_name} - ${asset.location_name}`;
    }
    case 'incident': {
      const incident = data.incident.incidents.find(i => i.id === id);
      if (!incident) return 'Incident not found';
      return `Incident: ${incident.title}
Description: ${incident.description}
Date Occurred: ${incident.date_occurred}
Root Cause: ${incident.root_cause}
Impact: ${incident.impact_details}`;
    }
    default:
      return 'Entity not found';
  }
}

export function searchContext(query: string): { module: string; items: { id: number; title: string; relevance: string }[] }[] {
  const lowerQuery = query.toLowerCase();
  const results: { module: string; items: { id: number; title: string; relevance: string }[] }[] = [];

  const searchRisks = getRisks().filter((r: { title: string; description: string }) => 
    r.title.toLowerCase().includes(lowerQuery) || 
    r.description.toLowerCase().includes(lowerQuery)
  );
  if (searchRisks.length > 0) {
    results.push({
      module: 'risk',
      items: searchRisks.map((r: { id: number; title: string }) => ({ id: r.id, title: r.title, relevance: 'title/description match' })),
    });
  }

  const searchAssets = getAssets().filter((a: { description: string; assetTag: string }) => 
    a.description.toLowerCase().includes(lowerQuery) || 
    a.assetTag.toLowerCase().includes(lowerQuery)
  );
  if (searchAssets.length > 0) {
    results.push({
      module: 'asset',
      items: searchAssets.map((a: { id: number; description: string }) => ({ id: a.id, title: a.description, relevance: 'description/tag match' })),
    });
  }

  const searchIncidents = getIncidents().filter((i: { title: string; description: string }) => 
    i.title.toLowerCase().includes(lowerQuery) || 
    i.description.toLowerCase().includes(lowerQuery)
  );
  if (searchIncidents.length > 0) {
    results.push({
      module: 'incident',
      items: searchIncidents.map((i: { id: number; title: string }) => ({ id: i.id, title: i.title, relevance: 'title/description match' })),
    });
  }

  return results;
}
