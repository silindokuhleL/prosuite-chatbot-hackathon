'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border p-4 last:border-0">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <div>
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse blur-[2px] opacity-70', className)}>
      <div className="space-y-4">
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="h-64 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="animate-pulse blur-[1px] opacity-80 space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="animate-pulse blur-[1px] opacity-80 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
