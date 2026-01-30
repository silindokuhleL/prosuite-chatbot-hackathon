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

interface Committee {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  committee_type_id: number;
  chairperson_id: number;
  meeting_frequency: string;
  status: string;
}

interface LookupItem { id: number; name: string; }

export default function GovernanceCommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [types, setTypes] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Committee | null>(null);
  const [formData, setFormData] = useState<Partial<Committee>>({});

  const loadData = () => {
    setCommittees(getCollection<Committee>('governance.governance_committees'));
    setTypes(getCollection<LookupItem>('governance.committee_types'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Committee>[] = [
    { key: 'name', header: 'Committee Name', sortable: true },
    { key: 'committee_type_id', header: 'Type', render: (c) => types.find(t => t.id === c.committee_type_id)?.name || '-' },
    { key: 'chairperson_id', header: 'Chairperson', render: (c) => getUserName(c.chairperson_id) },
    { key: 'meeting_frequency', header: 'Meeting Frequency' },
    { key: 'status', header: 'Status', render: (c) => (
      <Badge style={{ backgroundColor: c.status === 'Active' ? '#22c55e' : '#6b7280' }}>{c.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', committee_type_id: 1, chairperson_id: 1, meeting_frequency: 'Monthly', status: 'Active' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Committee>('governance.governance_committees', formData as Omit<Committee, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Committee>('governance.governance_committees', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Committee>('governance.governance_committees', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Committee Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Type</Label><Select value={formData.committee_type_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, committee_type_id: Number(e.target.value) })} options={types.map(t => ({ value: t.id, label: t.name }))} /></div>
        <div><Label>Chairperson</Label><Select value={formData.chairperson_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, chairperson_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Meeting Frequency</Label><Select value={formData.meeting_frequency || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, meeting_frequency: e.target.value })} options={[{ value: 'Weekly', label: 'Weekly' }, { value: 'Bi-weekly', label: 'Bi-weekly' }, { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }]} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Committee Management" description="Manage governance committees" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Committee</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={committees} columns={columns} searchKeys={['name', 'description']}
          onView={(c) => { setSelected(c); setIsViewOpen(true); }}
          onEdit={(c) => { setSelected(c); setFormData({ ...c }); setIsEditOpen(true); }}
          onDelete={(c) => { setSelected(c); setIsDeleteOpen(true); }}
          emptyMessage="No committees found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Committee</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Committee</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Type:</span><p className="font-medium">{types.find(t => t.id === selected.committee_type_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Chairperson:</span><p className="font-medium">{getUserName(selected.chairperson_id)}</p></div>
              <div><span className="text-muted-foreground">Frequency:</span><p className="font-medium">{selected.meeting_frequency}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Committee" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
