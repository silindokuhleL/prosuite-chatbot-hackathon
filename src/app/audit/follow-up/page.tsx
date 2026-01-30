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

interface FollowUp {
  id: number;
  tenant_id: number;
  finding_id: number;
  title: string;
  description: string;
  assignee_id: number;
  due_date: string;
  status: string;
  verification_date: string;
  verified_by_id: number;
  notes: string;
}

interface Finding { id: number; title: string; }

export default function AuditFollowUpPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<FollowUp | null>(null);
  const [formData, setFormData] = useState<Partial<FollowUp>>({});

  const loadData = () => {
    setFollowUps(getCollection<FollowUp>('audit.finding_follow_ups'));
    setFindings(getCollection<Finding>('audit.audit_findings'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<FollowUp>[] = [
    { key: 'title', header: 'Follow-Up Item', sortable: true },
    { key: 'finding_id', header: 'Finding', render: (f) => findings.find(fd => fd.id === f.finding_id)?.title || '-' },
    { key: 'assignee_id', header: 'Assignee', render: (f) => getUserName(f.assignee_id) },
    { key: 'due_date', header: 'Due Date', sortable: true },
    { key: 'status', header: 'Status', render: (f) => (
      <Badge style={{ backgroundColor: f.status === 'Verified' ? '#22c55e' : f.status === 'In Progress' ? '#3b82f6' : f.status === 'Overdue' ? '#dc2626' : '#6b7280' }}>{f.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, finding_id: findings[0]?.id || 1, title: '', description: '', assignee_id: 1, due_date: '', status: 'Open', verification_date: '', verified_by_id: 0, notes: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<FollowUp>('audit.finding_follow_ups', formData as Omit<FollowUp, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<FollowUp>('audit.finding_follow_ups', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<FollowUp>('audit.finding_follow_ups', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Related Finding</Label><Select value={formData.finding_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, finding_id: Number(e.target.value) })} options={findings.map(f => ({ value: f.id, label: f.title }))} /></div>
        <div><Label>Assignee</Label><Select value={formData.assignee_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assignee_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Open', label: 'Open' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Pending Verification', label: 'Pending Verification' }, { value: 'Verified', label: 'Verified' }, { value: 'Overdue', label: 'Overdue' }]} /></div>
        <div><Label>Verification Date</Label><Input type="date" value={formData.verification_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, verification_date: e.target.value })} /></div>
        <div><Label>Verified By</Label><Select value={formData.verified_by_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, verified_by_id: Number(e.target.value) })} options={[{ value: 0, label: 'Not Verified' }, ...users.map(u => ({ value: u.id, label: u.name }))]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
        <div className="col-span-2"><Label>Notes</Label><Textarea value={formData.notes || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Finding Follow-Up" description="Track progress on audit finding remediation" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Follow-Up</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={followUps} columns={columns} searchKeys={['title', 'description', 'notes']}
          onView={(f) => { setSelected(f); setIsViewOpen(true); }}
          onEdit={(f) => { setSelected(f); setFormData({ ...f }); setIsEditOpen(true); }}
          onDelete={(f) => { setSelected(f); setIsDeleteOpen(true); }}
          emptyMessage="No follow-up items found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Follow-Up</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Follow-Up</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Finding:</span><p className="font-medium">{findings.find(f => f.id === selected.finding_id)?.title}</p></div>
              <div><span className="text-muted-foreground">Assignee:</span><p className="font-medium">{getUserName(selected.assignee_id)}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Verified' ? '#22c55e' : '#3b82f6' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Verification:</span><p className="font-medium">{selected.verification_date ? `${selected.verification_date} by ${getUserName(selected.verified_by_id)}` : 'Not verified'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Notes:</span><p className="font-medium">{selected.notes || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Follow-Up" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
