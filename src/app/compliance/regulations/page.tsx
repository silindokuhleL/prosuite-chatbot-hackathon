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

interface Regulation {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  issuing_body: string;
  effective_date: string;
  status: string;
  jurisdiction: string;
}

export default function ComplianceRegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Regulation | null>(null);
  const [formData, setFormData] = useState<Partial<Regulation>>({});

  const loadData = () => { setRegulations(getCollection<Regulation>('compliance.regulations_standards')); };
  useEffect(() => { loadData(); }, []);

  const columns: Column<Regulation>[] = [
    { key: 'name', header: 'Regulation/Standard', sortable: true },
    { key: 'issuing_body', header: 'Issuing Body' },
    { key: 'jurisdiction', header: 'Jurisdiction' },
    { key: 'effective_date', header: 'Effective Date', sortable: true },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge style={{ backgroundColor: r.status === 'Active' ? '#22c55e' : r.status === 'Pending' ? '#eab308' : '#6b7280' }}>{r.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', issuing_body: '', effective_date: new Date().toISOString().split('T')[0], status: 'Active', jurisdiction: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Regulation>('compliance.regulations_standards', formData as Omit<Regulation, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Regulation>('compliance.regulations_standards', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Regulation>('compliance.regulations_standards', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Issuing Body</Label><Input value={formData.issuing_body || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, issuing_body: e.target.value })} /></div>
        <div><Label>Jurisdiction</Label><Input value={formData.jurisdiction || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, jurisdiction: e.target.value })} /></div>
        <div><Label>Effective Date</Label><Input type="date" value={formData.effective_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, effective_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Active', label: 'Active' }, { value: 'Pending', label: 'Pending' }, { value: 'Superseded', label: 'Superseded' }, { value: 'Archived', label: 'Archived' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Regulations & Standards" description="Manage applicable regulations and standards" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Regulation</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={regulations} columns={columns} searchKeys={['name', 'description', 'issuing_body']}
          onView={(r) => { setSelected(r); setIsViewOpen(true); }}
          onEdit={(r) => { setSelected(r); setFormData({ ...r }); setIsEditOpen(true); }}
          onDelete={(r) => { setSelected(r); setIsDeleteOpen(true); }}
          emptyMessage="No regulations found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Regulation</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Regulation</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Issuing Body:</span><p className="font-medium">{selected.issuing_body}</p></div>
              <div><span className="text-muted-foreground">Jurisdiction:</span><p className="font-medium">{selected.jurisdiction}</p></div>
              <div><span className="text-muted-foreground">Effective Date:</span><p className="font-medium">{selected.effective_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Regulation" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
