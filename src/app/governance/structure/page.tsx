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
import { getCollection, createItem, updateItem, deleteItem } from '@/lib/crud';

interface OrgUnit {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  description: string;
  parent_id: number | null;
  head_id: number;
  level: string;
  status: string;
}

export default function GovernanceStructurePage() {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<OrgUnit | null>(null);
  const [formData, setFormData] = useState<Partial<OrgUnit>>({});

  const loadData = () => {
    setUnits(getCollection<OrgUnit>('core.departments'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<OrgUnit>[] = [
    { key: 'code', header: 'Code', sortable: true },
    { key: 'name', header: 'Unit Name', sortable: true },
    { key: 'level', header: 'Level' },
    { key: 'parent_id', header: 'Reports To', render: (u) => units.find(p => p.id === u.parent_id)?.name || 'N/A' },
    { key: 'head_id', header: 'Head', render: (u) => users.find(usr => usr.id === u.head_id)?.name || '-' },
    { key: 'status', header: 'Status', render: (u) => (
      <Badge style={{ backgroundColor: u.status === 'Active' ? '#22c55e' : '#6b7280' }}>{u.status || 'Active'}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', code: '', description: '', parent_id: null, head_id: 1, level: 'Department', status: 'Active' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<OrgUnit>('core.departments', formData as Omit<OrgUnit, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<OrgUnit>('core.departments', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<OrgUnit>('core.departments', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Code *</Label><Input value={formData.code || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })} /></div>
        <div><Label>Unit Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Level</Label><Select value={formData.level || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, level: e.target.value })} options={[{ value: 'Division', label: 'Division' }, { value: 'Department', label: 'Department' }, { value: 'Unit', label: 'Unit' }, { value: 'Team', label: 'Team' }]} /></div>
        <div><Label>Reports To</Label><Select value={formData.parent_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })} options={[{ value: '', label: 'None (Top Level)' }, ...units.filter(u => u.id !== selected?.id).map(u => ({ value: u.id, label: u.name }))]} /></div>
        <div><Label>Head</Label><Select value={formData.head_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, head_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Organisational Structure" description="View and manage organizational hierarchy" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Unit</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={units} columns={columns} searchKeys={['name', 'code', 'description']}
          onView={(u) => { setSelected(u); setIsViewOpen(true); }}
          onEdit={(u) => { setSelected(u); setFormData({ ...u }); setIsEditOpen(true); }}
          onDelete={(u) => { setSelected(u); setIsDeleteOpen(true); }}
          emptyMessage="No organizational units found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Organizational Unit</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Organizational Unit</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Code:</span><p className="font-medium">{selected.code}</p></div>
              <div><span className="text-muted-foreground">Level:</span><p className="font-medium">{selected.level || 'Department'}</p></div>
              <div><span className="text-muted-foreground">Reports To:</span><p className="font-medium">{units.find(u => u.id === selected.parent_id)?.name || 'N/A'}</p></div>
              <div><span className="text-muted-foreground">Head:</span><p className="font-medium">{users.find(u => u.id === selected.head_id)?.name || '-'}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status || 'Active'}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Organizational Unit" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
