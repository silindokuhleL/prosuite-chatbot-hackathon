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
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCollection, createItem, updateItem, deleteItem } from '@/lib/crud';

interface Location {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  site_id: number;
  building: string;
  floor: string;
  room: string;
}

interface Site { id: number; name: string; }

export default function AssetLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Location | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({});

  const loadData = () => {
    setLocations(getCollection<Location>('core.locations'));
    setSites(getCollection<Site>('core.sites'));
  };
  useEffect(() => { loadData(); }, []);

  const columns: Column<Location>[] = [
    { key: 'name', header: 'Location Name', sortable: true },
    { key: 'site_id', header: 'Site', render: (l) => sites.find(s => s.id === l.site_id)?.name || '-' },
    { key: 'building', header: 'Building' },
    { key: 'floor', header: 'Floor' },
    { key: 'room', header: 'Room' },
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, name: '', description: '', site_id: sites[0]?.id || 1, building: '', floor: '', room: '' });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.name) return;
    createItem<Location>('core.locations', formData as Omit<Location, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.name) return;
    updateItem<Location>('core.locations', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<Location>('core.locations', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Location Name *</Label><Input value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><Label>Site</Label><Select value={formData.site_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, site_id: Number(e.target.value) })} options={sites.map(s => ({ value: s.id, label: s.name }))} /></div>
        <div><Label>Building</Label><Input value={formData.building || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, building: e.target.value })} /></div>
        <div><Label>Floor</Label><Input value={formData.floor || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, floor: e.target.value })} /></div>
        <div><Label>Room</Label><Input value={formData.room || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, room: e.target.value })} /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Locations" description="Manage asset locations within sites" textColor={PROSUITE_COLORS.asset.text} accentColor={PROSUITE_COLORS.asset.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="plus" size={16} className="mr-2" />New Location</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={locations} columns={columns} searchKeys={['name', 'building', 'floor', 'room']}
          onView={(l) => { setSelected(l); setIsViewOpen(true); }}
          onEdit={(l) => { setSelected(l); setFormData({ ...l }); setIsEditOpen(true); }}
          onDelete={(l) => { setSelected(l); setIsDeleteOpen(true); }}
          emptyMessage="No locations found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create Location</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Location</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Site:</span><p className="font-medium">{sites.find(s => s.id === selected.site_id)?.name}</p></div>
              <div><span className="text-muted-foreground">Building:</span><p className="font-medium">{selected.building || '-'}</p></div>
              <div><span className="text-muted-foreground">Floor:</span><p className="font-medium">{selected.floor || '-'}</p></div>
              <div><span className="text-muted-foreground">Room:</span><p className="font-medium">{selected.room || '-'}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Description:</span><p className="font-medium">{selected.description || '-'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Location" description={`Delete "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
