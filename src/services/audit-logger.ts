// AI Action Audit Logger
// Tracks all AI-initiated actions for compliance and security

export type ActionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'escalate' 
  | 'assign' 
  | 'analyze' 
  | 'report' 
  | 'harvest_evidence';

export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: number;
  userName: string;
  module: string;
  actionType: ActionType;
  actionDescription: string;
  targetEntity?: string;
  targetEntityId?: number;
  requestedData?: Record<string, unknown>;
  status: ActionStatus;
  approvedBy?: number;
  approvedAt?: Date;
  executionResult?: {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  };
  conversationId: string;
  messageId: string;
}

// In-memory store (replace with database in production)
const auditLogs: AuditLogEntry[] = [];

export const AuditLogger = {
  /**
   * Log an AI action request
   */
  logActionRequest(
    userId: number,
    userName: string,
    module: string,
    actionType: ActionType,
    actionDescription: string,
    conversationId: string,
    messageId: string,
    options?: {
      targetEntity?: string;
      targetEntityId?: number;
      requestedData?: Record<string, unknown>;
    }
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userName,
      module,
      actionType,
      actionDescription,
      status: 'pending',
      conversationId,
      messageId,
      ...options,
    };

    auditLogs.push(entry);
    console.log('[AUDIT] Action requested:', entry);
    return entry;
  },

  /**
   * Log action approval
   */
  logActionApproval(
    auditId: string,
    approvedBy: number,
    approved: boolean
  ): AuditLogEntry | null {
    const entry = auditLogs.find(log => log.id === auditId);
    if (!entry) return null;

    entry.status = approved ? 'approved' : 'rejected';
    entry.approvedBy = approvedBy;
    entry.approvedAt = new Date();

    console.log(`[AUDIT] Action ${approved ? 'approved' : 'rejected'}:`, entry);
    return entry;
  },

  /**
   * Log action execution result
   */
  logActionExecution(
    auditId: string,
    success: boolean,
    message: string,
    data?: Record<string, unknown>
  ): AuditLogEntry | null {
    const entry = auditLogs.find(log => log.id === auditId);
    if (!entry) return null;

    entry.status = success ? 'executed' : 'failed';
    entry.executionResult = { success, message, data };

    console.log(`[AUDIT] Action ${success ? 'executed' : 'failed'}:`, entry);
    return entry;
  },

  /**
   * Get audit logs with optional filters
   */
  getLogs(filters?: {
    userId?: number;
    module?: string;
    actionType?: ActionType;
    status?: ActionStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let results = [...auditLogs];

    if (filters) {
      if (filters.userId) {
        results = results.filter(log => log.userId === filters.userId);
      }
      if (filters.module) {
        results = results.filter(log => log.module === filters.module);
      }
      if (filters.actionType) {
        results = results.filter(log => log.actionType === filters.actionType);
      }
      if (filters.status) {
        results = results.filter(log => log.status === filters.status);
      }
      if (filters.startDate) {
        results = results.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        results = results.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  },

  /**
   * Get audit statistics
   */
  getStats(module?: string): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    executed: number;
    failed: number;
    byActionType: Record<ActionType, number>;
  } {
    const logs = module 
      ? auditLogs.filter(log => log.module === module)
      : auditLogs;

    const byActionType = {} as Record<ActionType, number>;
    logs.forEach(log => {
      byActionType[log.actionType] = (byActionType[log.actionType] || 0) + 1;
    });

    return {
      total: logs.length,
      pending: logs.filter(l => l.status === 'pending').length,
      approved: logs.filter(l => l.status === 'approved').length,
      rejected: logs.filter(l => l.status === 'rejected').length,
      executed: logs.filter(l => l.status === 'executed').length,
      failed: logs.filter(l => l.status === 'failed').length,
      byActionType,
    };
  },

  /**
   * Export logs for compliance reporting
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(auditLogs, null, 2);
    }

    // CSV format
    const headers = [
      'id', 'timestamp', 'userId', 'userName', 'module', 
      'actionType', 'actionDescription', 'status', 'approvedBy', 'approvedAt'
    ];
    const rows = auditLogs.map(log => [
      log.id,
      log.timestamp.toISOString(),
      log.userId,
      log.userName,
      log.module,
      log.actionType,
      `"${log.actionDescription}"`,
      log.status,
      log.approvedBy || '',
      log.approvedAt?.toISOString() || ''
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
};

export default AuditLogger;
