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

interface Metric {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  category: string;
  unit: string;
  target_value: number;
  current_value: number;
  owner_id: number;
  frequency: string;
  status: string;
}

export default function PerformanceMetricsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Metric | null>(null);
  const [formData, setFormData] = useState<Partial<Metric>>({});

  const loadData = () => {
    setMetrics(getCollection<Metric>('performance.metrics'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getPerformance = (current: number, target: number) => {
    const pct = target > 0 ? (current / target) * 100 : 0;
    return { pct, color: pct >= 100 ? '#22c55e' : pct >= 80 ? '#eab308' : '#dc2626' };
  };

  const columns: Column<Metric>[] = [
    { key: 'name', header: 'Metric Name', sortable: true },
    { key: 'category', header: 'Category' },
    { key: 'current_value', header: 'Performance', render: (m) => {
      const { pct, color } = getPerformance(m.current_value, m.target_value);
      return <Badge style={{ backgroundColor: color }}>{pct.toFixed(0)}%</Badge>;
    }},
    { key: 'target_value', header: 'Target', render: (m) => `${m.target_value} ${m.unit}` },
    { key: 'owner_id', header: 'Owner', render: (m) => getUserName(m.owner_id) },
    { key: 'frequency', header: 'Frequency' },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', category: 'Financial', unit: '%', target_value: 100, current_value: 0, owner_id: 1, frequency: 'Monthly', status: 'Active' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Metric>('performance.metrics', formData as Omit<Metric, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Metric>('performance.metrics', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Metric>('performance.metrics', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Metric Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Category</Label><Select value={formData.category || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })} options={[{ value: 'Financial', label: 'Financial' }, { value: 'Customer', label: 'Customer' }, { value: 'Process', label: 'Process' }, { value: 'Learning', label: 'Learning & Growth' }]} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Unit</Label><Input value={formData.unit || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, unit: e.target.value })} /></div>
        <div><Label>Frequency</Label><Select value={formData.frequency || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, frequency: e.target.value })} options={[{ value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }]} /></div>
        <div><Label>Target Value</Label><Input type="number" value={formData.target_value || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_value: Number(e.target.value) })} /></div>
        <div><Label>Current Value</Label><Input type="number" value={formData.current_value || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, current_value: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Metrics" description="View and analyze performance metrics" textColor={PROSUITE_COLORS.performance.text} accentColor={PROSUITE_COLORS.performance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="plus" size={16} className="mr-2" />New Metric</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={metrics} columns={columns} searchKeys={['name', 'description', 'category']}
          onView={(m) => { setSelected(m); setIsViewOpen(true); }}
          onEdit={(m) => { setSelected(m); setFormData({ ...m }); setIsEditOpen(true); }}
          onDelete={(m) => { setSelected(m); setIsDeleteOpen(true); }}
          emptyMessage="No metrics found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Metric</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Metric</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{selected.category}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Target:</span><p className="font-medium">{selected.target_value} {selected.unit}</p></div>
              <div><span className="text-muted-foreground">Current:</span><p className="font-medium">{selected.current_value} {selected.unit}</p></div>
              <div><span className="text-muted-foreground">Performance:</span><Badge style={{ backgroundColor: getPerformance(selected.current_value, selected.target_value).color }}>{getPerformance(selected.current_value, selected.target_value).pct.toFixed(0)}%</Badge></div>
              <div><span className="text-muted-foreground">Frequency:</span><p className="font-medium">{selected.frequency}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Metric" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
