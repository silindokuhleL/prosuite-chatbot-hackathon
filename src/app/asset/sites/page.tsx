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

interface Site {
  id: number;
  tenant_id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  site_code: string;
}

export default function AssetSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Site | null>(null);
  const [formData, setFormData] = useState<Partial<Site>>({});

  const loadData = () => { setSites(getCollection<Site>('core.sites')); };
  useEffect(() => { loadData(); }, []);

  const columns: Column<Site>[] = [
    { key: 'site_code', header: 'Code', sortable: true },
    { key: 'name', header: 'Site Name', sortable: true },
    { key: 'address', header: 'Address' },
    { key: 'city', header: 'City' },
    { key: 'country', header: 'Country' },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', address: '', city: '', country: '', site_code: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Site>('core.sites', formData as Omit<Site, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Site>('core.sites', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Site>('core.sites', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Site Code</Label><Input value={formData.site_code || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, site_code: e.target.value })} /></div>
        <div><Label>Site Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div className="col-span-2"><Label>Address</Label><Textarea value={formData.address || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, address: e.target.value })} rows={2} /></div>
        <div><Label>City</Label><Input value={formData.city || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })} /></div>
        <div><Label>Country</Label><Input value={formData.country || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, country: e.target.value })} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Sites" description="Manage organizational sites" textColor={PROSUITE_COLORS.asset.text} accentColor={PROSUITE_COLORS.asset.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="plus" size={16} className="mr-2" />New Site</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={sites} columns={columns} searchKeys={['name', 'site_code', 'city', 'country']}
          onView={(s) => { setSelected(s); setIsViewOpen(true); }}
          onEdit={(s) => { setSelected(s); setFormData({ ...s }); setIsEditOpen(true); }}
          onDelete={(s) => { setSelected(s); setIsDeleteOpen(true); }}
          emptyMessage="No sites found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Site</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Site</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Code:</span><p className="font-medium">{selected.site_code}</p></div>
              <div><span className="text-muted-foreground">City:</span><p className="font-medium">{selected.city}</p></div>
              <div><span className="text-muted-foreground">Country:</span><p className="font-medium">{selected.country}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Address:</span><p className="font-medium">{selected.address}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Site" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
