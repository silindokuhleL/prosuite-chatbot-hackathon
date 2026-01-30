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

interface ComplianceReport {
  id: number;
  tenant_id: number;
  title: string;
  report_type: string;
  regulation_id: number;
  author_id: number;
  generated_date: string;
  period_start: string;
  period_end: string;
  status: string;
  compliance_score: number;
  summary: string;
}

interface Regulation { id: number; name: string; }

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ComplianceReport | null>(null);
  const [formData, setFormData] = useState<Partial<ComplianceReport>>({});

  const loadData = () => {
    setReports(getCollection<ComplianceReport>('compliance.compliance_reports'));
    setRegulations(getCollection<Regulation>('compliance.regulations_standards'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getScoreColor = (score: number) => score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : '#dc2626';

  const columns: Column<ComplianceReport>[] = [
    { key: 'title', header: 'Report Title', sortable: true },
    { key: 'report_type', header: 'Type' },
    { key: 'regulation_id', header: 'Regulation', render: (r) => regulations.find(reg => reg.id === r.regulation_id)?.name || '-' },
    { key: 'compliance_score', header: 'Score', render: (r) => <Badge style={{ backgroundColor: getScoreColor(r.compliance_score) }}>{r.compliance_score}%</Badge> },
    { key: 'generated_date', header: 'Date', sortable: true },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge style={{ backgroundColor: r.status === 'Final' ? '#22c55e' : r.status === 'Draft' ? '#eab308' : '#3b82f6' }}>{r.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', report_type: 'Compliance Summary', regulation_id: regulations[0]?.id || 1, author_id: 1, generated_date: new Date().toISOString().split('T')[0], period_start: '', period_end: '', status: 'Draft', compliance_score: 100, summary: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<ComplianceReport>('compliance.compliance_reports', formData as Omit<ComplianceReport, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<ComplianceReport>('compliance.compliance_reports', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<ComplianceReport>('compliance.compliance_reports', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Report Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Report Type</Label><Select value={formData.report_type || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, report_type: e.target.value })} options={[{ value: 'Compliance Summary', label: 'Compliance Summary' }, { value: 'Gap Analysis', label: 'Gap Analysis' }, { value: 'Assessment Report', label: 'Assessment Report' }, { value: 'Audit Response', label: 'Audit Response' }]} /></div>
        <div><Label>Regulation</Label><Select value={formData.regulation_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, regulation_id: Number(e.target.value) })} options={regulations.map(r => ({ value: r.id, label: r.name }))} /></div>
        <div><Label>Author</Label><Select value={formData.author_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, author_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Compliance Score (%)</Label><Input type="number" min={0} max={100} value={formData.compliance_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, compliance_score: Number(e.target.value) })} /></div>
        <div><Label>Period Start</Label><Input type="date" value={formData.period_start || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, period_start: e.target.value })} /></div>
        <div><Label>Period End</Label><Input type="date" value={formData.period_end || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, period_end: e.target.value })} /></div>
        <div><Label>Report Date</Label><Input type="date" value={formData.generated_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, generated_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Under Review', label: 'Under Review' }, { value: 'Final', label: 'Final' }]} /></div>
        <div className="col-span-2"><Label>Summary</Label><Textarea value={formData.summary || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, summary: e.target.value })} rows={4} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Compliance Reports" description="Generate and view compliance reports" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Report</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={reports} columns={columns} searchKeys={['title', 'summary', 'report_type']}
          onView={(r) => { setSelected(r); setIsViewOpen(true); }}
          onEdit={(r) => { setSelected(r); setFormData({ ...r }); setIsEditOpen(true); }}
          onDelete={(r) => { setSelected(r); setIsDeleteOpen(true); }}
          emptyMessage="No compliance reports found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Compliance Report</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Compliance Report</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Report Type:</span><p className="font-medium">{selected.report_type}</p></div>
              <div><span className="text-muted-foreground">Regulation:</span><p className="font-medium">{regulations.find(r => r.id === selected.regulation_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Author:</span><p className="font-medium">{getUserName(selected.author_id)}</p></div>
              <div><span className="text-muted-foreground">Score:</span><Badge style={{ backgroundColor: getScoreColor(selected.compliance_score) }}>{selected.compliance_score}%</Badge></div>
              <div><span className="text-muted-foreground">Period:</span><p className="font-medium">{selected.period_start} to {selected.period_end}</p></div>
              <div><span className="text-muted-foreground">Date:</span><p className="font-medium">{selected.generated_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Final' ? '#22c55e' : '#eab308' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Summary:</span><p className="font-medium">{selected.summary}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Compliance Report" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
