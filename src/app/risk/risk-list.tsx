'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { getRisks, getUser, getDepartment, getRiskCategory, getRiskScoreColor, getRiskScoreLabel } from '@/lib/data';
import type { Risk } from '@/types';

export function RiskList() {
  const router = useRouter();
  const risks = getRisks();

  const columns = [
    {
      key: 'risk_number',
      header: 'Risk ID',
      className: 'w-28',
      render: (risk: Risk) => (
        <span className="font-mono text-xs">{risk.risk_number}</span>
      ),
    },
    {
      key: 'title',
      header: 'Risk Title',
      render: (risk: Risk) => (
        <div>
          <p className="font-medium">{risk.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {risk.description}
          </p>
        </div>
      ),
    },
    {
      key: 'category_id',
      header: 'Category',
      className: 'hidden md:table-cell',
      render: (risk: Risk) => getRiskCategory(risk.category_id)?.name || '-',
    },
    {
      key: 'department_id',
      header: 'Department',
      className: 'hidden lg:table-cell',
      render: (risk: Risk) => getDepartment(risk.department_id)?.name || '-',
    },
    {
      key: 'owner_id',
      header: 'Owner',
      className: 'hidden md:table-cell',
      render: (risk: Risk) => getUser(risk.owner_id)?.name || '-',
    },
    {
      key: 'inherit_risk_score',
      header: 'Inherent Risk',
      className: 'w-32',
      render: (risk: Risk) => (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: getRiskScoreColor(risk.inherit_risk_score) }}
          />
          <span className="font-medium">{risk.inherit_risk_score}</span>
          <Badge color={getRiskScoreColor(risk.inherit_risk_score)}>
            {getRiskScoreLabel(risk.inherit_risk_score)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'residual_score',
      header: 'Residual',
      className: 'w-24 hidden lg:table-cell',
      render: (risk: Risk) => (
        <StatusBadge 
          status={String(risk.residual_score)} 
          color={getRiskScoreColor(risk.residual_score)} 
        />
      ),
    },
  ];

  return (
    <DataTable
      data={risks}
      columns={columns}
      onRowClick={(risk) => router.push(`/risk/${risk.id}`)}
      emptyMessage="No risks found"
    />
  );
}
