import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { 
  getIncident, 
  getUser, 
  getDepartment, 
  getIncidentStatuses, 
  getIncidentSeverityLevels,
  getIncidentTypes,
  getIncidentCategories,
  getIncidentTasksByIncident,
  getIncidentTaskStatuses,
  getSites,
  getLocations,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IncidentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const incident = getIncident(Number(id));

  if (!incident) {
    notFound();
  }

  const reporter = getUser(incident.reporter_id);
  const assignee = getUser(incident.assignee_id);
  const department = getDepartment(incident.department_id);
  const statuses = getIncidentStatuses();
  const status = statuses.find(s => s.id === incident.status_id);
  const severityLevels = getIncidentSeverityLevels();
  const severity = severityLevels.find(s => s.id === incident.severity_level_id);
  const types = getIncidentTypes();
  const incidentType = types.find(t => t.id === incident.type_id);
  const categories = getIncidentCategories();
  const category = categories.find(c => c.id === incident.category_id);
  const tasks = getIncidentTasksByIncident(incident.id);
  const taskStatuses = getIncidentTaskStatuses();
  const sites = getSites();
  const site = sites.find(s => s.id === incident.site_id);
  const locations = getLocations();
  const location = locations.find(l => l.id === incident.location_id);

  return (
    <AppLayout>
      <PageHeader
        title={incident.title}
        description={`INC-${String(incident.id).padStart(4, '0')}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Incident Management', href: '/incident' },
          { label: `INC-${String(incident.id).padStart(4, '0')}` },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="download" size={16} className="mr-2" />
              Export
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="mt-1 text-sm">{incident.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <p className="mt-1 text-sm">{incidentType?.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="mt-1 text-sm">{category?.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                  <p className="mt-1 text-sm">{department?.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p className="mt-1 text-sm">{site?.name} - {location?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Reporter</h4>
                  <p className="mt-1 text-sm">{reporter?.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Assignee</h4>
                  <p className="mt-1 text-sm">{assignee?.name || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <div className="mt-2">
                  <StatusBadge status={status?.name || '-'} color={status?.color || '#6b7280'} />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Severity Level</p>
                <div className="mt-2">
                  <StatusBadge status={severity?.name || '-'} color={severity?.color || '#6b7280'} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Date Occurred</p>
                  <p className="mt-1 text-sm font-medium">{incident.date_occurred}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="mt-1 text-sm font-medium">{incident.due_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Root Cause Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{incident.root_cause || 'Root cause analysis pending'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Impact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{incident.impact_details || 'Impact assessment pending'}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks created</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const taskStatus = taskStatuses.find(s => s.id === task.status_id);
                  const taskAssignee = getUser(task.assigned_to);
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: {taskAssignee?.name || '-'}
                        </p>
                      </div>
                      <StatusBadge 
                        status={taskStatus?.name || '-'} 
                        color={taskStatus?.color || '#6b7280'} 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
