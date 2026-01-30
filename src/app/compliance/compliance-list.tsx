'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icons';
import { getCompliancePackages, getCompliancePackageStatuses } from '@/lib/data';

export function ComplianceList() {
  const router = useRouter();
  const packages = getCompliancePackages();
  const statuses = getCompliancePackageStatuses();

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#dc2626';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        const status = statuses.find(s => s.id === pkg.compliance_package_status_id);
        return (
          <Card 
            key={pkg.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/compliance/${pkg.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{pkg.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">v{pkg.version}</p>
                </div>
                <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {pkg.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Compliance Score</span>
                  <span 
                    className="font-bold"
                    style={{ color: getScoreColor(pkg.compliance_score) }}
                  >
                    {pkg.compliance_score}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${pkg.compliance_score}%`,
                      backgroundColor: getScoreColor(pkg.compliance_score),
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-lg font-bold">{pkg.completed_requirements}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-lg font-bold">{pkg.total_requirements}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  {pkg.overdue_requirements > 0 && (
                    <Badge color="#dc2626">
                      <Icon name="alertCircle" size={12} className="mr-1" />
                      {pkg.overdue_requirements} Overdue
                    </Badge>
                  )}
                  {pkg.pending_reviews_count > 0 && (
                    <Badge color="#f97316">
                      {pkg.pending_reviews_count} Pending
                    </Badge>
                  )}
                </div>
                <Icon name="chevronRight" size={16} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
