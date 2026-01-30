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

interface Review {
  id: number;
  tenant_id: number;
  title: string;
  period: string;
  reviewer_id: number;
  review_date: string;
  status: string;
  findings: string;
  recommendations: string;
}

export default function PerformanceReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Review | null>(null);
  const [formData, setFormData] = useState<Partial<Review>>({});

  const loadData = () => {
    setReviews(getCollection<Review>('performance.reviews'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<Review>[] = [
    { key: 'title', header: 'Review Title', sortable: true },
    { key: 'period', header: 'Period' },
    { key: 'reviewer_id', header: 'Reviewer', render: (r) => getUserName(r.reviewer_id) },
    { key: 'review_date', header: 'Date', sortable: true },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge style={{ backgroundColor: r.status === 'Completed' ? '#22c55e' : r.status === 'In Progress' ? '#3b82f6' : '#eab308' }}>{r.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', period: 'Q1 2026', reviewer_id: 1, review_date: new Date().toISOString().split('T')[0], status: 'Scheduled', findings: '', recommendations: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<Review>('performance.reviews', formData as Omit<Review, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<Review>('performance.reviews', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Review>('performance.reviews', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Review Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Period</Label><Select value={formData.period || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, period: e.target.value })} options={[{ value: 'Q1 2026', label: 'Q1 2026' }, { value: 'Q2 2026', label: 'Q2 2026' }, { value: 'Q3 2026', label: 'Q3 2026' }, { value: 'Q4 2026', label: 'Q4 2026' }]} /></div>
        <div><Label>Reviewer</Label><Select value={formData.reviewer_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reviewer_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Review Date</Label><Input type="date" value={formData.review_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, review_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Scheduled', label: 'Scheduled' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }]} /></div>
        <div className="col-span-2"><Label>Findings</Label><Textarea value={formData.findings || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, findings: e.target.value })} rows={3} /></div>
        <div className="col-span-2"><Label>Recommendations</Label><Textarea value={formData.recommendations || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, recommendations: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Performance Reviews" description="Conduct and manage performance reviews" textColor={PROSUITE_COLORS.performance.text} accentColor={PROSUITE_COLORS.performance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="plus" size={16} className="mr-2" />New Review</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={reviews} columns={columns} searchKeys={['title', 'findings', 'recommendations']}
          onView={(r) => { setSelected(r); setIsViewOpen(true); }}
          onEdit={(r) => { setSelected(r); setFormData({ ...r }); setIsEditOpen(true); }}
          onDelete={(r) => { setSelected(r); setIsDeleteOpen(true); }}
          emptyMessage="No performance reviews found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Review</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Review</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Period:</span><p className="font-medium">{selected.period}</p></div>
              <div><span className="text-muted-foreground">Reviewer:</span><p className="font-medium">{getUserName(selected.reviewer_id)}</p></div>
              <div><span className="text-muted-foreground">Date:</span><p className="font-medium">{selected.review_date}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Completed' ? '#22c55e' : '#3b82f6' }}>{selected.status}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Findings:</span><p className="font-medium">{selected.findings || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Recommendations:</span><p className="font-medium">{selected.recommendations || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Review" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
