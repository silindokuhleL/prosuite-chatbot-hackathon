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

interface BCPlan {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  owner_id: number;
  status: string;
  last_tested: string;
  next_review: string;
  rto_hours: number;
  rpo_hours: number;
}

export default function GovernanceBCPPage() {
  const [plans, setPlans] = useState<BCPlan[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<BCPlan | null>(null);
  const [formData, setFormData] = useState<Partial<BCPlan>>({});

  const loadData = () => {
    setPlans(getCollection<BCPlan>('governance.business_continuity_plans'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<BCPlan>[] = [
    { key: 'title', header: 'Plan Name', sortable: true },
    { key: 'owner_id', header: 'Owner', render: (p) => getUserName(p.owner_id) },
    { key: 'rto_hours', header: 'RTO (hrs)' },
    { key: 'rpo_hours', header: 'RPO (hrs)' },
    { key: 'last_tested', header: 'Last Tested', sortable: true },
    { key: 'next_review', header: 'Next Review', sortable: true },
    { key: 'status', header: 'Status', render: (p) => (
      <Badge style={{ backgroundColor: p.status === 'Active' ? '#22c55e' : p.status === 'Draft' ? '#eab308' : '#6b7280' }}>{p.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', owner_id: 1, status: 'Draft', last_tested: '', next_review: '', rto_hours: 4, rpo_hours: 1 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<BCPlan>('governance.business_continuity_plans', formData as Omit<BCPlan, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<BCPlan>('governance.business_continuity_plans', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<BCPlan>('governance.business_continuity_plans', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Plan Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }, { value: 'Under Review', label: 'Under Review' }, { value: 'Archived', label: 'Archived' }]} /></div>
        <div><Label>RTO (hours)</Label><Input type="number" min={0} value={formData.rto_hours || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, rto_hours: Number(e.target.value) })} /></div>
        <div><Label>RPO (hours)</Label><Input type="number" min={0} value={formData.rpo_hours || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, rpo_hours: Number(e.target.value) })} /></div>
        <div><Label>Last Tested</Label><Input type="date" value={formData.last_tested || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, last_tested: e.target.value })} /></div>
        <div><Label>Next Review</Label><Input type="date" value={formData.next_review || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, next_review: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Business Continuity" description="Manage business continuity plans" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Plan</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={plans} columns={columns} searchKeys={['title', 'description']}
          onView={(p) => { setSelected(p); setIsViewOpen(true); }}
          onEdit={(p) => { setSelected(p); setFormData({ ...p }); setIsEditOpen(true); }}
          onDelete={(p) => { setSelected(p); setIsDeleteOpen(true); }}
          emptyMessage="No business continuity plans found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">RTO:</span><p className="font-medium">{selected.rto_hours} hours</p></div>
              <div><span className="text-muted-foreground">RPO:</span><p className="font-medium">{selected.rpo_hours} hours</p></div>
              <div><span className="text-muted-foreground">Last Tested:</span><p className="font-medium">{selected.last_tested || '-'}</p></div>
              <div><span className="text-muted-foreground">Next Review:</span><p className="font-medium">{selected.next_review || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Plan" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
