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

interface Finding {
  id: number;
  tenant_id: number;
  engagement_id: number;
  title: string;
  description: string;
  risk_rating_id: number;
  status_id: number;
  assigned_to_id: number;
  due_date: string;
  recommendation: string;
}

interface LookupItem { id: number; name: string; color?: string; }
interface Engagement { id: number; title: string; engagement_id: string; }

export default function AuditFindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [riskRatings, setRiskRatings] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Finding | null>(null);
  const [formData, setFormData] = useState<Partial<Finding>>({});

  const loadData = () => {
    setFindings(getCollection<Finding>('audit.audit_findings'));
    setEngagements(getCollection<Engagement>('audit.audit_engagements'));
    setRiskRatings(getCollection<LookupItem>('audit.audit_finding_risk_ratings'));
    setStatuses(getCollection<LookupItem>('audit.audit_finding_statuses'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Finding>[] = [
    { key: 'title', header: 'Finding', sortable: true },
    { key: 'engagement_id', header: 'Engagement', render: (f) => engagements.find(e => e.id === f.engagement_id)?.engagement_id || '-' },
    { key: 'risk_rating_id', header: 'Risk', render: (f) => {
      const r = riskRatings.find(rr => rr.id === f.risk_rating_id);
      return <Badge style={{ backgroundColor: r?.color || '#6b7280' }}>{r?.name}</Badge>;
    }},
    { key: 'assigned_to_id', header: 'Assigned To', render: (f) => getUserName(f.assigned_to_id) },
    { key: 'due_date', header: 'Due Date', sortable: true },
    { key: 'status_id', header: 'Status', render: (f) => {
      const s = statuses.find(st => st.id === f.status_id);
      return <Badge style={{ backgroundColor: s?.color || '#6b7280' }}>{s?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, engagement_id: engagements[0]?.id || 1, title: '', description: '', risk_rating_id: 2, status_id: 1, assigned_to_id: 1, due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], recommendation: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Finding>('audit.audit_findings', formData as Omit<Finding, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Finding>('audit.audit_findings', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Finding>('audit.audit_findings', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Finding Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Engagement</Label><Select value={formData.engagement_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, engagement_id: Number(e.target.value) })} options={engagements.map(e => ({ value: e.id, label: `${e.engagement_id} - ${e.title}` }))} /></div>
        <div><Label>Risk Rating</Label><Select value={formData.risk_rating_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, risk_rating_id: Number(e.target.value) })} options={riskRatings.map(r => ({ value: r.id, label: r.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Assigned To</Label><Select value={formData.assigned_to_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assigned_to_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
        <div className="col-span-2"><Label>Recommendation</Label><Textarea value={formData.recommendation || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, recommendation: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Audit Findings" description="Track and manage audit findings" textColor={PROSUITE_COLORS.audit.text} accentColor={PROSUITE_COLORS.audit.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="plus" size={16} className="mr-2" />New Finding</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={findings} columns={columns} searchKeys={['title', 'description']}
          onView={(f) => { setSelected(f); setIsViewOpen(true); }}
          onEdit={(f) => { setSelected(f); setFormData({ ...f }); setIsEditOpen(true); }}
          onDelete={(f) => { setSelected(f); setIsDeleteOpen(true); }}
          emptyMessage="No findings found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Finding</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Finding</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.audit.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Engagement:</span><p className="font-medium">{engagements.find(e => e.id === selected.engagement_id)?.title}</p></div>
              <div><span className="text-muted-foreground">Risk:</span><Badge style={{ backgroundColor: riskRatings.find(r => r.id === selected.risk_rating_id)?.color }}>{riskRatings.find(r => r.id === selected.risk_rating_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Assigned To:</span><p className="font-medium">{getUserName(selected.assigned_to_id)}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Recommendation:</span><p className="font-medium">{selected.recommendation}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Finding" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
