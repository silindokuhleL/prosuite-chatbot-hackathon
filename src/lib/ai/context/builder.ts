// Context Builder - Provides AI with relevant data context
import { getCollection } from '@/lib/crud';
import { ModuleKey, PROSUITE_MODULES } from '../config';

export interface AIContext {
  module: ModuleKey;
  moduleName: string;
  currentPage?: string;
  timestamp: string;
  summary: {
    totalRecords: number;
    criticalItems: number;
    pendingActions: number;
    recentActivity: number;
  };
  data: Record<string, unknown[]>;
  relatedData: Record<string, unknown[]>;
}

// Build context for the current module
export function buildModuleContext(module: ModuleKey, currentPage?: string): AIContext {
  const moduleConfig = PROSUITE_MODULES[module];
  const data: Record<string, unknown[]> = {};
  const relatedData: Record<string, unknown[]> = {};

  // Load primary module data
  moduleConfig.collections.forEach(collection => {
    data[collection] = getCollection(collection);
  });

  // Load related data based on module
  const relatedCollections = getRelatedCollections(module);
  relatedCollections.forEach(collection => {
    relatedData[collection] = getCollection(collection);
  });

  // Calculate summary metrics
  const summary = calculateSummary(module, data);

  return {
    module,
    moduleName: moduleConfig.name,
    currentPage,
    timestamp: new Date().toISOString(),
    summary,
    data,
    relatedData,
  };
}

// Get related collections for cross-module intelligence
function getRelatedCollections(module: ModuleKey): string[] {
  const relations: Record<ModuleKey, string[]> = {
    risk: ['incident.incidents', 'compliance.compliance_packages', 'audit.audit_findings'],
    asset: ['incident.incidents', 'risk.risks'],
    incident: ['risk.risks', 'asset.assets', 'incident.incident_knowledge_base'],
    audit: ['risk.risks', 'compliance.compliance_packages', 'governance.governance_policies', 'incident.incidents'],
    compliance: ['risk.risks', 'audit.audit_findings', 'governance.governance_policies'],
    governance: ['compliance.compliance_packages', 'risk.risks', 'performance.kpis'],
    performance: ['governance.business_objectives', 'risk.risks'],
  };
  return relations[module] || [];
}

// Calculate summary metrics for the module
function calculateSummary(module: ModuleKey, data: Record<string, unknown[]>) {
  let totalRecords = 0;
  let criticalItems = 0;
  let pendingActions = 0;
  let recentActivity = 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  Object.values(data).forEach(records => {
    totalRecords += records.length;
    
    records.forEach((record: any) => {
      // Count critical items
      if (record.priority === 'Critical' || record.severity === 'Critical' || 
          record.risk_level === 'Critical' || record.status === 'Critical') {
        criticalItems++;
      }
      
      // Count pending actions
      if (record.status === 'Open' || record.status === 'Pending' || 
          record.status === 'In Progress' || record.status === 'Draft') {
        pendingActions++;
      }
      
      // Count recent activity
      const recordDate = new Date(record.created_at || record.date_occurred || record.start_date);
      if (recordDate > weekAgo) {
        recentActivity++;
      }
    });
  });

  return { totalRecords, criticalItems, pendingActions, recentActivity };
}

// Build context for Audit Evidence Harvesting
export function buildAuditEvidenceContext(engagementId: number): {
  risks: unknown[];
  incidents: unknown[];
  policies: unknown[];
  controls: unknown[];
  missingEvidence: string[];
} {
  const risks = getCollection('risk.risks');
  const incidents = getCollection('incident.incidents');
  const policies = getCollection('governance.governance_policies');
  const controls = getCollection('risk.controls');
  const complianceControls = getCollection('compliance.compliance_packages');

  // Identify missing documentation
  const missingEvidence: string[] = [];
  
  // Check for risks without controls
  const risksWithoutControls = risks.filter((r: any) => !r.control_id);
  if (risksWithoutControls.length > 0) {
    missingEvidence.push(`${risksWithoutControls.length} risks without linked controls`);
  }

  // Check for controls without evidence
  const controlsWithoutEvidence = controls.filter((c: any) => !c.evidence_url);
  if (controlsWithoutEvidence.length > 0) {
    missingEvidence.push(`${controlsWithoutEvidence.length} controls without evidence documentation`);
  }

  // Check for policies due for review
  const policiesDueReview = policies.filter((p: any) => {
    const reviewDate = new Date(p.next_review_date);
    return reviewDate < new Date();
  });
  if (policiesDueReview.length > 0) {
    missingEvidence.push(`${policiesDueReview.length} policies overdue for review`);
  }

  return {
    risks,
    incidents,
    policies,
    controls: [...controls, ...complianceControls],
    missingEvidence,
  };
}

// Build screen context for current view
export function buildScreenContext(
  module: ModuleKey,
  pageType: 'list' | 'detail' | 'chart' | 'form',
  visibleData?: { ids?: number[]; metrics?: Record<string, number> }
) {
  return {
    module,
    moduleName: PROSUITE_MODULES[module].name,
    pageType,
    visibleData,
    timestamp: new Date().toISOString(),
  };
}
