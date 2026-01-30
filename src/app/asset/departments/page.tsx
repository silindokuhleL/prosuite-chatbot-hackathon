'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, Column } from '@/components/shared/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ConfirmDialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCollection, createItem, updateItem, deleteItem } from '@/lib/crud';

interface Department {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  code: string;
  manager_name: string;
}

export default function AssetDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});

  const loadData = () => { setDepartments(getCollection<Department>('core.departments')); };
  useEffect(() => { loadData(); }, []);

  const columns: Column<Department>[] = [
    { key: 'code', header: 'Code', sortable: true },
    { key: 'name', header: 'Department Name', sortable: true },
    { key: 'manager_name', header: 'Manager' },
    { key: 'description', header: 'Description' },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', code: '', manager_name: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Department>('core.departments', formData as Omit<Department, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Department>('core.departments', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Department>('core.departments', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Code</Label><Input value={formData.code || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })} /></div>
        <div><Label>Department Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div className="col-span-2"><Label>Manager Name</Label><Input value={formData.manager_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, manager_name: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Departments" description="Manage organizational departments" textColor={PROSUITE_COLORS.asset.text} accentColor={PROSUITE_COLORS.asset.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="plus" size={16} className="mr-2" />New Department</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={departments} columns={columns} searchKeys={['name', 'code', 'description']}
          onView={(d) => { setSelected(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelected(d); setFormData({ ...d }); setIsEditOpen(true); }}
          onDelete={(d) => { setSelected(d); setIsDeleteOpen(true); }}
          emptyMessage="No departments found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Department</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Department</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Code:</span><p className="font-medium">{selected.code}</p></div>
              <div><span className="text-muted-foreground">Manager:</span><p className="font-medium">{selected.manager_name || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Department" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
