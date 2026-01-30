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

interface ActionPlan {
  id: number;
  tenant_id: number;
  risk_id: number;
  title: string;
  description: string;
  assigned_to_id: number;
  due_date: string;
  status_id: number;
  priority: string;
  completion_percentage: number;
}

interface LookupItem { id: number; name: string; color?: string; }
interface Risk { id: number; title: string; risk_number: string; }

export default function RiskActionPlansPage() {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ActionPlan | null>(null);
  const [formData, setFormData] = useState<Partial<ActionPlan>>({});

  const loadData = () => {
    setPlans(getCollection<ActionPlan>('risk.risk_action_plans'));
    setStatuses(getCollection<LookupItem>('risk.risk_action_plan_statuses'));
    setRisks(getCollection<Risk>('risk.risks'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<ActionPlan>[] = [
    { key: 'title', header: 'Action Plan', sortable: true },
    { key: 'risk_id', header: 'Related Risk', render: (p) => risks.find(r => r.id === p.risk_id)?.risk_number || '-' },
    { key: 'assigned_to_id', header: 'Assigned To', render: (p) => getUserName(p.assigned_to_id) },
    { key: 'due_date', header: 'Due Date', sortable: true },
    { key: 'completion_percentage', header: 'Progress', render: (p) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${p.completion_percentage}%` }} />
        </div>
        <span className="text-xs">{p.completion_percentage}%</span>
      </div>
    )},
    { key: 'status_id', header: 'Status', render: (p) => {
      const st = statuses.find(s => s.id === p.status_id);
      return <Badge style={{ backgroundColor: st?.color || '#6b7280' }}>{st?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1, risk_id: risks[0]?.id || 1, title: '', description: '', assigned_to_id: 1,
      due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status_id: 1, priority: 'Medium', completion_percentage: 0,
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<ActionPlan>('risk.risk_action_plans', formData as Omit<ActionPlan, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<ActionPlan>('risk.risk_action_plans', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<ActionPlan>('risk.risk_action_plans', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Related Risk</Label><Select value={formData.risk_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, risk_id: Number(e.target.value) })} options={risks.map(r => ({ value: r.id, label: `${r.risk_number} - ${r.title}` }))} /></div>
        <div><Label>Assigned To</Label><Select value={formData.assigned_to_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assigned_to_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Due Date</Label><Input type="date" value={formData.due_date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, due_date: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Priority</Label><Select value={formData.priority || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value })} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} /></div>
        <div><Label>Completion %</Label><Input type="number" min={0} max={100} value={formData.completion_percentage || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, completion_percentage: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Action Plans" description="Manage risk mitigation action plans" textColor={PROSUITE_COLORS.risk.text} accentColor={PROSUITE_COLORS.risk.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="plus" size={16} className="mr-2" />New Action Plan</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={plans} columns={columns} searchKeys={['title', 'description']}
          onView={(p) => { setSelected(p); setIsViewOpen(true); }}
          onEdit={(p) => { setSelected(p); setFormData({ ...p }); setIsEditOpen(true); }}
          onDelete={(p) => { setSelected(p); setIsDeleteOpen(true); }}
          emptyMessage="No action plans found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Action Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Action Plan</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Related Risk:</span><p className="font-medium">{risks.find(r => r.id === selected.risk_id)?.title || '-'}</p></div>
              <div><span className="text-muted-foreground">Assigned To:</span><p className="font-medium">{getUserName(selected.assigned_to_id)}</p></div>
              <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selected.due_date}</p></div>
              <div><span className="text-muted-foreground">Priority:</span><p className="font-medium">{selected.priority}</p></div>
              <div><span className="text-muted-foreground">Progress:</span><p className="font-medium">{selected.completion_percentage}%</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.status_id)?.color }}>{statuses.find(s => s.id === selected.status_id)?.name}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Action Plan" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
