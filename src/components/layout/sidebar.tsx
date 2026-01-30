'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getMainNavigation } from '@/lib/modules';
import { Icon, type IconName } from '@/components/ui/icons';

const iconNameMap: Record<string, IconName> = {
  LayoutDashboard: 'dashboard',
  ShieldAlert: 'risk',
  Package: 'asset',
  Scale: 'compliance',
  Building2: 'governance',
  AlertTriangle: 'incident',
  ClipboardCheck: 'audit',
  TrendingUp: 'performance',
};

function getIconName(lucideIcon: string): IconName {
  return iconNameMap[lucideIcon] || 'dashboard';
}

export function Sidebar() {
  const pathname = usePathname();
  const navigation = getMainNavigation();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">PS</span>
          </div>
          <span className="text-lg font-semibold">ProSuite</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon 
                name={getIconName(item.icon)} 
                size={20}
                style={{ color: isActive ? item.color : undefined }}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Icon name="user" size={16} />
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">System Admin</p>
            <p className="text-xs text-muted-foreground">Acme Financial</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const pathname = usePathname();
  const navigation = getMainNavigation();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-sidebar lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">PS</span>
            </div>
            <span className="text-lg font-semibold">ProSuite</span>
          </Link>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted">
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon 
                  name={getIconName(item.icon)} 
                  size={20}
                  style={{ color: isActive ? item.color : undefined }}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
