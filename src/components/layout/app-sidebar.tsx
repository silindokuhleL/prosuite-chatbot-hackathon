'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getPrimaryMenu, getBottomMenu } from '@/lib/data';
import { Icon, type IconName } from '@/components/ui/icons';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  path?: string;
  module?: string;
  color?: string;
  secondary_menu?: {
    id: string;
    label: string;
    icon: string;
    path: string;
    module?: string;
  }[];
};

function getIconComponent(iconName: string): IconName {
  const iconMap: Record<string, IconName> = {
    home: 'home',
    dashboard: 'dashboard',
    risk: 'risk',
    asset: 'asset',
    incident: 'incident',
    audit: 'audit',
    compliance: 'compliance',
    governance: 'governance',
    performance: 'performance',
    settings: 'settings',
    help: 'help',
    users: 'users',
    list: 'list',
    grid: 'grid',
    chart: 'chart',
    calendar: 'calendar',
    file: 'file',
    folder: 'folder',
    search: 'search',
    alert: 'alert',
    check: 'check',
    clock: 'clock',
    star: 'target',
    activity: 'activity',
    network: 'network',
    building: 'building',
    'map-pin': 'map-pin',
    user: 'user',
    'user-check': 'user-check',
    contact: 'contact',
    handshake: 'handshake',
    book: 'book',
    clipboard: 'clipboard',
    'file-check': 'file-check',
    'file-chart': 'file-chart',
    refresh: 'refresh',
    'life-buoy': 'life-buoy',
    message: 'message',
    shield: 'shield',
  };
  return iconMap[iconName] || 'dashboard';
}

interface PrimarySidebarProps {
  activeItem: string | null;
  primaryMenu: MenuItem[];
  bottomMenu: MenuItem[];
}

