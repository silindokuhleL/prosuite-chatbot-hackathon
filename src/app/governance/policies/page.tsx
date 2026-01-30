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

interface Policy {
  id: number;
  tenant_id: number;
  title: string;
  version: string;
  category_id: number;
  owner_id: number;
  description: string;
  policy_content: string;
  effective_date: string | null;
  next_review_date: string | null;
  policy_status_id: number;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function GovernancePoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Policy | null>(null);
  const [formData, setFormData] = useState<Partial<Policy>>({});

  const loadData = () => {
    setPolicies(getCollection<Policy>('governance.governance_policies'));
    setCategories(getCollection<LookupItem>('governance.policy_categories'));
    setStatuses(getCollection<LookupItem>('governance.governance_policy_statuses'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Policy>[] = [
    { key: 'title', header: 'Title', sortable: true },
    { key: 'version', header: 'Version' },
    { key: 'category_id', header: 'Category', render: (p) => categories.find(c => c.id === p.category_id)?.name || '-' },
    { key: 'owner_id', header: 'Owner', render: (p) => getUserName(p.owner_id) },
    { key: 'effective_date', header: 'Effective Date', sortable: true },
    { key: 'policy_status_id', header: 'Status', render: (p) => {
      const st = statuses.find(s => s.id === p.policy_status_id);
      return <Badge style={{ backgroundColor: st?.color || '#6b7280' }}>{st?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1, title: '', version: '1.0', category_id: 1, owner_id: 1, description: '',
      policy_content: '', effective_date: null, next_review_date: null, policy_status_id: 1,
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Policy>('governance.governance_policies', formData as Omit<Policy, 'id'>);
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Policy>('governance.governance_policies', selected.id, formData);
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Policy>('governance.governance_policies', selected.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Version</Label><Input value={formData.version || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, version: e.target.value })} /></div>
        <div><Label>Category</Label><Select value={formData.category_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category_id: Number(e.target.value) })} options={categories.map(c => ({ value: c.id, label: c.name }))} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.policy_status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, policy_status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Effective Date</Label><Input type="date" value={formData.effective_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, effective_date: e.target.value || null })} /></div>
        <div><Label>Next Review Date</Label><Input type="date" value={formData.next_review_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, next_review_date: e.target.value || null })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
        <div className="col-span-2"><Label>Policy Content</Label><Textarea value={formData.policy_content || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, policy_content: e.target.value })} rows={4} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Policies" description="Manage organizational policies" textColor={PROSUITE_COLORS.governance.text} accentColor={PROSUITE_COLORS.governance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="plus" size={16} className="mr-2" />New Policy</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={policies} columns={columns} searchKeys={['title', 'description']}
          onView={(p) => { setSelected(p); setIsViewOpen(true); }}
          onEdit={(p) => { setSelected(p); setFormData({ ...p }); setIsEditOpen(true); }}
          onDelete={(p) => { setSelected(p); setIsDeleteOpen(true); }}
          emptyMessage="No policies found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create New Policy</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Policy</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.governance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Version:</span><p className="font-medium">{selected.version}</p></div>
              <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{categories.find(c => c.id === selected.category_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.policy_status_id)?.color }}>{statuses.find(s => s.id === selected.policy_status_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Effective Date:</span><p className="font-medium">{selected.effective_date || '-'}</p></div>
              <div><span className="text-muted-foreground">Next Review:</span><p className="font-medium">{selected.next_review_date || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Policy" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
