// ============================================
// ProSuite Module Registry
// Enterprise-grade module configuration
// ============================================

import type { ModuleConfig, ModuleRegistry, ModuleSlug } from '@/types';

export const MODULE_REGISTRY: ModuleRegistry = {
  risk: {
    slug: 'risk',
    name: 'Risk Management',
    alias: 'Risk',
    description: 'Comprehensive risk identification, assessment, monitoring, and mitigation',
    icon: 'ShieldAlert',
    color: '#dc2626',
    routes: {
      list: '/risk',
      detail: '/risk/[id]',
      create: '/risk/new',
    },
    features: [
      'Risk Register',
      'Risk Assessment',
      'Control Management',
      'Action Plans',
      'Monitoring Plans',
      'Risk Reports',
      'Heat Maps',
    ],
    enabled: true,
  },
  asset: {
    slug: 'asset',
    name: 'Asset Management',
    alias: 'Asset',
    description: 'Track, manage, and depreciate organizational assets',
    icon: 'Package',
    color: '#3b82f6',
    routes: {
      list: '/asset',
      detail: '/asset/[id]',
      create: '/asset/new',
    },
    features: [
      'Asset Register',
      'Depreciation Tracking',
      'Maintenance Scheduling',
      'Asset Categories',
      'Warranty Management',
      'Asset Reports',
    ],
    enabled: true,
  },
  compliance: {
    slug: 'compliance',
    name: 'Compliance Management',
    alias: 'Compliance',
    description: 'Regulatory compliance tracking and assessment',
    icon: 'Scale',
    color: '#10b981',
    routes: {
      list: '/compliance',
      detail: '/compliance/[id]',
    },
    features: [
      'Compliance Packages',
      'Regulatory Standards',
      'Assessments',
      'Evidence Management',
      'Training Campaigns',
      'Compliance Reports',
    ],
    enabled: true,
  },
  governance: {
    slug: 'governance',
    name: 'Governance Management',
    alias: 'Governance',
    description: 'Corporate governance, policies, and strategic objectives',
    icon: 'Building2',
    color: '#8b5cf6',
    routes: {
      list: '/governance',
      detail: '/governance/[id]',
    },
    features: [
      'Policy Management',
      'Committee Management',
      'Delegation of Authority',
      'Business Continuity',
      'Strategic Objectives',
      'Conflict of Interest',
    ],
    enabled: true,
  },
  incident: {
    slug: 'incident',
    name: 'Incident Management',
    alias: 'Incident',
    description: 'Incident tracking, investigation, and resolution',
    icon: 'AlertTriangle',
    color: '#f97316',
    routes: {
      list: '/incident',
      detail: '/incident/[id]',
      create: '/incident/new',
    },
    features: [
      'Incident Register',
      'Investigation Workflow',
      'Root Cause Analysis',
      'Corrective Actions',
      'Knowledge Base',
      'Incident Reports',
    ],
    enabled: true,
  },
  audit: {
    slug: 'audit',
    name: 'Audit Management',
    alias: 'Audit',
    description: 'Internal audit planning, execution, and reporting',
    icon: 'ClipboardCheck',
    color: '#06b6d4',
    routes: {
      list: '/audit',
      detail: '/audit/[id]',
    },
    features: [
      'Audit Universe',
      'Annual Audit Plan',
      'Audit Engagements',
      'Findings Management',
      'Workpapers',
      'Audit Reports',
    ],
    enabled: true,
  },
  performance: {
    slug: 'performance',
    name: 'Performance Management',
    alias: 'Performance',
    description: 'KPI tracking and performance analytics',
    icon: 'TrendingUp',
    color: '#ec4899',
    routes: {
      list: '/performance',
      detail: '/performance/[id]',
    },
    features: [
      'KPI Dashboard',
      'Performance Metrics',
      'Trend Analysis',
      'AI Insights',
    ],
    enabled: true,
  },
};

// ============================================
// Module Utilities
// ============================================

export const getModuleConfig = (slug: ModuleSlug): ModuleConfig | undefined => 
  MODULE_REGISTRY[slug];

export const getAllModules = (): ModuleConfig[] => 
  Object.values(MODULE_REGISTRY);

export const getEnabledModuleConfigs = (): ModuleConfig[] => 
  Object.values(MODULE_REGISTRY).filter(m => m.enabled);

export const getModuleByRoute = (path: string): ModuleConfig | undefined => {
  const slug = path.split('/')[1] as ModuleSlug;
  return MODULE_REGISTRY[slug];
};

export const isModuleEnabled = (slug: ModuleSlug): boolean => 
  MODULE_REGISTRY[slug]?.enabled ?? false;

// ============================================
// Navigation Configuration
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  color: string;
  badge?: number;
  children?: NavItem[];
}

export const getMainNavigation = (): NavItem[] => [
  {
    label: 'Dashboard',
    href: '/',
    icon: 'LayoutDashboard',
    color: '#6366f1',
  },
  ...getEnabledModuleConfigs().map(module => ({
    label: module.alias,
    href: module.routes.list,
    icon: module.icon,
    color: module.color,
  })),
];

export const getModuleNavigation = (slug: ModuleSlug): NavItem[] => {
  const config = getModuleConfig(slug);
  if (!config) return [];

  return config.features.map(feature => ({
    label: feature,
    href: `${config.routes.list}/${feature.toLowerCase().replace(/\s+/g, '-')}`,
    icon: config.icon,
    color: config.color,
  }));
};
