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

interface RiskAssessment {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  assessor_id: number;
  assessment_date: string;
  status: string;
  findings_count: number;
  risk_score: number;
}

export default function RiskAssessmentsPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<RiskAssessment | null>(null);
  const [formData, setFormData] = useState<Partial<RiskAssessment>>({});

  const loadData = () => {
    setAssessments(getCollection<RiskAssessment>('risk.risk_assessments'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getScoreColor = (score: number) => {
    if (score <= 4) return '#22c55e';
    if (score <= 9) return '#eab308';
    if (score <= 16) return '#f97316';
    return '#dc2626';
  };

  const columns: Column<RiskAssessment>[] = [
    { key: 'title', header: 'Assessment', sortable: true },
    { key: 'assessor_id', header: 'Assessor', render: (a) => getUserName(a.assessor_id) },
    { key: 'assessment_date', header: 'Date', sortable: true },
    { key: 'findings_count', header: 'Findings', sortable: true },
    { key: 'risk_score', header: 'Risk Score', render: (a) => <Badge style={{ backgroundColor: getScoreColor(a.risk_score) }}>{a.risk_score}</Badge> },
    { key: 'status', header: 'Status', render: (a) => (
      <Badge style={{ backgroundColor: a.status === 'Completed' ? '#22c55e' : a.status === 'In Progress' ? '#3b82f6' : '#6b7280' }}>{a.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', assessor_id: 1, assessment_date: new Date().toISOString().split('T')[0], status: 'Planned', findings_count: 0, risk_score: 0 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<RiskAssessment>('risk.risk_assessments', formData as Omit<RiskAssessment, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<RiskAssessment>('risk.risk_assessments', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<RiskAssessment>('risk.risk_assessments', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Assessment Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Assessor</Label><Select value={formData.assessor_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assessor_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Assessment Date</Label><Input type="date" value={formData.assessment_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, assessment_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Planned', label: 'Planned' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }, { value: 'Cancelled', label: 'Cancelled' }]} /></div>
        <div><Label>Findings Count</Label><Input type="number" min={0} value={formData.findings_count || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, findings_count: Number(e.target.value) })} /></div>
        <div><Label>Risk Score</Label><Input type="number" min={0} max={25} value={formData.risk_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, risk_score: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Risk Assessments" description="Conduct and review risk assessments" textColor={PROSUITE_COLORS.risk.text} accentColor={PROSUITE_COLORS.risk.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="plus" size={16} className="mr-2" />New Assessment</Button>}
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
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Assessment</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Assessor:</span><p className="font-medium">{getUserName(selected.assessor_id)}</p></div>
              <div><span className="text-muted-foreground">Date:</span><p className="font-medium">{selected.assessment_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Completed' ? '#22c55e' : '#3b82f6' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Findings:</span><p className="font-medium">{selected.findings_count}</p></div>
              <div><span className="text-muted-foreground">Risk Score:</span><Badge style={{ backgroundColor: getScoreColor(selected.risk_score) }}>{selected.risk_score}</Badge></div>
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