function PrimarySidebar({ activeItem, primaryMenu, bottomMenu }: PrimarySidebarProps) {
  const pathname = usePathname();

  const isItemActive = (item: MenuItem) => {
    if (item.path && pathname === item.path) return true;
    if (item.secondary_menu) {
      return item.secondary_menu.some(sub => {
        if (pathname === sub.path) return true;
        if (pathname.startsWith(sub.path + '/')) return true;
        return false;
      });
    }
    return activeItem === item.id;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r border-blue-700 bg-blue-600 lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-blue-500">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <span className="text-lg font-bold text-white">PS</span>
          </div>
        </Link>
      </div>

      {/* Primary Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {primaryMenu.map((item) => {
          const isActive = isItemActive(item);
          const hasSubmenu = item.secondary_menu && item.secondary_menu.length > 0;
          const targetPath = hasSubmenu ? item.secondary_menu![0].path : (item.path || '/');
          
          return (
            <Link
              key={item.id}
              href={targetPath}
              className={cn(
                'flex w-full flex-col items-center justify-center rounded-lg p-2 text-xs transition-colors',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-white/80 hover:bg-blue-500 hover:text-white'
              )}
              title={item.label}
            >
              <Icon name={getIconComponent(item.icon)} size={22} />
              <span className="mt-1 truncate text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-blue-500 p-2 space-y-1">
        {bottomMenu.map((item) => {
          const isActive = activeItem === item.id || (item.secondary_menu?.some(sub => pathname.startsWith(sub.path)));
          const hasSubmenu = item.secondary_menu && item.secondary_menu.length > 0;
          const targetPath = hasSubmenu ? item.secondary_menu![0].path : (item.path || '/');
          
          return (
            <Link
              key={item.id}
              href={targetPath}
              className={cn(
                'flex w-full flex-col items-center justify-center rounded-lg p-2 text-xs transition-colors',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-white/80 hover:bg-blue-500 hover:text-white'
              )}
              title={item.label}
            >
              <Icon name={getIconComponent(item.icon)} size={22} />
              <span className="mt-1 truncate text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

interface SecondarySidebarProps {
  item: MenuItem | null;
}

function SecondarySidebar({ item }: SecondarySidebarProps) {
  const pathname = usePathname();

  if (!item || !item.secondary_menu) return null;

  return (
    <aside 
      className="fixed inset-y-0 left-16 z-40 hidden w-56 flex-col border-r border-blue-200 bg-blue-50 lg:flex"
    >
      {/* Header */}
      <div 
        className="flex h-16 items-center border-b border-blue-200 px-4 bg-blue-100"
      >
        <div className="flex items-center gap-2">
          <Icon 
            name={getIconComponent(item.icon)} 
            size={20} 
            style={{ color: item.color }}
          />
          <span 
            className="font-semibold"
            style={{ color: item.color }}
          >
            {item.label}
          </span>
        </div>
      </div>

      {/* Secondary Menu Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {item.secondary_menu.map((subItem) => {
          const isActive = pathname === subItem.path || (subItem.path !== '/' && pathname.startsWith(subItem.path + '/'));
          
          return (
            <Link
              key={subItem.id}
              href={subItem.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-200 text-blue-900'
                  : 'text-blue-800 hover:bg-blue-100'
              )}
              style={isActive ? { 
                backgroundColor: item.color ? `${item.color}20` : undefined,
                color: item.color 
              } : undefined}
            >
              <Icon name={getIconComponent(subItem.icon)} size={18} />
              <span>{subItem.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const primaryMenu = getPrimaryMenu();
  const bottomMenu = getBottomMenu();

  // Always derive active menu item from current path - sidebar is always visible
  const activeMenuItem = useMemo(() => {
    const allMenuItems = [...primaryMenu, ...bottomMenu];
    
    // Find matching module based on path
    const matchedItem = allMenuItems.find(item => {
      if (item.secondary_menu) {
        // Check if current path matches any secondary menu path
        return item.secondary_menu.some(sub => {
          // Exact match for dashboard paths (e.g., /risk, /asset)
          if (pathname === sub.path) return true;
          // Prefix match for sub-pages (e.g., /risk/register)
          if (pathname.startsWith(sub.path + '/')) return true;
          return false;
        });
      }
      return false;
    });

    // If no match found, default to first module with secondary menu (Risk)
    if (!matchedItem) {
      const firstModuleWithMenu = allMenuItems.find(item => item.secondary_menu && item.secondary_menu.length > 0);
      return firstModuleWithMenu || null;
    }

    return matchedItem;
  }, [pathname, primaryMenu, bottomMenu]);

  return (
    <>
      <PrimarySidebar 
        activeItem={activeMenuItem?.id || null}
        primaryMenu={primaryMenu}
        bottomMenu={bottomMenu}
      />
      <SecondarySidebar 
        item={activeMenuItem}
      />
    </>
  );
}

export function MobileAppSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null);
  const primaryMenu = getPrimaryMenu();
  const bottomMenu = getBottomMenu();

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    if (item.secondary_menu) {
      if (activeMenuItem?.id === item.id) {
        setActiveMenuItem(null);
      } else {
        setActiveMenuItem(item);
      }
    } else if (item.path) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-72 flex-col bg-sidebar lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
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

        <nav className="flex-1 overflow-y-auto p-4">
          {primaryMenu.map((item) => {
            const isActive = activeMenuItem?.id === item.id || 
              (item.secondary_menu?.some(sub => pathname.startsWith(sub.path)));
            
            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      name={getIconComponent(item.icon)} 
                      size={20}
                      style={{ color: isActive ? item.color : undefined }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.secondary_menu && (
                    <Icon 
                      name={isActive ? 'chevronDown' : 'chevronRight'} 
                      size={16} 
                    />
                  )}
                </button>
                
                {isActive && item.secondary_menu && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                    {item.secondary_menu.map((subItem) => {
                      const isSubActive = pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.id}
                          href={subItem.path}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isSubActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                          )}
                        >
                          <Icon name={getIconComponent(subItem.icon)} size={16} />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          {bottomMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Icon name={getIconComponent(item.icon)} size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
