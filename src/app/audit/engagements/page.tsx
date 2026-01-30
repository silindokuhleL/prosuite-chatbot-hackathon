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

interface AuditEngagement {
  id: number;
  tenant_id: number;
  engagement_id: string;
  title: string;
  lead_auditor_id: number;
  start_date: string;
  end_date: string;
  scope: string;
  status_id: number;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function AuditEngagementsPage() {
  const [engagements, setEngagements] = useState<AuditEngagement[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AuditEngagement | null>(null);
  const [formData, setFormData] = useState<Partial<AuditEngagement>>({});

  const loadData = () => {
    setEngagements(getCollection<AuditEngagement>('audit.audit_engagements'));
    setStatuses(getCollection<LookupItem>('audit.audit_engagement_statuses'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<AuditEngagement>[] = [
    { key: 'engagement_id', header: 'Engagement ID', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'lead_auditor_id', header: 'Lead Auditor', render: (e) => getUserName(e.lead_auditor_id) },
    { key: 'start_date', header: 'Start Date', sortable: true },
    { key: 'end_date', header: 'End Date', sortable: true },
    { key: 'status_id', header: 'Status', render: (e) => {
      const st = statuses.find(s => s.id === e.status_id);
      return <Badge style={{ backgroundColor: st?.color || '#6b7280' }}>{st?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    const nextId = `AE-${new Date().getFullYear()}-${String(engagements.length + 1).padStart(3, '0')}`;
    setFormData({
      tenant_id: 1, engagement_id: nextId, title: '', lead_auditor_id: 4,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      scope: '', status_id: 1,
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<AuditEngagement>('audit.audit_engagements', formData as Omit<AuditEngagement, 'id'>);
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<AuditEngagement>('audit.audit_engagements', selected.id, formData);
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<AuditEngagement>('audit.audit_engagements', selected.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Engagement ID</Label><Input value={formData.engagement_id || ''} disabled /></div>
        <div><Label>Lead Auditor</Label><Select value={formData.lead_auditor_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, lead_auditor_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Start Date</Label><Input type="date" value={formData.start_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })} /></div>
        <div><Label>End Date</Label><Input type="date" value={formData.end_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div className="col-span-2"><Label>Scope</Label><Textarea value={formData.scope || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, scope: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Audit Engagements" description="Manage active and planned audit engagements" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Engagement</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={engagements} columns={columns} searchKeys={['title', 'engagement_id', 'scope']}
          onView={(e) => { setSelected(e); setIsViewOpen(true); }}
          onEdit={(e) => { setSelected(e); setFormData({ ...e }); setIsEditOpen(true); }}
          onDelete={(e) => { setSelected(e); setIsDeleteOpen(true); }}
          emptyMessage="No audit engagements found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create New Engagement</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Engagement</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Engagement ID:</span><p className="font-medium">{selected.engagement_id}</p></div>
              <div><span className="text-muted-foreground">Lead Auditor:</span><p className="font-medium">{getUserName(selected.lead_auditor_id)}</p></div>
              <div><span className="text-muted-foreground">Start Date:</span><p className="font-medium">{selected.start_date}</p></div>
              <div><span className="text-muted-foreground">End Date:</span><p className="font-medium">{selected.end_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Scope:</span><p className="font-medium">{selected.scope}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Engagement" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
