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

interface Delegation {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  delegator_id: number;
  delegate_id: number;
  authority_type: string;
  approval_limit: number;
  effective_date: string;
  expiry_date: string;
  status: string;
}

export default function GovernanceDelegationsPage() {
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Delegation | null>(null);
  const [formData, setFormData] = useState<Partial<Delegation>>({});

  const loadData = () => {
    setDelegations(getCollection<Delegation>('governance.delegations_of_authority'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Delegation>[] = [
    { key: 'title', header: 'Delegation', sortable: true },
    { key: 'delegator_id', header: 'From', render: (d) => getUserName(d.delegator_id) },
    { key: 'delegate_id', header: 'To', render: (d) => getUserName(d.delegate_id) },
    { key: 'authority_type', header: 'Authority Type' },
    { key: 'approval_limit', header: 'Limit', render: (d) => d.approval_limit ? `$${d.approval_limit.toLocaleString()}` : '-' },
    { key: 'expiry_date', header: 'Expires', sortable: true },
    { key: 'status', header: 'Status', render: (d) => (
      <Badge style={{ backgroundColor: d.status === 'Active' ? '#22c55e' : d.status === 'Pending' ? '#eab308' : '#6b7280' }}>{d.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', delegator_id: 1, delegate_id: 1, authority_type: 'Financial', approval_limit: 0, effective_date: new Date().toISOString().split('T')[0], expiry_date: '', status: 'Active' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Delegation>('governance.delegations_of_authority', formData as Omit<Delegation, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Delegation>('governance.delegations_of_authority', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Delegation>('governance.delegations_of_authority', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Delegator (From)</Label><Select value={formData.delegator_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, delegator_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Delegate (To)</Label><Select value={formData.delegate_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, delegate_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Authority Type</Label><Select value={formData.authority_type || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, authority_type: e.target.value })} options={[{ value: 'Financial', label: 'Financial' }, { value: 'Operational', label: 'Operational' }, { value: 'HR', label: 'HR' }, { value: 'Procurement', label: 'Procurement' }]} /></div>
        <div><Label>Approval Limit ($)</Label><Input type="number" min={0} value={formData.approval_limit || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, approval_limit: Number(e.target.value) })} /></div>
        <div><Label>Effective Date</Label><Input type="date" value={formData.effective_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, effective_date: e.target.value })} /></div>
        <div><Label>Expiry Date</Label><Input type="date" value={formData.expiry_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, expiry_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Active', label: 'Active' }, { value: 'Pending', label: 'Pending' }, { value: 'Expired', label: 'Expired' }, { value: 'Revoked', label: 'Revoked' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Delegations of Authority" description="Manage authority delegations" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Delegation</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={delegations} columns={columns} searchKeys={['title', 'description', 'authority_type']}
          onView={(d) => { setSelected(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelected(d); setFormData({ ...d }); setIsEditOpen(true); }}
          onDelete={(d) => { setSelected(d); setIsDeleteOpen(true); }}
          emptyMessage="No delegations found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Delegation</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Delegation</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Delegator:</span><p className="font-medium">{getUserName(selected.delegator_id)}</p></div>
              <div><span className="text-muted-foreground">Delegate:</span><p className="font-medium">{getUserName(selected.delegate_id)}</p></div>
              <div><span className="text-muted-foreground">Authority Type:</span><p className="font-medium">{selected.authority_type}</p></div>
              <div><span className="text-muted-foreground">Approval Limit:</span><p className="font-medium">${selected.approval_limit?.toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Effective Date:</span><p className="font-medium">{selected.effective_date}</p></div>
              <div><span className="text-muted-foreground">Expiry Date:</span><p className="font-medium">{selected.expiry_date || '-'}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Delegation" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
