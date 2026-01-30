// AI Configuration
export const AI_CONFIG = {
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
};

// Module definitions for AI context
export const PROSUITE_MODULES = {
  risk: {
    name: 'Risk Management',
    icon: 'shield-alert',
    color: '#dc2626',
    collections: ['risk.risks', 'risk.risk_action_plans', 'risk.controls', 'risk.risk_assessments'],
    capabilities: ['analyze', 'create', 'escalate', 'assess', 'report'],
  },
  asset: {
    name: 'Asset Management',
    icon: 'box',
    color: '#2563eb',
    collections: ['asset.assets', 'asset.categories'],
    capabilities: ['track', 'depreciate', 'transfer', 'dispose', 'report'],
  },
  incident: {
    name: 'Incident Management',
    icon: 'alert-triangle',
    color: '#f97316',
    collections: ['incident.incidents', 'incident.incident_knowledge_base'],
    capabilities: ['report', 'investigate', 'escalate', 'resolve', 'learn'],
  },
  audit: {
    name: 'Audit Management',
    icon: 'clipboard-check',
    color: '#0891b2',
    collections: ['audit.audit_engagements', 'audit.audit_findings', 'audit.audit_workpapers', 'audit.audit_universe_items'],
    capabilities: ['plan', 'execute', 'evidence', 'report', 'followup'],
  },
  compliance: {
    name: 'Compliance Management',
    icon: 'scale',
    color: '#16a34a',
    collections: ['compliance.regulations_standards', 'compliance.compliance_packages', 'compliance.compliance_assessments'],
    capabilities: ['assess', 'monitor', 'gap-analysis', 'train', 'report'],
  },
  governance: {
    name: 'Governance',
    icon: 'landmark',
    color: '#7c3aed',
    collections: ['governance.governance_policies', 'governance.governance_committees', 'governance.business_objectives'],
    capabilities: ['policy', 'delegate', 'committee', 'objective', 'report'],
  },
  performance: {
    name: 'Performance Management',
    icon: 'trending-up',
    color: '#ec4899',
    collections: ['performance.kpis', 'performance.metrics', 'performance.scorecards'],
    capabilities: ['measure', 'track', 'benchmark', 'review', 'report'],
  },
} as const;

export type ModuleKey = keyof typeof PROSUITE_MODULES;

// Quick action suggestions per module
export const MODULE_SUGGESTIONS: Record<ModuleKey, string[]> = {
  risk: [
    'Summarize top 5 critical risks',
    'Show risks without mitigation plans',
    'Analyze risk trends this quarter',
    'Create new risk assessment',
    'Escalate overdue action plans',
  ],
  asset: [
    'List assets due for maintenance',
    'Show depreciation summary',
    'Find assets by location',
    'Calculate total asset value',
    'Identify underutilized assets',
  ],
  incident: [
    'Summarize open incidents',
    'Show incident trends',
    'Find related risks for incident',
    'Escalate critical incidents',
    'Search knowledge base',
  ],
  audit: [
    'Prepare evidence pack',
    'Show audit findings by severity',
    'List overdue follow-ups',
    'Generate audit summary',
    'Auto-harvest evidence',
  ],
  compliance: [
    'Run compliance gap analysis',
    'Show regulatory deadlines',
    'Check control effectiveness',
    'Generate compliance report',
    'Identify training needs',
  ],
  governance: [
    'Review policy status',
    'Show committee schedules',
    'Track objective progress',
    'Check delegation approvals',
    'Generate governance report',
  ],
  performance: [
    'Show KPI dashboard',
    'Analyze metric trends',
    'Compare to benchmarks',
    'Review scorecard status',
    'Identify underperforming areas',
  ],
};
