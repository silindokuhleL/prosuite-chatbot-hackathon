'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icons';
import { getTasks, getIncidents, getRisks, getUser } from '@/lib/data';

interface ActivityItem {
  id: string;
  type: 'task' | 'incident' | 'risk';
  title: string;
  module: string;
  status: string;
  statusColor: string;
  assignee: string;
  timestamp: string;
}

export function RecentActivity() {
  const tasks = getTasks();
  const incidents = getIncidents();
  const risks = getRisks();

  const activities: ActivityItem[] = [
    ...tasks.map(task => ({
      id: `task-${task.id}`,
      type: 'task' as const,
      title: task.title,
      module: task.module,
      status: task.status,
      statusColor: task.status === 'Completed' ? '#22c55e' : task.status === 'In Progress' ? '#3b82f6' : '#6b7280',
      assignee: getUser(task.assignee_id)?.name || 'Unassigned',
      timestamp: '2h ago',
    })),
    ...incidents.slice(0, 3).map(incident => ({
      id: `incident-${incident.id}`,
      type: 'incident' as const,
      title: incident.title,
      module: 'incident',
      status: incident.status_id === 1 ? 'New' : incident.status_id === 2 ? 'Under Investigation' : 'Resolved',
      statusColor: incident.status_id === 1 ? '#3b82f6' : incident.status_id === 2 ? '#f97316' : '#22c55e',
      assignee: getUser(incident.assignee_id)?.name || 'Unassigned',
      timestamp: '1d ago',
    })),
    ...risks.slice(0, 2).map(risk => ({
      id: `risk-${risk.id}`,
      type: 'risk' as const,
      title: risk.title,
      module: 'risk',
      status: risk.inherit_risk_score >= 20 ? 'Critical' : risk.inherit_risk_score >= 13 ? 'High' : 'Medium',
      statusColor: risk.inherit_risk_score >= 20 ? '#dc2626' : risk.inherit_risk_score >= 13 ? '#f97316' : '#eab308',
      assignee: getUser(risk.owner_id)?.name || 'Unassigned',
      timestamp: '3d ago',
    })),
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return 'checkCircle';
      case 'incident': return 'incident';
      case 'risk': return 'risk';
      default: return 'activity';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.slice(0, 6).map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className="mt-0.5 rounded-lg bg-muted p-2">
              <Icon name={getTypeIcon(activity.type) as 'checkCircle' | 'incident' | 'risk' | 'activity'} size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activity.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge color={activity.statusColor} className="text-[10px]">
                  {activity.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.assignee}</span>
              </div>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
