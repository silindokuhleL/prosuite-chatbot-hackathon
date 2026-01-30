'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { getIncidents, getIncidentStatuses, getIncidentSeverityLevels, getUser, getDepartment } from '@/lib/data';
import type { Incident } from '@/types';

export function IncidentList() {
  const router = useRouter();
  const incidents = getIncidents();
  const statuses = getIncidentStatuses();
  const severityLevels = getIncidentSeverityLevels();

  const columns = [
    {
      key: 'id',
      header: 'ID',
      className: 'w-20',
      render: (incident: Incident) => (
        <span className="font-mono text-xs">INC-{String(incident.id).padStart(4, '0')}</span>
      ),
    },
    {
      key: 'title',
      header: 'Incident',
      render: (incident: Incident) => (
        <div>
          <p className="font-medium">{incident.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {incident.description}
          </p>
        </div>
      ),
    },
    {
      key: 'department_id',
      header: 'Department',
      className: 'hidden md:table-cell',
      render: (incident: Incident) => getDepartment(incident.department_id)?.name || '-',
    },
    {
      key: 'assignee_id',
      header: 'Assignee',
      className: 'hidden lg:table-cell',
      render: (incident: Incident) => getUser(incident.assignee_id)?.name || '-',
    },
    {
      key: 'date_occurred',
      header: 'Date',
      className: 'hidden md:table-cell w-28',
      render: (incident: Incident) => incident.date_occurred,
    },
    {
      key: 'severity_level_id',
      header: 'Severity',
      className: 'w-28',
      render: (incident: Incident) => {
        const severity = severityLevels.find(s => s.id === incident.severity_level_id);
        return (
          <StatusBadge
            status={severity?.name || '-'}
            color={severity?.color || '#6b7280'}
          />
        );
      },
    },
    {
      key: 'status_id',
      header: 'Status',
      className: 'w-32',
      render: (incident: Incident) => {
        const status = statuses.find(s => s.id === incident.status_id);
        return (
          <StatusBadge
            status={status?.name || '-'}
            color={status?.color || '#6b7280'}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      data={incidents}
      columns={columns}
      onRowClick={(incident) => router.push(`/incident/${incident.id}`)}
      emptyMessage="No incidents found"
    />
  );
}
