'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, IconName } from '@/components/ui/icons';

interface QuickNavigationProps {
  onNavigate?: () => void;
}

interface SubLink {
  name: string;
  path: string;
  icon: IconName;
}

interface ModuleLink {
  name: string;
  icon: IconName;
  color: string;
  path: string;
  subLinks: SubLink[];
}

// Module navigation links with sub-pages (only routes that exist)
const MODULE_LINKS: Record<string, ModuleLink> = {
  risk: {
    name: 'Risk Management',
    icon: 'risk',
    color: '#dc2626',
    path: '/risk',
    subLinks: [
      { name: 'Risk Register', path: '/risk', icon: 'list' },
      { name: 'Assessments', path: '/risk/assessments', icon: 'checkCircle' },
      { name: 'Controls', path: '/risk/controls', icon: 'shield' },
      { name: 'Action Plans', path: '/risk/action-plans', icon: 'clipboard' },
      { name: 'Reports', path: '/risk/reports', icon: 'file' },
    ],
  },
  asset: {
    name: 'Asset Management',
    icon: 'asset',
    color: '#2563eb',
    path: '/asset',
    subLinks: [
      { name: 'Asset Register', path: '/asset', icon: 'list' },
      { name: 'Categories', path: '/asset/categories', icon: 'folder' },
      { name: 'Departments', path: '/asset/departments', icon: 'building' },
      { name: 'Sites', path: '/asset/sites', icon: 'location' },
      { name: 'Locations', path: '/asset/locations', icon: 'map-pin' },
      { name: 'Reports', path: '/asset/reports', icon: 'file' },
    ],
  },
  incident: {
    name: 'Incident Management',
    icon: 'incident',
    color: '#f97316',
    path: '/incident',
    subLinks: [
      { name: 'Incidents', path: '/incident', icon: 'alert' },
      { name: 'Register', path: '/incident/register', icon: 'list' },
      { name: 'Knowledge Base', path: '/incident/knowledge-base', icon: 'book' },
      { name: 'Reports', path: '/incident/reports', icon: 'file' },
    ],
  },
  audit: {
    name: 'Audit Management',
    icon: 'audit',
    color: '#0891b2',
    path: '/audit',
    subLinks: [
      { name: 'Engagements', path: '/audit/engagements', icon: 'clipboard' },
      { name: 'Findings', path: '/audit/findings', icon: 'search' },
      { name: 'Workpapers', path: '/audit/workpapers', icon: 'file' },
      { name: 'Universe', path: '/audit/universe', icon: 'network' },
      { name: 'Annual Plans', path: '/audit/annual-plans', icon: 'calendar' },
      { name: 'Follow-up', path: '/audit/follow-up', icon: 'refresh' },
      { name: 'Reports', path: '/audit/reports', icon: 'file' },
    ],
  },
  compliance: {
    name: 'Compliance',
    icon: 'compliance',
    color: '#16a34a',
    path: '/compliance',
    subLinks: [
      { name: 'Packages', path: '/compliance', icon: 'folder' },
      { name: 'Regulations', path: '/compliance/regulations', icon: 'file' },
      { name: 'Controls', path: '/compliance/controls', icon: 'shield' },
      { name: 'Assessments', path: '/compliance/assessments', icon: 'checkCircle' },
      { name: 'Monitoring', path: '/compliance/monitoring', icon: 'activity' },
      { name: 'Training', path: '/compliance/training', icon: 'users' },
      { name: 'Reports', path: '/compliance/reports', icon: 'file' },
    ],
  },
  governance: {
    name: 'Governance',
    icon: 'governance',
    color: '#7c3aed',
    path: '/governance',
    subLinks: [
      { name: 'Policies', path: '/governance/policies', icon: 'file' },
      { name: 'Committees', path: '/governance/committees', icon: 'users' },
      { name: 'Delegations', path: '/governance/delegations', icon: 'user-check' },
      { name: 'Objectives', path: '/governance/objectives', icon: 'target' },
      { name: 'Business Continuity', path: '/governance/business-continuity', icon: 'shield' },
      { name: 'Conflict of Interest', path: '/governance/conflict-of-interest', icon: 'alert' },
      { name: 'Reports', path: '/governance/reports', icon: 'file' },
    ],
  },
  performance: {
    name: 'Performance',
    icon: 'performance',
    color: '#ec4899',
    path: '/performance',
    subLinks: [
      { name: 'Dashboard', path: '/performance', icon: 'barChart' },
      { name: 'KPIs', path: '/performance/kpis', icon: 'activity' },
      { name: 'Metrics', path: '/performance/metrics', icon: 'chart' },
      { name: 'Scorecards', path: '/performance/scorecards', icon: 'dashboard' },
      { name: 'Reviews', path: '/performance/reviews', icon: 'eye' },
      { name: 'Reports', path: '/performance/reports', icon: 'file' },
    ],
  },
};

export function QuickNavigation({ onNavigate }: QuickNavigationProps) {
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  const toggleModule = (key: string) => {
    setExpandedModule(expandedModule === key ? null : key);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 my-2 max-h-[400px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <Icon name="menu" size={18} className="text-violet-600" />
        <h3 className="font-semibold text-sm">Quick Navigation</h3>
        <span className="text-xs text-gray-400 ml-auto">Click to expand</span>
      </div>
      
      <div className="space-y-1">
        {Object.entries(MODULE_LINKS).map(([key, module]) => (
          <div key={key}>
            {/* Module Header */}
            <button
              onClick={() => toggleModule(key)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${module.color}15` }}
              >
                <Icon name={module.icon} size={16} style={{ color: module.color }} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">
                {module.name}
              </span>
              <Icon 
                name={expandedModule === key ? 'chevronDown' : 'chevronRight'} 
                size={14} 
                className="text-gray-400" 
              />
            </button>
            
            {/* Sub-pages */}
            {expandedModule === key && (
              <div className="ml-4 pl-4 border-l-2 space-y-1 my-1" style={{ borderColor: `${module.color}30` }}>
                {module.subLinks.map((sub) => (
                  <button
                    key={sub.path}
                    onClick={() => handleNavigate(sub.path)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Icon name={sub.icon} size={14} style={{ color: module.color }} />
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Quick Links Section */}
      <div className="mt-3 pt-3 border-t space-y-2">
        <p className="text-xs text-gray-500 font-medium">Quick Links</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            <Icon name="dashboard" size={14} className="text-violet-600" />
            <span className="text-xs font-medium text-violet-700">Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigate('/settings')}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Icon name="settings" size={14} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Settings</span>
          </button>
          <button
            onClick={() => handleNavigate('/profile')}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Icon name="user" size={14} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Profile</span>
          </button>
          <button
            onClick={() => handleNavigate('/help')}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Icon name="help" size={14} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact version for inline use
export function QuickNavLinks({ onNavigate }: QuickNavigationProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {Object.entries(MODULE_LINKS).map(([key, module]) => (
        <button
          key={key}
          onClick={() => handleNavigate(module.path)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: `${module.color}15`,
            color: module.color 
          }}
        >
          <Icon name={module.icon} size={12} />
          {module.name}
        </button>
      ))}
    </div>
  );
}

export default QuickNavigation;
