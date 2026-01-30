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

interface Control {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  control_type: string;
  owner_id: number;
  effectiveness_level_id: number;
  implementation_status: string;
  last_tested_date: string | null;
}

interface LookupItem { id: number; name: string; color?: string; value?: number; }

export default function RiskControlsPage() {
  const [controls, setControls] = useState<Control[]>([]);
  const [effectivenessLevels, setEffectivenessLevels] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Control | null>(null);
  const [formData, setFormData] = useState<Partial<Control>>({});

  const loadData = () => {
    setControls(getCollection<Control>('risk.controls'));
    setEffectivenessLevels(getCollection<LookupItem>('risk.risk_control_effectiveness_levels'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getEffectivenessColor = (id: number) => {
    const level = effectivenessLevels.find(l => l.id === id);
    if (!level) return '#6b7280';
    if (level.value && level.value >= 4) return '#22c55e';
    if (level.value && level.value >= 3) return '#eab308';
    return '#dc2626';
  };

  const columns: Column<Control>[] = [
    { key: 'name', header: 'Control Name', sortable: true },
    { key: 'control_type', header: 'Type' },
    { key: 'owner_id', header: 'Owner', render: (c) => getUserName(c.owner_id) },
    { key: 'implementation_status', header: 'Status', render: (c) => (
      <Badge style={{ backgroundColor: c.implementation_status === 'Implemented' ? '#22c55e' : c.implementation_status === 'In Progress' ? '#eab308' : '#6b7280' }}>{c.implementation_status}</Badge>
    )},
    { key: 'effectiveness_level_id', header: 'Effectiveness', render: (c) => {
      const level = effectivenessLevels.find(l => l.id === c.effectiveness_level_id);
      return <Badge style={{ backgroundColor: getEffectivenessColor(c.effectiveness_level_id) }}>{level?.name || '-'}</Badge>;
    }},
    { key: 'last_tested_date', header: 'Last Tested', render: (c) => c.last_tested_date || 'Never' },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', control_type: 'Preventive', owner_id: 1, effectiveness_level_id: 3, implementation_status: 'Planned', last_tested_date: null });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Control>('risk.controls', formData as Omit<Control, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Control>('risk.controls', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Control>('risk.controls', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Control Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Control Type</Label><Select value={formData.control_type || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, control_type: e.target.value })} options={[{ value: 'Preventive', label: 'Preventive' }, { value: 'Detective', label: 'Detective' }, { value: 'Corrective', label: 'Corrective' }, { value: 'Directive', label: 'Directive' }]} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Implementation Status</Label><Select value={formData.implementation_status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, implementation_status: e.target.value })} options={[{ value: 'Planned', label: 'Planned' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Implemented', label: 'Implemented' }, { value: 'Not Applicable', label: 'Not Applicable' }]} /></div>
        <div><Label>Effectiveness</Label><Select value={formData.effectiveness_level_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, effectiveness_level_id: Number(e.target.value) })} options={effectivenessLevels.map(l => ({ value: l.id, label: l.name }))} /></div>
        <div><Label>Last Tested Date</Label><Input type="date" value={formData.last_tested_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, last_tested_date: e.target.value || null })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Risk Controls" description="Manage controls to mitigate organizational risks" textColor={PROSUITE_COLORS.risk.text} accentColor={PROSUITE_COLORS.risk.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="plus" size={16} className="mr-2" />New Control</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={controls} columns={columns} searchKeys={['name', 'description']}
          onView={(c) => { setSelected(c); setIsViewOpen(true); }}
          onEdit={(c) => { setSelected(c); setFormData({ ...c }); setIsEditOpen(true); }}
          onDelete={(c) => { setSelected(c); setIsDeleteOpen(true); }}
          emptyMessage="No controls found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Control</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Control</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Type:</span><p className="font-medium">{selected.control_type}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.implementation_status === 'Implemented' ? '#22c55e' : '#eab308' }}>{selected.implementation_status}</Badge></div>
              <div><span className="text-muted-foreground">Effectiveness:</span><Badge style={{ backgroundColor: getEffectivenessColor(selected.effectiveness_level_id) }}>{effectivenessLevels.find(l => l.id === selected.effectiveness_level_id)?.name}</Badge></div>
              <div><span className="text-muted-foreground">Last Tested:</span><p className="font-medium">{selected.last_tested_date || 'Never'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Control" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
