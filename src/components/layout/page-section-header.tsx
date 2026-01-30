'use client';

import { ReactNode, useState, useRef } from 'react';
import { ChevronDown, Plus, Download, Upload, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageActionButton {
  label: ReactNode;
  path?: string;
  action?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomAction {
  label?: string;
  action: () => void;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  icon?: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  onBack?: () => void;
}

interface ExportHeader {
  key: string;
  label: string;
}

interface PageSectionHeaderProps {
  title: string;
  subTitle?: string;
  pageActionButtons?: PageActionButton[];
  customAction?: CustomAction;
  showImportExport?: boolean;
  onTemplateDownload?: (format: 'csv' | 'xlsx') => void;
  onImport?: (file: File) => void;
  textColor?: string;
  accentColor?: string;
  exportData?: Record<string, unknown>[];
  exportHeaders?: ExportHeader[];
  removePadding?: boolean;
  children?: ReactNode;
}

export function PageSectionHeader({
  title,
  subTitle,
  pageActionButtons = [],
  customAction,
  showImportExport = false,
  onTemplateDownload,
  onImport,
  textColor = '#006EAD',
  accentColor = '#91BC4D',
  exportData = [],
  exportHeaders = [],
  removePadding = false,
  children,
}: PageSectionHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [pageTitleFirstWord, ...remainingPageTitleWords] = (title || '').split(' ');
  const remainingPageTitleString = remainingPageTitleWords.join(' ');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx' = 'csv') => {
    if (!exportData.length || !exportHeaders.length) {
      console.error('No data or headers provided for export');
      return;
    }

    const headers = exportHeaders.map(h => h.label);
    const data = exportData.map(item =>
      exportHeaders.map(header => String(item[header.key] ?? ''))
    );

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsOpen(false);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const getContextLabel = () => {
    return title
      .replace(/management|list|page|system/gi, '')
      .trim()
      .toLowerCase();
  };

  const getAddActionLabel = () => {
    const baseName = title
      .replace(/management|list|page|system/gi, '')
      .trim()
      .replace(/s$/, '')
      .replace(/ies$/, 'y');
    return `Add ${baseName}`;
  };

  const hasActions = pageActionButtons.length > 0 || customAction || showImportExport;

  return (
    <div>
      <div className={cn(
        'w-full flex flex-col sm:flex-row items-start sm:items-center gap-4',
        removePadding ? 'pb-0' : 'pb-4'
      )}>
        {/* Title Section */}
        <div
          className={cn(
            'flex items-center text-xl',
            hasActions ? 'sm:w-7/12' : 'w-full',
            subTitle ? 'h-[38px]' : 'h-[32px]'
          )}
          style={{ color: textColor }}
        >
          <span
            className="w-[4px] h-full mr-3 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          <div className="text-left flex flex-col justify-center">
            <div className="leading-snug break-words text-[16px] sm:text-[18px] md:text-xl">
              <span className="font-bold mr-[5px]">
                {pageTitleFirstWord}
              </span>
              <span className="font-light">
                {remainingPageTitleString}
              </span>
            </div>

            {subTitle && (
              <div className="text-[12px] leading-[14px] text-muted-foreground">
                {subTitle}
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {hasActions && (
          <div className="w-full sm:w-5/12 flex justify-end items-center gap-2">
            {customAction?.showBackButton && (
              <Button
                variant="ghost"
                type="button"
                onClick={customAction.onBack}
              >
                Back
              </Button>
            )}

            {/* Page Action Buttons */}
            {pageActionButtons.map((btn, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={btn.action}
              >
                {btn.icon && <btn.icon className="mr-2 h-4 w-4" />}
                {btn.label}
              </Button>
            ))}

            {/* Custom Action Button */}
            {customAction?.action && (
              <Button
                variant={customAction.buttonVariant || 'default'}
                size="sm"
                onClick={customAction.action}
              >
                {customAction.icon && <customAction.icon className="mr-2 h-4 w-4" />}
                {customAction.label || getAddActionLabel()}
              </Button>
            )}

            {/* Actions Dropdown */}
            {showImportExport && (
              <div className="relative">
                <Button
                  onClick={() => setIsOpen(!isOpen)}
                  className="gap-2"
                  style={{ backgroundColor: textColor }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Actions</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </Button>

                {isOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-popover shadow-lg">
                      {/* Add Action */}
                      {customAction?.action && (
                        <button
                          onClick={() => {
                            customAction.action();
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-sm hover:bg-muted"
                        >
                          <Plus className="mr-3 h-4 w-4" />
                          <span>{getAddActionLabel()}</span>
                        </button>
                      )}

                      {/* Import */}
                      <button
                        onClick={handleImportClick}
                        className="flex w-full items-center px-4 py-2.5 text-sm hover:bg-muted"
                      >
                        <Upload className="mr-3 h-4 w-4" />
                        <span>Import {getContextLabel()}</span>
                      </button>

                      {/* Export */}
                      <button
                        onClick={() => handleExport('csv')}
                        disabled={!exportData.length}
                        className={cn(
                          'flex w-full items-center px-4 py-2.5 text-sm',
                          exportData.length ? 'hover:bg-muted' : 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <FileDown className="mr-3 h-4 w-4" />
                        <span>Export {getContextLabel()} (CSV)</span>
                      </button>

                      {/* Download Template */}
                      {onTemplateDownload && (
                        <button
                          onClick={() => {
                            onTemplateDownload('csv');
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-sm hover:bg-muted"
                        >
                          <Download className="mr-3 h-4 w-4" />
                          <span>Download template</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv,.xlsx"
            />
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

// ProSuite Theme Colors
export const PROSUITE_COLORS = {
  // Primary brand colors
  primary: '#006EAD',
  accent: '#91BC4D',
  
  // Module-specific colors
  risk: { text: '#dc2626', accent: '#fecaca' },
  asset: { text: '#3b82f6', accent: '#bfdbfe' },
  compliance: { text: '#10b981', accent: '#a7f3d0' },
  governance: { text: '#8b5cf6', accent: '#ddd6fe' },
  incident: { text: '#f97316', accent: '#fed7aa' },
  audit: { text: '#06b6d4', accent: '#a5f3fc' },
  performance: { text: '#ec4899', accent: '#fbcfe8' },
};

export type ModuleColorKey = keyof Omit<typeof PROSUITE_COLORS, 'primary' | 'accent'>;

export function getModuleColors(module: ModuleColorKey) {
  return PROSUITE_COLORS[module] || { text: PROSUITE_COLORS.primary, accent: PROSUITE_COLORS.accent };
}
