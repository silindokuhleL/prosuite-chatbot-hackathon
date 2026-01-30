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

interface Workpaper {
  id: number;
  tenant_id: number;
  engagement_id: number;
  title: string;
  description: string;
  workpaper_type_id: number;
  prepared_by_id: number;
  reviewed_by_id: number;
  status_id: number;
  reference_number: string;
}

interface LookupItem { id: number; name: string; color?: string; }
interface Engagement { id: number; title: string; engagement_id: string; }

export default function AuditWorkpapersPage() {
  const [workpapers, setWorkpapers] = useState<Workpaper[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [types, setTypes] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Workpaper | null>(null);
  const [formData, setFormData] = useState<Partial<Workpaper>>({});

  const loadData = () => {
    setWorkpapers(getCollection<Workpaper>('audit.audit_workpapers'));
    setEngagements(getCollection<Engagement>('audit.audit_engagements'));
    setTypes(getCollection<LookupItem>('audit.audit_workpaper_types'));
    setStatuses(getCollection<LookupItem>('audit.audit_workpaper_statuses'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Workpaper>[] = [
    { key: 'reference_number', header: 'Ref #', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'engagement_id', header: 'Engagement', render: (w) => engagements.find(e => e.id === w.engagement_id)?.engagement_id || '-' },
    { key: 'workpaper_type_id', header: 'Type', render: (w) => types.find(t => t.id === w.workpaper_type_id)?.name || '-' },
    { key: 'prepared_by_id', header: 'Prepared By', render: (w) => getUserName(w.prepared_by_id) },
    { key: 'status_id', header: 'Status', render: (w) => {
      const s = statuses.find(st => st.id === w.status_id);
      return <Badge style={{ backgroundColor: s?.color || '#6b7280' }}>{s?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, engagement_id: engagements[0]?.id || 1, title: '', description: '', workpaper_type_id: 1, prepared_by_id: 1, reviewed_by_id: 1, status_id: 1, reference_number: `WP-${Date.now().toString().slice(-6)}` });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Workpaper>('audit.audit_workpapers', formData as Omit<Workpaper, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Workpaper>('audit.audit_workpapers', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Workpaper>('audit.audit_workpapers', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Reference #</Label><Input value={formData.reference_number || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, reference_number: e.target.value })} /></div>
        <div><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Engagement</Label><Select value={formData.engagement_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, engagement_id: Number(e.target.value) })} options={engagements.map(e => ({ value: e.id, label: `${e.engagement_id} - ${e.title}` }))} /></div>
        <div><Label>Type</Label><Select value={formData.workpaper_type_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, workpaper_type_id: Number(e.target.value) })} options={types.map(t => ({ value: t.id, label: t.name }))} /></div>
        <div><Label>Prepared By</Label><Select value={formData.prepared_by_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, prepared_by_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Reviewed By</Label><Select value={formData.reviewed_by_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reviewed_by_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div className="col-span-2"><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Workpapers" description="Manage audit workpapers and documentation" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Workpaper</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={workpapers} columns={columns} searchKeys={['title', 'reference_number', 'description']}
          onView={(w) => { setSelected(w); setIsViewOpen(true); }}
          onEdit={(w) => { setSelected(w); setFormData({ ...w }); setIsEditOpen(true); }}
          onDelete={(w) => { setSelected(w); setIsDeleteOpen(true); }}
          emptyMessage="No workpapers found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Workpaper</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Workpaper</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Reference:</span><p className="font-medium">{selected.reference_number}</p></div>
              <div><span className="text-muted-foreground">Engagement:</span><p className="font-medium">{engagements.find(e => e.id === selected.engagement_id)?.title}</p></div>
              <div><span className="text-muted-foreground">Type:</span><p className="font-medium">{types.find(t => t.id === selected.workpaper_type_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Prepared By:</span><p className="font-medium">{getUserName(selected.prepared_by_id)}</p></div>
              <div><span className="text-muted-foreground">Reviewed By:</span><p className="font-medium">{getUserName(selected.reviewed_by_id)}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Workpaper" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
