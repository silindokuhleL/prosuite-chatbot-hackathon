'use client';

import { useRouter } from 'next/navigation';
import { Icon, IconName } from '@/components/ui/icons';

interface QuickNavigationProps {
  onNavigate?: () => void;
}

// Module navigation links with sub-pages
const MODULE_LINKS = {
  risk: {
    name: 'Risk Management',
    icon: 'risk' as IconName,
    color: '#dc2626',
    path: '/risk',
    subLinks: [
      { name: 'Risk Register', path: '/risk', icon: 'list' as IconName },
      { name: 'Risk Matrix', path: '/risk/matrix', icon: 'grid3x3' as IconName },
      { name: 'Action Plans', path: '/risk/action-plans', icon: 'clipboardList' as IconName },
      { name: 'Reports', path: '/risk/reports', icon: 'fileText' as IconName },
    ],
  },
  asset: {
    name: 'Asset Management',
    icon: 'asset' as IconName,
    color: '#2563eb',
    path: '/asset',
    subLinks: [
      { name: 'Asset Register', path: '/asset', icon: 'list' as IconName },
      { name: 'Categories', path: '/asset/categories', icon: 'folder' as IconName },
      { name: 'Maintenance', path: '/asset/maintenance', icon: 'wrench' as IconName },
      { name: 'Reports', path: '/asset/reports', icon: 'fileText' as IconName },
    ],
  },
  incident: {
    name: 'Incident Management',
    icon: 'incident' as IconName,
    color: '#f97316',
    path: '/incident',
    subLinks: [
      { name: 'Incidents', path: '/incident', icon: 'alertTriangle' as IconName },
      { name: 'Knowledge Base', path: '/incident/knowledge-base', icon: 'bookOpen' as IconName },
      { name: 'Reports', path: '/incident/reports', icon: 'fileText' as IconName },
    ],
  },
  audit: {
    name: 'Audit Management',
    icon: 'audit' as IconName,
    color: '#0891b2',
    path: '/audit',
    subLinks: [
      { name: 'Engagements', path: '/audit', icon: 'clipboardCheck' as IconName },
      { name: 'Findings', path: '/audit/findings', icon: 'search' as IconName },
      { name: 'Workpapers', path: '/audit/workpapers', icon: 'fileText' as IconName },
      { name: 'Universe', path: '/audit/universe', icon: 'globe' as IconName },
    ],
  },
  compliance: {
    name: 'Compliance',
    icon: 'compliance' as IconName,
    color: '#16a34a',
    path: '/compliance',
    subLinks: [
      { name: 'Packages', path: '/compliance', icon: 'package' as IconName },
      { name: 'Assessments', path: '/compliance/assessments', icon: 'checkCircle' as IconName },
      { name: 'Training', path: '/compliance/training', icon: 'graduationCap' as IconName },
      { name: 'Reports', path: '/compliance/reports', icon: 'fileText' as IconName },
    ],
  },
  governance: {
    name: 'Governance',
    icon: 'governance' as IconName,
    color: '#7c3aed',
    path: '/governance',
    subLinks: [
      { name: 'Policies', path: '/governance', icon: 'fileText' as IconName },
      { name: 'Committees', path: '/governance/committees', icon: 'users' as IconName },
      { name: 'Delegations', path: '/governance/delegations', icon: 'userCheck' as IconName },
      { name: 'Objectives', path: '/governance/objectives', icon: 'target' as IconName },
    ],
  },
  performance: {
    name: 'Performance',
    icon: 'performance' as IconName,
    color: '#ec4899',
    path: '/performance',
    subLinks: [
      { name: 'Dashboard', path: '/performance', icon: 'barChart2' as IconName },
      { name: 'KPIs', path: '/performance/kpis', icon: 'trendingUp' as IconName },
      { name: 'Scorecards', path: '/performance/scorecards', icon: 'layoutDashboard' as IconName },
      { name: 'Reports', path: '/performance/reports', icon: 'fileText' as IconName },
    ],
  },
};

export function QuickNavigation({ onNavigate }: QuickNavigationProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 my-2">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <Icon name="menu" size={18} className="text-violet-600" />
        <h3 className="font-semibold text-sm">Quick Navigation</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(MODULE_LINKS).map(([key, module]) => (
          <button
            key={key}
            onClick={() => handleNavigate(module.path)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${module.color}15` }}
            >
              <Icon name={module.icon} size={16} style={{ color: module.color }} />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {module.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t">
        <button
          onClick={() => handleNavigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
        >
          <Icon name="dashboard" size={16} className="text-violet-600" />
          <span className="text-sm font-medium text-violet-700">Go to Dashboard</span>
        </button>
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
