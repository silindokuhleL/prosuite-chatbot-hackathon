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

interface Objective {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  owner_id: number;
  target_date: string;
  status: string;
  progress: number;
  priority: string;
}

export default function GovernanceObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Objective | null>(null);
  const [formData, setFormData] = useState<Partial<Objective>>({});

  const loadData = () => {
    setObjectives(getCollection<Objective>('governance.business_objectives'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return '#22c55e';
    if (status === 'On Track') return '#3b82f6';
    if (status === 'At Risk') return '#eab308';
    if (status === 'Off Track') return '#dc2626';
    return '#6b7280';
  };

  const columns: Column<Objective>[] = [
    { key: 'title', header: 'Objective', sortable: true },
    { key: 'owner_id', header: 'Owner', render: (o) => getUserName(o.owner_id) },
    { key: 'target_date', header: 'Target Date', sortable: true },
    { key: 'progress', header: 'Progress', render: (o) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${o.progress}%` }} />
        </div>
        <span className="text-xs">{o.progress}%</span>
      </div>
    )},
    { key: 'priority', header: 'Priority' },
    { key: 'status', header: 'Status', render: (o) => <Badge style={{ backgroundColor: getStatusColor(o.status) }}>{o.status}</Badge> },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', owner_id: 1, target_date: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0], status: 'On Track', progress: 0, priority: 'Medium' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Objective>('governance.business_objectives', formData as Omit<Objective, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Objective>('governance.business_objectives', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Objective>('governance.business_objectives', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Objective Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Target Date</Label><Input type="date" value={formData.target_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_date: e.target.value })} /></div>
        <div><Label>Priority</Label><Select value={formData.priority || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value })} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'On Track', label: 'On Track' }, { value: 'At Risk', label: 'At Risk' }, { value: 'Off Track', label: 'Off Track' }, { value: 'Completed', label: 'Completed' }]} /></div>
        <div><Label>Progress %</Label><Input type="number" min={0} max={100} value={formData.progress || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, progress: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Objectives & Strategy" description="Define and track strategic objectives" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Objective</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={objectives} columns={columns} searchKeys={['title', 'description']}
          onView={(o) => { setSelected(o); setIsViewOpen(true); }}
          onEdit={(o) => { setSelected(o); setFormData({ ...o }); setIsEditOpen(true); }}
          onDelete={(o) => { setSelected(o); setIsDeleteOpen(true); }}
          emptyMessage="No objectives found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Objective</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Objective</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Target Date:</span><p className="font-medium">{selected.target_date}</p></div>
              <div><span className="text-muted-foreground">Priority:</span><p className="font-medium">{selected.priority}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: getStatusColor(selected.status) }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Progress:</span><p className="font-medium">{selected.progress}%</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Objective" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
