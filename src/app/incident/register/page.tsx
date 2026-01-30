'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, Column } from '@/components/shared/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ConfirmDialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCollection, createItem, updateItem, deleteItem, getUserName } from '@/lib/crud';

interface Incident {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  reporter_id: number;
  department_id: number;
  assignee_id: number;
  due_date: string;
  date_occurred: string;
  type_id: number;
  category_id: number;
  priority_level_id: number;
  status_id: number;
  severity_level_id: number;
  site_id: number;
  location_id: number;
  root_cause: string;
  impact_details: string;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function IncidentRegisterPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [types, setTypes] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [severities, setSeverities] = useState<LookupItem[]>([]);
  const [priorities, setPriorities] = useState<LookupItem[]>([]);
  const [departments, setDepartments] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [formData, setFormData] = useState<Partial<Incident>>({});

  const loadData = () => {
    setIncidents(getCollection<Incident>('incident.incidents'));
    setTypes(getCollection<LookupItem>('incident.incident_types'));
    setStatuses(getCollection<LookupItem>('incident.incident_statuses'));
    setSeverities(getCollection<LookupItem>('incident.incident_severity_levels'));
    setPriorities(getCollection<LookupItem>('incident.incident_priority_levels'));
    setDepartments(getCollection<LookupItem>('core.departments'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Incident>[] = [
    { key: 'id', header: 'ID', sortable: true, render: (i) => `INC-${String(i.id).padStart(4, '0')}` },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'type_id', header: 'Type', render: (i) => types.find(t => t.id === i.type_id)?.name || '-' },
    { key: 'assignee_id', header: 'Assignee', render: (i) => getUserName(i.assignee_id) },
    { key: 'date_occurred', header: 'Date', sortable: true },
    { 
      key: 'severity_level_id', header: 'Severity',
      render: (i) => {
        const sev = severities.find(s => s.id === i.severity_level_id);
        return <Badge style={{ backgroundColor: sev?.color || '#6b7280' }}>{sev?.name}</Badge>;
      }
    },
    { 
      key: 'status_id', header: 'Status',
      render: (i) => {
        const st = statuses.find(s => s.id === i.status_id);
        return <Badge style={{ backgroundColor: st?.color || '#6b7280' }}>{st?.name}</Badge>;
      }
    },
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1, title: '', description: '', reporter_id: 1, department_id: 1, assignee_id: 1,
      due_date: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
      date_occurred: new Date().toISOString().split('T')[0],
      type_id: 1, category_id: 1, priority_level_id: 2, status_id: 1, severity_level_id: 3, site_id: 1, location_id: 1,
      root_cause: '', impact_details: '',
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Incident>('incident.incidents', formData as Omit<Incident, 'id'>);
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Incident>('incident.incidents', selected.id, formData);
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Incident>('incident.incidents', selected.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Title *</Label>
          <Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div><Label>Type</Label><Select value={formData.type_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type_id: Number(e.target.value) })} options={types.map(t => ({ value: t.id, label: t.name }))} /></div>
        <div><Label>Severity</Label><Select value={formData.severity_level_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, severity_level_id: Number(e.target.value) })} options={severities.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Priority</Label><Select value={formData.priority_level_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority_level_id: Number(e.target.value) })} options={priorities.map(p => ({ value: p.id, label: p.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Assignee</Label><Select value={formData.assignee_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assignee_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Department</Label><Select value={formData.department_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, department_id: Number(e.target.value) })} options={departments.map(d => ({ value: d.id, label: d.name }))} /></div>
        <div><Label>Date Occurred</Label><Input type="date" value={formData.date_occurred || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date_occurred: e.target.value })} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
        <div className="col-span-2"><Label>Root Cause</Label><Textarea value={formData.root_cause || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, root_cause: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Incident Register" description="View and manage all reported incidents" textColor={PROSUITE_COLORS.incident.text} accentColor={PROSUITE_COLORS.incident.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="plus" size={16} className="mr-2" />Report Incident</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={incidents} columns={columns} searchKeys={['title', 'description']}
          onView={(i) => { setSelected(i); setIsViewOpen(true); }}
          onEdit={(i) => { setSelected(i); setFormData({ ...i }); setIsEditOpen(true); }}
          onDelete={(i) => { setSelected(i); setIsDeleteOpen(true); }}
          emptyMessage="No incidents found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Report New Incident</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Incident</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Type:</span><p className="font-medium">{types.find(t => t.id === selected.type_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Severity:</span><Badge style={{ backgroundColor: severities.find(s => s.id === selected.severity_level_id)?.color }}>{severities.find(s => s.id === selected.severity_level_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Assignee:</span><p className="font-medium">{getUserName(selected.assignee_id)}</p></div>
              <div><span className="text-muted-foreground">Date Occurred:</span><p className="font-medium">{selected.date_occurred}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Root Cause:</span><p className="font-medium">{selected.root_cause || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Incident" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
