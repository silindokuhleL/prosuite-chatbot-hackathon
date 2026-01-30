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

interface COI {
  id: number;
  tenant_id: number;
  declarant_id: number;
  nature_of_conflict: string;
  parties_involved: string;
  declaration_date: string;
  status: string;
  resolution: string;
  reviewer_id: number;
}

export default function GovernanceCOIPage() {
  const [declarations, setDeclarations] = useState<COI[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<COI | null>(null);
  const [formData, setFormData] = useState<Partial<COI>>({});

  const loadData = () => {
    setDeclarations(getCollection<COI>('governance.conflict_of_interests'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<COI>[] = [
    { key: 'declarant_id', header: 'Declarant', render: (c) => getUserName(c.declarant_id) },
    { key: 'nature_of_conflict', header: 'Nature of Conflict', sortable: true },
    { key: 'parties_involved', header: 'Parties Involved' },
    { key: 'declaration_date', header: 'Date', sortable: true },
    { key: 'reviewer_id', header: 'Reviewer', render: (c) => getUserName(c.reviewer_id) },
    { key: 'status', header: 'Status', render: (c) => (
      <Badge style={{ backgroundColor: c.status === 'Resolved' ? '#22c55e' : c.status === 'Under Review' ? '#eab308' : c.status === 'Open' ? '#3b82f6' : '#6b7280' }}>{c.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, declarant_id: 1, nature_of_conflict: '', parties_involved: '', declaration_date: new Date().toISOString().split('T')[0], status: 'Open', resolution: '', reviewer_id: 1 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.nature_of_conflict) return;
    createItem<COI>('governance.conflict_of_interests', formData as Omit<COI, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.nature_of_conflict) return;
    updateItem<COI>('governance.conflict_of_interests', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<COI>('governance.conflict_of_interests', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Declarant</Label><Select value={formData.declarant_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, declarant_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Declaration Date</Label><Input type="date" value={formData.declaration_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, declaration_date: e.target.value })} /></div>
        <div className="col-span-2"><Label>Nature of Conflict *</Label><Textarea value={formData.nature_of_conflict || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, nature_of_conflict: e.target.value })} rows={2} /></div>
        <div className="col-span-2"><Label>Parties Involved</Label><Input value={formData.parties_involved || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, parties_involved: e.target.value })} /></div>
        <div><Label>Reviewer</Label><Select value={formData.reviewer_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reviewer_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Open', label: 'Open' }, { value: 'Under Review', label: 'Under Review' }, { value: 'Resolved', label: 'Resolved' }, { value: 'Closed', label: 'Closed' }]} /></div>
        <div className="col-span-2"><Label>Resolution</Label><Textarea value={formData.resolution || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, resolution: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Conflict of Interest" description="Manage conflict of interest declarations" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Declaration</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={declarations} columns={columns} searchKeys={['nature_of_conflict', 'parties_involved', 'resolution']}
          onView={(c) => { setSelected(c); setIsViewOpen(true); }}
          onEdit={(c) => { setSelected(c); setFormData({ ...c }); setIsEditOpen(true); }}
          onDelete={(c) => { setSelected(c); setIsDeleteOpen(true); }}
          emptyMessage="No conflict of interest declarations found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Declaration</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Declaration</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Conflict of Interest Declaration</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Declarant:</span><p className="font-medium">{getUserName(selected.declarant_id)}</p></div>
              <div><span className="text-muted-foreground">Date:</span><p className="font-medium">{selected.declaration_date}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Nature of Conflict:</span><p className="font-medium">{selected.nature_of_conflict}</p></div>
              <div><span className="text-muted-foreground">Parties:</span><p className="font-medium">{selected.parties_involved}</p></div>
              <div><span className="text-muted-foreground">Reviewer:</span><p className="font-medium">{getUserName(selected.reviewer_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Resolved' ? '#22c55e' : '#eab308' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Resolution:</span><p className="font-medium">{selected.resolution || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Declaration" description="Delete this conflict of interest declaration? This cannot be undone." onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
