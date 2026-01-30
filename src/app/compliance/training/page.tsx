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

interface TrainingCampaign {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  owner_id: number;
  start_date: string;
  end_date: string;
  status: string;
  target_audience: string;
  completion_rate: number;
}

export default function ComplianceTrainingPage() {
  const [campaigns, setCampaigns] = useState<TrainingCampaign[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TrainingCampaign | null>(null);
  const [formData, setFormData] = useState<Partial<TrainingCampaign>>({});

  const loadData = () => {
    setCampaigns(getCollection<TrainingCampaign>('compliance.training_campaigns'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<TrainingCampaign>[] = [
    { key: 'title', header: 'Campaign', sortable: true },
    { key: 'owner_id', header: 'Owner', render: (c) => getUserName(c.owner_id) },
    { key: 'target_audience', header: 'Audience' },
    { key: 'start_date', header: 'Start', sortable: true },
    { key: 'end_date', header: 'End', sortable: true },
    { key: 'completion_rate', header: 'Completion', render: (c) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${c.completion_rate}%` }} />
        </div>
        <span className="text-xs">{c.completion_rate}%</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (c) => (
      <Badge style={{ backgroundColor: c.status === 'Active' ? '#22c55e' : c.status === 'Completed' ? '#3b82f6' : c.status === 'Draft' ? '#eab308' : '#6b7280' }}>{c.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', owner_id: 1, start_date: new Date().toISOString().split('T')[0], end_date: '', status: 'Draft', target_audience: 'All Staff', completion_rate: 0 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<TrainingCampaign>('compliance.training_campaigns', formData as Omit<TrainingCampaign, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<TrainingCampaign>('compliance.training_campaigns', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<TrainingCampaign>('compliance.training_campaigns', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Campaign Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Target Audience</Label><Select value={formData.target_audience || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, target_audience: e.target.value })} options={[{ value: 'All Staff', label: 'All Staff' }, { value: 'Management', label: 'Management' }, { value: 'IT Staff', label: 'IT Staff' }, { value: 'Finance', label: 'Finance' }, { value: 'Operations', label: 'Operations' }]} /></div>
        <div><Label>Start Date</Label><Input type="date" value={formData.start_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })} /></div>
        <div><Label>End Date</Label><Input type="date" value={formData.end_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }, { value: 'Completed', label: 'Completed' }, { value: 'Cancelled', label: 'Cancelled' }]} /></div>
        <div><Label>Completion Rate (%)</Label><Input type="number" min={0} max={100} value={formData.completion_rate || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, completion_rate: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Training & Awareness" description="Manage compliance training programs" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Campaign</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={campaigns} columns={columns} searchKeys={['title', 'description', 'target_audience']}
          onView={(c) => { setSelected(c); setIsViewOpen(true); }}
          onEdit={(c) => { setSelected(c); setFormData({ ...c }); setIsEditOpen(true); }}
          onDelete={(c) => { setSelected(c); setIsDeleteOpen(true); }}
          emptyMessage="No training campaigns found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Campaign</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Target Audience:</span><p className="font-medium">{selected.target_audience}</p></div>
              <div><span className="text-muted-foreground">Period:</span><p className="font-medium">{selected.start_date} to {selected.end_date || 'TBD'}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Completion:</span><p className="font-medium">{selected.completion_rate}%</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Campaign" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
