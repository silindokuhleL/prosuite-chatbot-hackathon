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

interface AnnualPlan {
  id: number;
  tenant_id: number;
  title: string;
  year: number;
  description: string;
  owner_id: number;
  status: string;
  total_audits: number;
  completed_audits: number;
  start_date: string;
  end_date: string;
}

export default function AuditAnnualPlansPage() {
  const [plans, setPlans] = useState<AnnualPlan[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AnnualPlan | null>(null);
  const [formData, setFormData] = useState<Partial<AnnualPlan>>({});

  const loadData = () => {
    setPlans(getCollection<AnnualPlan>('audit.annual_audit_plans'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<AnnualPlan>[] = [
    { key: 'title', header: 'Plan Name', sortable: true },
    { key: 'year', header: 'Year', sortable: true },
    { key: 'owner_id', header: 'Owner', render: (p) => getUserName(p.owner_id) },
    { key: 'total_audits', header: 'Progress', render: (p) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${p.total_audits ? (p.completed_audits / p.total_audits * 100) : 0}%` }} />
        </div>
        <span className="text-xs">{p.completed_audits}/{p.total_audits}</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (p) => (
      <Badge style={{ backgroundColor: p.status === 'Active' ? '#22c55e' : p.status === 'Draft' ? '#eab308' : p.status === 'Completed' ? '#3b82f6' : '#6b7280' }}>{p.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', year: new Date().getFullYear(), description: '', owner_id: 1, status: 'Draft', total_audits: 0, completed_audits: 0, start_date: `${new Date().getFullYear()}-01-01`, end_date: `${new Date().getFullYear()}-12-31` });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<AnnualPlan>('audit.annual_audit_plans', formData as Omit<AnnualPlan, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<AnnualPlan>('audit.annual_audit_plans', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<AnnualPlan>('audit.annual_audit_plans', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Plan Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Year</Label><Input type="number" min={2020} max={2030} value={formData.year || new Date().getFullYear()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, year: Number(e.target.value) })} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Start Date</Label><Input type="date" value={formData.start_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })} /></div>
        <div><Label>End Date</Label><Input type="date" value={formData.end_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })} /></div>
        <div><Label>Total Audits</Label><Input type="number" min={0} value={formData.total_audits || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, total_audits: Number(e.target.value) })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }, { value: 'Completed', label: 'Completed' }, { value: 'Archived', label: 'Archived' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Annual Audit Plans" description="Plan and schedule audits for the year" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Plan</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={plans} columns={columns} searchKeys={['title', 'description']}
          onView={(p) => { setSelected(p); setIsViewOpen(true); }}
          onEdit={(p) => { setSelected(p); setFormData({ ...p }); setIsEditOpen(true); }}
          onDelete={(p) => { setSelected(p); setIsDeleteOpen(true); }}
          emptyMessage="No annual audit plans found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Annual Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Annual Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Year:</span><p className="font-medium">{selected.year}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Period:</span><p className="font-medium">{selected.start_date} to {selected.end_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Progress:</span><p className="font-medium">{selected.completed_audits} / {selected.total_audits} audits completed</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Annual Plan" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
