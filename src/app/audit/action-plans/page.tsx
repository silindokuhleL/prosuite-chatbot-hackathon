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

interface CorrectiveAction {
  id: number;
  tenant_id: number;
  finding_id: number;
  title: string;
  description: string;
  owner_id: number;
  due_date: string;
  status: string;
  priority: string;
  completion_date: string;
}

interface Finding { id: number; title: string; }

export default function AuditActionPlansPage() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<CorrectiveAction | null>(null);
  const [formData, setFormData] = useState<Partial<CorrectiveAction>>({});

  const loadData = () => {
    setActions(getCollection<CorrectiveAction>('audit.corrective_actions'));
    setFindings(getCollection<Finding>('audit.audit_findings'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<CorrectiveAction>[] = [
    { key: 'title', header: 'Action', sortable: true },
    { key: 'finding_id', header: 'Finding', render: (a) => findings.find(f => f.id === a.finding_id)?.title || '-' },
    { key: 'owner_id', header: 'Owner', render: (a) => getUserName(a.owner_id) },
    { key: 'due_date', header: 'Due Date', sortable: true },
    { key: 'priority', header: 'Priority', render: (a) => (
      <Badge style={{ backgroundColor: a.priority === 'Critical' ? '#dc2626' : a.priority === 'High' ? '#f97316' : a.priority === 'Medium' ? '#eab308' : '#22c55e' }}>{a.priority}</Badge>
    )},
    { key: 'status', header: 'Status', render: (a) => (
      <Badge style={{ backgroundColor: a.status === 'Completed' ? '#22c55e' : a.status === 'In Progress' ? '#3b82f6' : a.status === 'Overdue' ? '#dc2626' : '#6b7280' }}>{a.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, finding_id: findings[0]?.id || 1, title: '', description: '', owner_id: 1, due_date: '', status: 'Open', priority: 'Medium', completion_date: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<CorrectiveAction>('audit.corrective_actions', formData as Omit<CorrectiveAction, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<CorrectiveAction>('audit.corrective_actions', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<CorrectiveAction>('audit.corrective_actions', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Action Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Related Finding</Label><Select value={formData.finding_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, finding_id: Number(e.target.value) })} options={findings.map(f => ({ value: f.id, label: f.title }))} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div><Label>Priority</Label><Select value={formData.priority || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value })} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Open', label: 'Open' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }, { value: 'Overdue', label: 'Overdue' }, { value: 'Cancelled', label: 'Cancelled' }]} /></div>
        <div><Label>Completion Date</Label><Input type="date" value={formData.completion_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, completion_date: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Corrective Actions" description="Manage corrective action plans for audit findings" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Action</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={actions} columns={columns} searchKeys={['title', 'description']}
          onView={(a) => { setSelected(a); setIsViewOpen(true); }}
          onEdit={(a) => { setSelected(a); setFormData({ ...a }); setIsEditOpen(true); }}
          onDelete={(a) => { setSelected(a); setIsDeleteOpen(true); }}
          emptyMessage="No corrective actions found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Corrective Action</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Corrective Action</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Finding:</span><p className="font-medium">{findings.find(f => f.id === selected.finding_id)?.title}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div><span className="text-muted-foreground">Priority:</span><Badge style={{ backgroundColor: selected.priority === 'Critical' ? '#dc2626' : '#eab308' }}>{selected.priority}</Badge></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Completed' ? '#22c55e' : '#3b82f6' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Completion Date:</span><p className="font-medium">{selected.completion_date || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Corrective Action" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
