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

interface Scorecard {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  owner_id: number;
  period: string;
  overall_score: number;
  status: string;
  created_date: string;
}

export default function PerformanceScorecardsPage() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Scorecard | null>(null);
  const [formData, setFormData] = useState<Partial<Scorecard>>({});

  const loadData = () => {
    setScorecards(getCollection<Scorecard>('performance.scorecards'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getScoreColor = (score: number) => score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#dc2626';

  const columns: Column<Scorecard>[] = [
    { key: 'name', header: 'Scorecard Name', sortable: true },
    { key: 'owner_id', header: 'Owner', render: (s) => getUserName(s.owner_id) },
    { key: 'period', header: 'Period' },
    { key: 'overall_score', header: 'Score', render: (s) => <Badge style={{ backgroundColor: getScoreColor(s.overall_score) }}>{s.overall_score}%</Badge> },
    { key: 'status', header: 'Status', render: (s) => (
      <Badge style={{ backgroundColor: s.status === 'Active' ? '#22c55e' : s.status === 'Draft' ? '#eab308' : '#6b7280' }}>{s.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', owner_id: 1, period: 'Q1 2026', overall_score: 0, status: 'Draft', created_date: new Date().toISOString().split('T')[0] });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Scorecard>('performance.scorecards', formData as Omit<Scorecard, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Scorecard>('performance.scorecards', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Scorecard>('performance.scorecards', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Scorecard Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Period</Label><Select value={formData.period || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, period: e.target.value })} options={[{ value: 'Q1 2026', label: 'Q1 2026' }, { value: 'Q2 2026', label: 'Q2 2026' }, { value: 'Q3 2026', label: 'Q3 2026' }, { value: 'Q4 2026', label: 'Q4 2026' }, { value: 'FY 2026', label: 'FY 2026' }]} /></div>
        <div><Label>Overall Score (%)</Label><Input type="number" min={0} max={100} value={formData.overall_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, overall_score: Number(e.target.value) })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }, { value: 'Archived', label: 'Archived' }]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Scorecards" description="Manage balanced scorecards" textColor={PROSUITE_COLORS.performance.text} accentColor={PROSUITE_COLORS.performance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="plus" size={16} className="mr-2" />New Scorecard</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={scorecards} columns={columns} searchKeys={['name', 'description', 'period']}
          onView={(s) => { setSelected(s); setIsViewOpen(true); }}
          onEdit={(s) => { setSelected(s); setFormData({ ...s }); setIsEditOpen(true); }}
          onDelete={(s) => { setSelected(s); setIsDeleteOpen(true); }}
          emptyMessage="No scorecards found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Scorecard</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Scorecard</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Period:</span><p className="font-medium">{selected.period}</p></div>
              <div><span className="text-muted-foreground">Overall Score:</span><Badge style={{ backgroundColor: getScoreColor(selected.overall_score) }}>{selected.overall_score}%</Badge></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Active' ? '#22c55e' : '#6b7280' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Created:</span><p className="font-medium">{selected.created_date}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Scorecard" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
