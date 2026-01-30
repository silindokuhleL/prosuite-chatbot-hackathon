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

interface Assessment {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  assessor_id: number;
  status_id: number;
  assessment_date: string;
  due_date: string;
  compliance_score: number;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function ComplianceAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState<Partial<Assessment>>({});

  const loadData = () => {
    setAssessments(getCollection<Assessment>('compliance.compliance_assessments'));
    setStatuses(getCollection<LookupItem>('compliance.compliance_assessment_statuses'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#eab308';
    return '#dc2626';
  };

  const columns: Column<Assessment>[] = [
    { key: 'title', header: 'Assessment', sortable: true },
    { key: 'assessor_id', header: 'Assessor', render: (a) => getUserName(a.assessor_id) },
    { key: 'assessment_date', header: 'Date', sortable: true },
    { key: 'due_date', header: 'Due Date', sortable: true },
    { key: 'compliance_score', header: 'Score', render: (a) => <Badge style={{ backgroundColor: getScoreColor(a.compliance_score) }}>{a.compliance_score}%</Badge> },
    { key: 'status_id', header: 'Status', render: (a) => {
      const s = statuses.find(st => st.id === a.status_id);
      return <Badge style={{ backgroundColor: s?.color || '#6b7280' }}>{s?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', assessor_id: 1, status_id: 1, assessment_date: new Date().toISOString().split('T')[0], due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], compliance_score: 0 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Assessment>('compliance.compliance_assessments', formData as Omit<Assessment, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Assessment>('compliance.compliance_assessments', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Assessment>('compliance.compliance_assessments', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Assessment Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Assessor</Label><Select value={formData.assessor_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assessor_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Assessment Date</Label><Input type="date" value={formData.assessment_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, assessment_date: e.target.value })} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div><Label>Compliance Score (%)</Label><Input type="number" min={0} max={100} value={formData.compliance_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, compliance_score: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Compliance Assessments" description="Conduct and manage compliance assessments" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Assessment</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={assessments} columns={columns} searchKeys={['title', 'description']}
          onView={(a) => { setSelected(a); setIsViewOpen(true); }}
          onEdit={(a) => { setSelected(a); setFormData({ ...a }); setIsEditOpen(true); }}
          onDelete={(a) => { setSelected(a); setIsDeleteOpen(true); }}
          emptyMessage="No assessments found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Assessment</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Assessment</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Assessor:</span><p className="font-medium">{getUserName(selected.assessor_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Assessment Date:</span><p className="font-medium">{selected.assessment_date}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div><span className="text-muted-foreground">Compliance Score:</span><Badge style={{ backgroundColor: getScoreColor(selected.compliance_score) }}>{selected.compliance_score}%</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Assessment" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
