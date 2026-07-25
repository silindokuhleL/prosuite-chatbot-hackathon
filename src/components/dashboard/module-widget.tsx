'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon, getModuleIconName } from '@/components/ui/icons';
import type { ModuleConfig } from '@/types';

interface ModuleWidgetProps {
  module: ModuleConfig;
  stats: {
    primary: { label: string; value: number | string };
    secondary?: { label: string; value: number | string };
    items?: { id: number; title: string; status?: string; statusColor?: string }[];
  };
}

export function ModuleWidget({ module, stats }: ModuleWidgetProps) {
  const iconName = getModuleIconName(module.slug);

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${module.color}15`, color: module.color }}
            >
              <Icon name={iconName} size={22} />
            </div>
            <div>
              <CardTitle className="text-base">{module.alias}</CardTitle>
              <p className="text-xs text-muted-foreground">{module.name}</p>
            </div>
          </div>
          <Link 
            href={module.routes.list}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Icon name="chevronRight" size={20} className="text-muted-foreground" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold" style={{ color: module.color }}>
              {stats.primary.value}
            </p>
            <p className="text-xs text-muted-foreground">{stats.primary.label}</p>
          </div>
          {stats.secondary && (
            <div className="text-right">
              <p className="text-lg font-semibold">{stats.secondary.value}</p>
              <p className="text-xs text-muted-foreground">{stats.secondary.label}</p>
            </div>
          )}
        </div>

        {stats.items && stats.items.length > 0 && (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">Recent Items</p>
            {stats.items.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate pr-2">{item.title}</span>
                {item.status && item.statusColor && (
                  <Badge color={item.statusColor} className="shrink-0">
                    {item.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        <Link
          href={module.routes.list}
          className="block text-center text-sm font-medium transition-colors hover:underline"
          style={{ color: module.color }}
        >
          View All →
        </Link>
      </CardContent>
    </Card>
  );
}
