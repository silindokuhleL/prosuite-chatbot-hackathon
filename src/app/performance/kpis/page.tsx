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

interface KPI {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  owner_id: number;
  frequency: string;
  status: string;
}

export default function PerformanceKPIsPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<KPI | null>(null);
  const [formData, setFormData] = useState<Partial<KPI>>({});

  const loadData = () => {
    setKpis(getCollection<KPI>('performance.kpis'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getStatusColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio >= 1) return '#22c55e';
    if (ratio >= 0.7) return '#eab308';
    return '#dc2626';
  };

  const columns: Column<KPI>[] = [
    { key: 'name', header: 'KPI Name', sortable: true },
    { key: 'current_value', header: 'Current', render: (k) => `${k.current_value} ${k.unit}` },
    { key: 'target_value', header: 'Target', render: (k) => `${k.target_value} ${k.unit}` },
    { key: 'owner_id', header: 'Owner', render: (k) => getUserName(k.owner_id) },
    { key: 'frequency', header: 'Frequency' },
    { key: 'status', header: 'Status', render: (k) => (
      <Badge style={{ backgroundColor: getStatusColor(k.current_value, k.target_value) }}>
        {Math.round((k.current_value / k.target_value) * 100)}%
      </Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1, name: '', description: '', target_value: 100, current_value: 0,
      unit: '%', owner_id: 1, frequency: 'Monthly', status: 'Active',
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<KPI>('performance.kpis', formData as Omit<KPI, 'id'>);
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<KPI>('performance.kpis', selected.id, formData);
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<KPI>('performance.kpis', selected.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>KPI Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Target Value</Label><Input type="number" value={formData.target_value || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_value: Number(e.target.value) })} /></div>
        <div><Label>Current Value</Label><Input type="number" value={formData.current_value || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, current_value: Number(e.target.value) })} /></div>
        <div><Label>Unit</Label><Input value={formData.unit || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, unit: e.target.value })} placeholder="%, units, etc." /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Frequency</Label><Select value={formData.frequency || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, frequency: e.target.value })} options={[
          { value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' },
          { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }, { value: 'Annually', label: 'Annually' }
        ]} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[
          { value: 'Active', label: 'Active' }, { value: 'On Hold', label: 'On Hold' }, { value: 'Archived', label: 'Archived' }
        ]} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="KPIs" description="Define and track Key Performance Indicators" textColor={PROSUITE_COLORS.performance.text} accentColor={PROSUITE_COLORS.performance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="plus" size={16} className="mr-2" />New KPI</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={kpis} columns={columns} searchKeys={['name', 'description']}
          onView={(k) => { setSelected(k); setIsViewOpen(true); }}
          onEdit={(k) => { setSelected(k); setFormData({ ...k }); setIsEditOpen(true); }}
          onDelete={(k) => { setSelected(k); setIsDeleteOpen(true); }}
          emptyMessage="No KPIs found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create New KPI</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit KPI</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.performance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Current:</span><p className="font-medium">{selected.current_value} {selected.unit}</p></div>
              <div><span className="text-muted-foreground">Target:</span><p className="font-medium">{selected.target_value} {selected.unit}</p></div>
              <div><span className="text-muted-foreground">Progress:</span><Badge style={{ backgroundColor: getStatusColor(selected.current_value, selected.target_value) }}>{Math.round((selected.current_value / selected.target_value) * 100)}%</Badge></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Frequency:</span><p className="font-medium">{selected.frequency}</p></div>
              <div><span className="text-muted-foreground">Status:</span><p className="font-medium">{selected.status}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete KPI" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
