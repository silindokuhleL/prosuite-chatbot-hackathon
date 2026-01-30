'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { 
  getGovernancePolicies, 
  getGovernancePolicyStatuses,
  getBusinessObjectives,
  getBusinessObjectiveStatuses,
  getGovernanceCommittees,
  getGovernanceCommitteeStatuses,
  getUser,
  getPolicyCategories,
} from '@/lib/data';
import type { GovernancePolicy, BusinessObjective } from '@/types';

export function GovernanceOverview() {
  const router = useRouter();
  const policies = getGovernancePolicies();
  const policyStatuses = getGovernancePolicyStatuses();
  const policyCategories = getPolicyCategories();
  const objectives = getBusinessObjectives();
  const objectiveStatuses = getBusinessObjectiveStatuses();
  const committees = getGovernanceCommittees();
  const committeeStatuses = getGovernanceCommitteeStatuses();

  const policyColumns = [
    {
      key: 'title',
      header: 'Policy',
      render: (policy: GovernancePolicy) => (
        <div>
          <p className="font-medium">{policy.title}</p>
          <p className="text-xs text-muted-foreground">v{policy.version}</p>
        </div>
      ),
    },
    {
      key: 'category_id',
      header: 'Category',
      className: 'hidden md:table-cell',
      render: (policy: GovernancePolicy) => {
        const category = policyCategories.find(c => c.id === policy.category_id);
        return category?.name || '-';
      },
    },
    {
      key: 'owner_id',
      header: 'Owner',
      className: 'hidden lg:table-cell',
      render: (policy: GovernancePolicy) => getUser(policy.owner_id)?.name || '-',
    },
    {
      key: 'next_review_date',
      header: 'Next Review',
      className: 'hidden md:table-cell w-28',
      render: (policy: GovernancePolicy) => policy.next_review_date || '-',
    },
    {
      key: 'policy_status_id',
      header: 'Status',
      className: 'w-28',
      render: (policy: GovernancePolicy) => {
        const status = policyStatuses.find(s => s.id === policy.policy_status_id);
        return <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />;
      },
    },
  ];

  const objectiveColumns = [
    {
      key: 'title',
      header: 'Objective',
      render: (objective: BusinessObjective) => (
        <div>
          <p className="font-medium">{objective.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{objective.strategic_goal}</p>
        </div>
      ),
    },
    {
      key: 'owner_id',
      header: 'Owner',
      className: 'hidden md:table-cell',
      render: (objective: BusinessObjective) => getUser(objective.owner_id)?.name || '-',
    },
    {
      key: 'end_date',
      header: 'Target Date',
      className: 'hidden lg:table-cell w-28',
    },
    {
      key: 'status_id',
      header: 'Status',
      className: 'w-28',
      render: (objective: BusinessObjective) => {
        const status = objectiveStatuses.find(s => s.id === objective.status_id);
        return <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{policies.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Policies</p>
            <p className="text-xs text-muted-foreground">
              {policies.filter(p => p.policy_status_id === 3).length} Approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-blue-600">{objectives.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Strategic Objectives</p>
            <p className="text-xs text-muted-foreground">
              {objectives.filter(o => o.status_id === 2 || o.status_id === 3).length} Active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{committees.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Committees</p>
            <p className="text-xs text-muted-foreground">
              {committees.filter(c => c.status_id === 1).length} Active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Policies ({policies.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={policies}
            columns={policyColumns}
            onRowClick={(policy) => router.push(`/governance/policy/${policy.id}`)}
            emptyMessage="No policies found"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Strategic Objectives ({objectives.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={objectives}
            columns={objectiveColumns}
            onRowClick={(objective) => router.push(`/governance/objective/${objective.id}`)}
            emptyMessage="No objectives found"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Committees ({committees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {committees.map((committee) => {
              const status = committeeStatuses.find(s => s.id === committee.status_id);
              const chairperson = getUser(committee.chairperson_id);
              const secretary = getUser(committee.secretary_id);
              return (
                <div 
                  key={committee.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{committee.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Chair: {chairperson?.name || '-'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Secretary: {secretary?.name || '-'}
                      </p>
                    </div>
                    <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
