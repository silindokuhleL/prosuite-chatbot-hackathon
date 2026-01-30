// AI Action Types and Interfaces

export type ActionType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'escalate'
  | 'assign'
  | 'search'
  | 'analyze'
  | 'report'
  | 'harvest-evidence';

export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';

export interface AIAction {
  id: string;
  type: ActionType;
  module: string;
  collection: string;
  description: string;
  data: Record<string, unknown>;
  status: ActionStatus;
  requiresApproval: boolean;
  createdAt: string;
  executedAt?: string;
  result?: unknown;
  error?: string;
}

export interface ActionRequest {
  type: ActionType;
  module: string;
  collection: string;
  description: string;
  data: Record<string, unknown>;
}

export interface ActionResult {
  success: boolean;
  action: AIAction;
  message: string;
  data?: unknown;
}

// Actions that require user approval
export const APPROVAL_REQUIRED_ACTIONS: ActionType[] = [
  'create',
  'update', 
  'delete',
  'escalate',
  'assign',
];

// Actions that can be executed automatically
export const AUTO_EXECUTE_ACTIONS: ActionType[] = [
  'search',
  'analyze',
  'report',
];
