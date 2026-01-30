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

interface Category {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  depreciation_rate: number;
  useful_life_years: number;
}

export default function AssetCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const loadData = () => { setCategories(getCollection<Category>('asset.categories')); };
  useEffect(() => { loadData(); }, []);

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Category Name', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'depreciation_rate', header: 'Depreciation Rate', render: (c) => `${c.depreciation_rate}%` },
    { key: 'useful_life_years', header: 'Useful Life', render: (c) => `${c.useful_life_years} years` },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', depreciation_rate: 10, useful_life_years: 5 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Category>('asset.categories', formData as Omit<Category, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Category>('asset.categories', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Category>('asset.categories', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Category Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Depreciation Rate (%)</Label><Input type="number" value={formData.depreciation_rate || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, depreciation_rate: Number(e.target.value) })} /></div>
        <div><Label>Useful Life (Years)</Label><Input type="number" value={formData.useful_life_years || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, useful_life_years: Number(e.target.value) })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Asset Categories" description="Manage asset classification categories" textColor={PROSUITE_COLORS.asset.text} accentColor={PROSUITE_COLORS.asset.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="plus" size={16} className="mr-2" />New Category</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={categories} columns={columns} searchKeys={['name', 'description']}
          onView={(c) => { setSelected(c); setIsViewOpen(true); }}
          onEdit={(c) => { setSelected(c); setFormData({ ...c }); setIsEditOpen(true); }}
          onDelete={(c) => { setSelected(c); setIsDeleteOpen(true); }}
          emptyMessage="No categories found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Category</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Depreciation Rate:</span><p className="font-medium">{selected.depreciation_rate}%</p></div>
              <div><span className="text-muted-foreground">Useful Life:</span><p className="font-medium">{selected.useful_life_years} years</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Category" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
