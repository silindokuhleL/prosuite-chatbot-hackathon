// Role-Based Action Permissions System
// Controls which AI actions users can perform based on their role

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export type Permission = 
  | 'ai.chat'           // Basic chat access
  | 'ai.create'         // Create records via AI
  | 'ai.update'         // Update records via AI
  | 'ai.delete'         // Delete records via AI
  | 'ai.escalate'       // Escalate items via AI
  | 'ai.assign'         // Assign tasks via AI
  | 'ai.analyze'        // Run AI analysis
  | 'ai.report'         // Generate AI reports
  | 'ai.harvest'        // Auto-harvest evidence
  | 'ai.bulk_actions'   // Perform bulk operations
  | 'ai.sensitive_data' // Access sensitive data
  | 'ai.export';        // Export data via AI

// Role permission mappings
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'ai.chat', 'ai.create', 'ai.update', 'ai.delete', 
    'ai.escalate', 'ai.assign', 'ai.analyze', 'ai.report',
    'ai.harvest', 'ai.bulk_actions', 'ai.sensitive_data', 'ai.export'
  ],
  manager: [
    'ai.chat', 'ai.create', 'ai.update', 
    'ai.escalate', 'ai.assign', 'ai.analyze', 'ai.report',
    'ai.harvest', 'ai.export'
  ],
  analyst: [
    'ai.chat', 'ai.create', 'ai.update', 
    'ai.analyze', 'ai.report', 'ai.harvest'
  ],
  viewer: [
    'ai.chat', 'ai.analyze'
  ]
};

// Module-specific permission overrides
const MODULE_PERMISSIONS: Record<string, Partial<Record<UserRole, Permission[]>>> = {
  risk: {
    analyst: ['ai.chat', 'ai.create', 'ai.update', 'ai.analyze', 'ai.report', 'ai.escalate']
  },
  audit: {
    analyst: ['ai.chat', 'ai.create', 'ai.update', 'ai.analyze', 'ai.report', 'ai.harvest']
  },
  compliance: {
    analyst: ['ai.chat', 'ai.analyze', 'ai.report']
  }
};

// Actions that require explicit approval regardless of permissions
const APPROVAL_REQUIRED_ACTIONS: Permission[] = [
  'ai.delete',
  'ai.bulk_actions',
  'ai.escalate'
];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  moduleRoles?: Record<string, UserRole>; // Module-specific role overrides
}

export const PermissionService = {
  /**
   * Check if user has a specific permission
   */
  hasPermission(user: User, permission: Permission, module?: string): boolean {
    // Get effective role for the module
    const effectiveRole = module && user.moduleRoles?.[module] 
      ? user.moduleRoles[module] 
      : user.role;

    // Check module-specific permissions first
    if (module && MODULE_PERMISSIONS[module]?.[effectiveRole]) {
      return MODULE_PERMISSIONS[module][effectiveRole]!.includes(permission);
    }

    // Fall back to role permissions
    return ROLE_PERMISSIONS[effectiveRole].includes(permission);
  },

  /**
   * Check if action requires approval
   */
  requiresApproval(permission: Permission): boolean {
    return APPROVAL_REQUIRED_ACTIONS.includes(permission);
  },

  /**
   * Get all permissions for a user in a specific module
   */
  getUserPermissions(user: User, module?: string): Permission[] {
    const effectiveRole = module && user.moduleRoles?.[module]
      ? user.moduleRoles[module]
      : user.role;

    if (module && MODULE_PERMISSIONS[module]?.[effectiveRole]) {
      return MODULE_PERMISSIONS[module][effectiveRole]!;
    }

    return ROLE_PERMISSIONS[effectiveRole];
  },

  /**
   * Map action type to required permission
   */
  getRequiredPermission(actionType: string): Permission {
    const mapping: Record<string, Permission> = {
      'create': 'ai.create',
      'update': 'ai.update',
      'delete': 'ai.delete',
      'escalate': 'ai.escalate',
      'assign': 'ai.assign',
      'analyze': 'ai.analyze',
      'report': 'ai.report',
      'harvest': 'ai.harvest',
      'harvest_evidence': 'ai.harvest',
      'bulk': 'ai.bulk_actions',
      'export': 'ai.export'
    };
    return mapping[actionType] || 'ai.chat';
  },

  /**
   * Validate if user can perform an AI action
   */
  canPerformAction(
    user: User, 
    actionType: string, 
    module?: string
  ): { allowed: boolean; requiresApproval: boolean; reason?: string } {
    const requiredPermission = this.getRequiredPermission(actionType);
    const hasPermission = this.hasPermission(user, requiredPermission, module);

    if (!hasPermission) {
      return {
        allowed: false,
        requiresApproval: false,
        reason: `Your role (${user.role}) does not have permission to perform ${actionType} actions${module ? ` in the ${module} module` : ''}.`
      };
    }

    return {
      allowed: true,
      requiresApproval: this.requiresApproval(requiredPermission)
    };
  },

  /**
   * Get available actions for user in a module
   */
  getAvailableActions(user: User, module?: string): string[] {
    const permissions = this.getUserPermissions(user, module);
    const actionMap: Record<Permission, string> = {
      'ai.chat': 'chat',
      'ai.create': 'create',
      'ai.update': 'update',
      'ai.delete': 'delete',
      'ai.escalate': 'escalate',
      'ai.assign': 'assign',
      'ai.analyze': 'analyze',
      'ai.report': 'report',
      'ai.harvest': 'harvest',
      'ai.bulk_actions': 'bulk',
      'ai.sensitive_data': 'sensitive',
      'ai.export': 'export'
    };

    return permissions
      .filter(p => actionMap[p])
      .map(p => actionMap[p]);
  }
};

export default PermissionService;
