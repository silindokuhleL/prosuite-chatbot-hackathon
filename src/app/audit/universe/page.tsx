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

interface AuditUniverseItem {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  category_id: number;
  risk_rating_id: number;
  audit_cycle_id: number;
  last_audit_date: string;
  next_audit_date: string;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function AuditUniversePage() {
  const [items, setItems] = useState<AuditUniverseItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [riskRatings, setRiskRatings] = useState<LookupItem[]>([]);
  const [cycles, setCycles] = useState<LookupItem[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AuditUniverseItem | null>(null);
  const [formData, setFormData] = useState<Partial<AuditUniverseItem>>({});

  const loadData = () => {
    setItems(getCollection<AuditUniverseItem>('audit.audit_universe_items'));
    setCategories(getCollection<LookupItem>('audit.audit_universe_categories'));
    setRiskRatings(getCollection<LookupItem>('audit.audit_universe_risk_ratings'));
    setCycles(getCollection<LookupItem>('audit.audit_universe_audit_cycles'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<AuditUniverseItem>[] = [
    { key: 'name', header: 'Entity Name', sortable: true },
    { key: 'category_id', header: 'Category', render: (i) => categories.find(c => c.id === i.category_id)?.name || '-' },
    { key: 'risk_rating_id', header: 'Risk Rating', render: (i) => {
      const r = riskRatings.find(rr => rr.id === i.risk_rating_id);
      return <Badge style={{ backgroundColor: r?.color || '#6b7280' }}>{r?.name}</Badge>;
    }},
    { key: 'audit_cycle_id', header: 'Audit Cycle', render: (i) => cycles.find(c => c.id === i.audit_cycle_id)?.name || '-' },
    { key: 'last_audit_date', header: 'Last Audit', sortable: true },
    { key: 'next_audit_date', header: 'Next Audit', sortable: true },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', category_id: 1, risk_rating_id: 1, audit_cycle_id: 1, last_audit_date: '', next_audit_date: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<AuditUniverseItem>('audit.audit_universe_items', formData as Omit<AuditUniverseItem, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<AuditUniverseItem>('audit.audit_universe_items', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<AuditUniverseItem>('audit.audit_universe_items', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Entity Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Category</Label><Select value={formData.category_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category_id: Number(e.target.value) })} options={categories.map(c => ({ value: c.id, label: c.name }))} /></div>
        <div><Label>Risk Rating</Label><Select value={formData.risk_rating_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, risk_rating_id: Number(e.target.value) })} options={riskRatings.map(r => ({ value: r.id, label: r.name }))} /></div>
        <div><Label>Audit Cycle</Label><Select value={formData.audit_cycle_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, audit_cycle_id: Number(e.target.value) })} options={cycles.map(c => ({ value: c.id, label: c.name }))} /></div>
        <div><Label>Last Audit Date</Label><Input type="date" value={formData.last_audit_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, last_audit_date: e.target.value })} /></div>
        <div><Label>Next Audit Date</Label><Input type="date" value={formData.next_audit_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, next_audit_date: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Audit Universe" description="Define and manage auditable entities" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Entity</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={items} columns={columns} searchKeys={['name', 'description']}
          onView={(i) => { setSelected(i); setIsViewOpen(true); }}
          onEdit={(i) => { setSelected(i); setFormData({ ...i }); setIsEditOpen(true); }}
          onDelete={(i) => { setSelected(i); setIsDeleteOpen(true); }}
          emptyMessage="No audit universe items found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Entity</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Entity</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{categories.find(c => c.id === selected.category_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Risk Rating:</span><Badge style={{ backgroundColor: riskRatings.find(r => r.id === selected.risk_rating_id)?.color }}>{riskRatings.find(r => r.id === selected.risk_rating_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Audit Cycle:</span><p className="font-medium">{cycles.find(c => c.id === selected.audit_cycle_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Last Audit:</span><p className="font-medium">{selected.last_audit_date || '-'}</p></div>
              <div><span className="text-muted-foreground">Next Audit:</span><p className="font-medium">{selected.next_audit_date || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Entity" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
