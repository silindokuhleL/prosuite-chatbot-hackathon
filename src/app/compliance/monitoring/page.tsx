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

interface MonitoringItem {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  regulation_id: number;
  owner_id: number;
  status: string;
  compliance_score: number;
  last_checked: string;
  next_review: string;
}

interface Regulation { id: number; name: string; }

export default function ComplianceMonitoringPage() {
  const [items, setItems] = useState<MonitoringItem[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<MonitoringItem | null>(null);
  const [formData, setFormData] = useState<Partial<MonitoringItem>>({});

  const loadData = () => {
    setItems(getCollection<MonitoringItem>('compliance.compliance_monitoring'));
    setRegulations(getCollection<Regulation>('compliance.regulations_standards'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#eab308';
    return '#dc2626';
  };

  const columns: Column<MonitoringItem>[] = [
    { key: 'title', header: 'Control', sortable: true },
    { key: 'regulation_id', header: 'Regulation', render: (i) => regulations.find(r => r.id === i.regulation_id)?.name || '-' },
    { key: 'owner_id', header: 'Owner', render: (i) => getUserName(i.owner_id) },
    { key: 'compliance_score', header: 'Score', render: (i) => <Badge style={{ backgroundColor: getScoreColor(i.compliance_score) }}>{i.compliance_score}%</Badge> },
    { key: 'last_checked', header: 'Last Checked', sortable: true },
    { key: 'status', header: 'Status', render: (i) => (
      <Badge style={{ backgroundColor: i.status === 'Compliant' ? '#22c55e' : i.status === 'Partial' ? '#eab308' : '#dc2626' }}>{i.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', description: '', regulation_id: regulations[0]?.id || 1, owner_id: 1, status: 'Compliant', compliance_score: 100, last_checked: new Date().toISOString().split('T')[0], next_review: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<MonitoringItem>('compliance.compliance_monitoring', formData as Omit<MonitoringItem, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<MonitoringItem>('compliance.compliance_monitoring', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<MonitoringItem>('compliance.compliance_monitoring', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Control Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Regulation</Label><Select value={formData.regulation_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, regulation_id: Number(e.target.value) })} options={regulations.map(r => ({ value: r.id, label: r.name }))} /></div>
        <div><Label>Owner</Label><Select value={formData.owner_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Compliant', label: 'Compliant' }, { value: 'Partial', label: 'Partial' }, { value: 'Non-Compliant', label: 'Non-Compliant' }]} /></div>
        <div><Label>Compliance Score (%)</Label><Input type="number" min={0} max={100} value={formData.compliance_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, compliance_score: Number(e.target.value) })} /></div>
        <div><Label>Last Checked</Label><Input type="date" value={formData.last_checked || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, last_checked: e.target.value })} /></div>
        <div><Label>Next Review</Label><Input type="date" value={formData.next_review || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, next_review: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Compliance Monitoring" description="Monitor ongoing compliance status" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Control</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={items} columns={columns} searchKeys={['title', 'description']}
          onView={(i) => { setSelected(i); setIsViewOpen(true); }}
          onEdit={(i) => { setSelected(i); setFormData({ ...i }); setIsEditOpen(true); }}
          onDelete={(i) => { setSelected(i); setIsDeleteOpen(true); }}
          emptyMessage="No monitoring items found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Monitoring Item</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Monitoring Item</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Regulation:</span><p className="font-medium">{regulations.find(r => r.id === selected.regulation_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Owner:</span><p className="font-medium">{getUserName(selected.owner_id)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: selected.status === 'Compliant' ? '#22c55e' : '#dc2626' }}>{selected.status}</Badge></div>
              <div><span className="text-muted-foreground">Score:</span><Badge style={{ backgroundColor: getScoreColor(selected.compliance_score) }}>{selected.compliance_score}%</Badge></div>
              <div><span className="text-muted-foreground">Last Checked:</span><p className="font-medium">{selected.last_checked}</p></div>
              <div><span className="text-muted-foreground">Next Review:</span><p className="font-medium">{selected.next_review || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Monitoring Item" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
