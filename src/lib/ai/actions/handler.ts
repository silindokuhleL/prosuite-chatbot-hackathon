// AI Action Handler - Executes approved actions
import { createItem, updateItem, deleteItem, getCollection } from '@/lib/crud';
import { AIAction, ActionRequest, ActionResult, APPROVAL_REQUIRED_ACTIONS } from './types';
import { buildAuditEvidenceContext } from '../context/builder';

// Generate unique action ID
function generateActionId(): string {
  return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new action request
export function createActionRequest(request: ActionRequest): AIAction {
  return {
    id: generateActionId(),
    type: request.type,
    module: request.module,
    collection: request.collection,
    description: request.description,
    data: request.data,
    status: 'pending',
    requiresApproval: APPROVAL_REQUIRED_ACTIONS.includes(request.type),
    createdAt: new Date().toISOString(),
  };
}

// Execute an approved action
export async function executeAction(action: AIAction): Promise<ActionResult> {
  if (action.status !== 'approved' && action.requiresApproval) {
    return {
      success: false,
      action: { ...action, status: 'failed', error: 'Action requires approval' },
      message: 'This action requires user approval before execution.',
    };
  }

  try {
    let result: unknown;
    
    switch (action.type) {
      case 'create':
        result = createItem(action.collection, action.data);
        break;
        
      case 'update':
        const updateId = action.data.id as number;
        const { id, ...updateData } = action.data;
        result = updateItem(action.collection, updateId, updateData);
        break;
        
      case 'delete':
        const deleteId = action.data.id as number;
        result = deleteItem(action.collection, deleteId);
        break;
        
      case 'escalate':
        // Update priority/severity to critical
        const escalateId = action.data.id as number;
        result = updateItem(action.collection, escalateId, { 
          priority: 'Critical',
          escalated: true,
          escalated_at: new Date().toISOString(),
        });
        break;
        
      case 'assign':
        const assignId = action.data.id as number;
        result = updateItem(action.collection, assignId, {
          assignee_id: action.data.assignee_id,
          assigned_at: new Date().toISOString(),
        });
        break;
        
      case 'search':
        result = performSearch(action.collection, action.data.query as string);
        break;
        
      case 'analyze':
        result = performAnalysis(action.module, action.data);
        break;
        
      case 'report':
        result = generateReport(action.module, action.data);
        break;
        
      case 'harvest-evidence':
        const engagementId = action.data.engagement_id as number;
        result = buildAuditEvidenceContext(engagementId);
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }

    return {
      success: true,
      action: {
        ...action,
        status: 'executed',
        executedAt: new Date().toISOString(),
        result,
      },
      message: `Action "${action.description}" completed successfully.`,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      action: {
        ...action,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      message: `Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Search across collections
function performSearch(collection: string, query: string): unknown[] {
  const data = getCollection(collection);
  const queryLower = query.toLowerCase();
  
  return data.filter((item: Record<string, unknown>) => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(queryLower)
    );
  });
}

// Perform analysis on module data
function performAnalysis(module: string, params: Record<string, unknown>): Record<string, unknown> {
  const analysisType = params.type as string || 'summary';
  
  // Get relevant collections based on module
  const collectionMap: Record<string, string[]> = {
    risk: ['risk.risks', 'risk.controls'],
    audit: ['audit.audit_findings', 'audit.audit_engagements'],
    compliance: ['compliance.compliance_packages', 'compliance.compliance_assessments'],
    incident: ['incident.incidents'],
    asset: ['asset.assets'],
    governance: ['governance.governance_policies'],
    performance: ['performance.kpis'],
  };

  const collections = collectionMap[module] || [];
  const allData: Record<string, unknown[]> = {};
  
  collections.forEach(col => {
    allData[col] = getCollection(col);
  });

  // Calculate metrics
  let totalItems = 0;
  let criticalCount = 0;
  let openCount = 0;

  Object.values(allData).forEach(items => {
    totalItems += items.length;
    items.forEach((item: Record<string, unknown>) => {
      if (item.priority === 'Critical' || item.severity === 'Critical') criticalCount++;
      if (item.status === 'Open' || item.status === 'Pending') openCount++;
    });
  });

  return {
    analysisType,
    module,
    metrics: {
      totalItems,
      criticalCount,
      openCount,
      completionRate: totalItems > 0 ? ((totalItems - openCount) / totalItems * 100).toFixed(1) : 0,
    },
    timestamp: new Date().toISOString(),
  };
}

// Generate report data
function generateReport(module: string, params: Record<string, unknown>): Record<string, unknown> {
  const reportType = params.type as string || 'summary';
  const analysis = performAnalysis(module, params);
  
  return {
    reportType,
    module,
    generatedAt: new Date().toISOString(),
    ...analysis,
    recommendations: generateRecommendations(module, analysis),
  };
}

// Generate AI recommendations based on analysis
function generateRecommendations(module: string, analysis: Record<string, unknown>): string[] {
  const recommendations: string[] = [];
  const metrics = analysis.metrics as Record<string, number>;
  
  if (metrics.criticalCount > 0) {
    recommendations.push(`Address ${metrics.criticalCount} critical items requiring immediate attention.`);
  }
  
  if (metrics.openCount > metrics.totalItems * 0.3) {
    recommendations.push('High number of open items detected. Consider resource reallocation.');
  }
  
  if (Number(metrics.completionRate) < 70) {
    recommendations.push('Completion rate below target. Review processes for improvement opportunities.');
  }
  
  return recommendations;
}
