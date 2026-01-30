'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from './sidebar';

interface HeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Icon name="menu" size={20} />
          </Button>
          
          {title && (
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="bell" size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Icon name="settings" size={20} />
          </Button>
        </div>
      </header>

      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  textColor?: string;
  accentColor?: string;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions,
  textColor = '#006EAD',
  accentColor = '#91BC4D',
}: PageHeaderProps) {
  const [pageTitleFirstWord, ...remainingWords] = (title || '').split(' ');
  const remainingTitle = remainingWords.join(' ');

  return (
    <div className="mb-6 space-y-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {index > 0 && <Icon name="chevronRight" size={14} />}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center" style={{ color: textColor }}>
          <span
            className="w-[4px] h-[32px] mr-3 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <div>
            <h1 className="text-xl md:text-2xl leading-snug">
              <span className="font-bold mr-1">{pageTitleFirstWord}</span>
              <span className="font-light">{remainingTitle}</span>
            </h1>
            {description && (
              <p className="text-[12px] leading-[14px] text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
