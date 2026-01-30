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
import { getCollection, createItem, updateItem, deleteItem } from '@/lib/crud';

interface CompliancePackage {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  version: string;
  publisher_name: string;
  compliance_package_status_id: number;
  compliance_score: number;
  total_requirements: number;
  completed_requirements: number;
}

interface LookupItem { id: number; name: string; color?: string; }

export default function ComplianceControlsPage() {
  const [packages, setPackages] = useState<CompliancePackage[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<CompliancePackage | null>(null);
  const [formData, setFormData] = useState<Partial<CompliancePackage>>({});

  const loadData = () => {
    setPackages(getCollection<CompliancePackage>('compliance.compliance_packages'));
    setStatuses(getCollection<LookupItem>('compliance.compliance_package_statuses'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<CompliancePackage>[] = [
    { key: 'name', header: 'Package Name', sortable: true },
    { key: 'version', header: 'Version' },
    { key: 'publisher_name', header: 'Publisher' },
    { key: 'total_requirements', header: 'Requirements', render: (p) => `${p.completed_requirements}/${p.total_requirements}` },
    { key: 'compliance_score', header: 'Score', sortable: true, render: (p) => {
      const color = p.compliance_score >= 80 ? '#22c55e' : p.compliance_score >= 60 ? '#eab308' : '#dc2626';
      return <Badge style={{ backgroundColor: color }}>{p.compliance_score}%</Badge>;
    }},
    { key: 'compliance_package_status_id', header: 'Status', render: (p) => {
      const st = statuses.find(s => s.id === p.compliance_package_status_id);
      return <Badge style={{ backgroundColor: st?.color || '#6b7280' }}>{st?.name}</Badge>;
    }},
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1, name: '', description: '', version: '1.0', publisher_name: '',
      compliance_package_status_id: 1, compliance_score: 0, total_requirements: 0, completed_requirements: 0,
    });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<CompliancePackage>('compliance.compliance_packages', formData as Omit<CompliancePackage, 'id'>);
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<CompliancePackage>('compliance.compliance_packages', selected.id, formData);
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<CompliancePackage>('compliance.compliance_packages', selected.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Package Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Version</Label><Input value={formData.version || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, version: e.target.value })} /></div>
        <div><Label>Publisher</Label><Input value={formData.publisher_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, publisher_name: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={formData.compliance_package_status_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, compliance_package_status_id: Number(e.target.value) })} options={statuses.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Total Requirements</Label><Input type="number" value={formData.total_requirements || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, total_requirements: Number(e.target.value) })} /></div>
        <div><Label>Completed Requirements</Label><Input type="number" value={formData.completed_requirements || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, completed_requirements: Number(e.target.value) })} /></div>
        <div><Label>Compliance Score (%)</Label><Input type="number" value={formData.compliance_score || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, compliance_score: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Controls Management" description="Manage compliance controls and requirements" textColor={PROSUITE_COLORS.compliance.text} accentColor={PROSUITE_COLORS.compliance.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="plus" size={16} className="mr-2" />New Package</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={packages} columns={columns} searchKeys={['name', 'description', 'publisher_name']}
          onView={(p) => { setSelected(p); setIsViewOpen(true); }}
          onEdit={(p) => { setSelected(p); setFormData({ ...p }); setIsEditOpen(true); }}
          onDelete={(p) => { setSelected(p); setIsDeleteOpen(true); }}
          emptyMessage="No compliance packages found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Compliance Package</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Package</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.compliance.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Version:</span><p className="font-medium">{selected.version}</p></div>
              <div><span className="text-muted-foreground">Publisher:</span><p className="font-medium">{selected.publisher_name}</p></div>
              <div><span className="text-muted-foreground">Requirements:</span><p className="font-medium">{selected.completed_requirements}/{selected.total_requirements}</p></div>
              <div><span className="text-muted-foreground">Score:</span><Badge style={{ backgroundColor: selected.compliance_score >= 80 ? '#22c55e' : '#eab308' }}>{selected.compliance_score}%</Badge></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selected.compliance_package_status_id)?.color }}>{statuses.find(s => s.id === selected.compliance_package_status_id)?.name}</Badge></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Package" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
