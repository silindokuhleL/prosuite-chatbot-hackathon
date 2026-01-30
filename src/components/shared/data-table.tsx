'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchKeys = [],
  onView,
  onEdit,
  onDelete,
  actions,
  emptyMessage = 'No items found',
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (!search || searchKeys.length === 0) return data;
    
    const lowerSearch = search.toLowerCase();
    return data.filter(item => 
      searchKeys.some(key => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, search, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const hasActions = onView || onEdit || onDelete || actions;

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-9"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {sortedData.length} item{sortedData.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                    col.sortable && 'cursor-pointer hover:text-foreground',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === String(col.key) && (
                      <Icon 
                        name={sortDir === 'asc' ? 'chevronUp' : 'chevronDown'} 
                        size={14} 
                      />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-32">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn('px-4 py-3 text-sm', col.className)}>
                      {col.render 
                        ? col.render(item) 
                        : String(getValue(item, String(col.key)) ?? '-')
                      }
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions?.(item)}
                        {onView && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onView(item)}
                            title="View"
                          >
                            <Icon name="eye" size={16} />
                          </Button>
                        )}
                        {onEdit && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <Icon name="edit" size={16} />
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onDelete(item)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon name="trash" size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <Icon name="chevronLeft" size={16} />
            </Button>
            <span className="text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <Icon name="chevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
