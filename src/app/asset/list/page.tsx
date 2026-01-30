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
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCollection, createItem, updateItem, deleteItem } from '@/lib/crud';

interface Asset {
  id: number;
  tenant_id: number;
  description: string;
  assetTag: string;
  serialNumber: string | null;
  brand: string;
  cost: number;
  purchaseDate: string;
  condition: string;
  category_id: number;
  category_name: string;
  department_id: number;
  department_name: string;
  site_id: number;
  site_name: string;
  location_id: number;
  location_name: string;
  assetStatus_id: number;
  assetStatus_name: string;
  isDepreciable: boolean;
  depreciationMethod_id?: number;
  depreciationMethod_name?: string;
  warrantyExpiration?: string;
}

interface LookupItem {
  id: number;
  name: string;
  color?: string;
}

export default function AssetListPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [departments, setDepartments] = useState<LookupItem[]>([]);
  const [sites, setSites] = useState<LookupItem[]>([]);
  const [locations, setLocations] = useState<LookupItem[]>([]);
  const [depreciationMethods, setDepreciationMethods] = useState<LookupItem[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Partial<Asset>>({});

  const loadData = () => {
    setAssets(getCollection<Asset>('asset.assets'));
    setCategories(getCollection<LookupItem>('asset.categories'));
    setStatuses(getCollection<LookupItem>('asset.asset_statuses'));
    setDepartments(getCollection<LookupItem>('core.departments'));
    setSites(getCollection<LookupItem>('core.sites'));
    setLocations(getCollection<LookupItem>('core.locations'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const columns: Column<Asset>[] = [
    { key: 'assetTag', header: 'Asset Tag', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'category_name', header: 'Category', sortable: true },
    { key: 'department_name', header: 'Department', sortable: true },
    { 
      key: 'cost', 
      header: 'Cost',
      sortable: true,
      render: (asset) => formatCurrency(asset.cost)
    },
    { 
      key: 'assetStatus_id', 
      header: 'Status',
      render: (asset) => {
        const status = statuses.find(s => s.id === asset.assetStatus_id);
        return (
          <Badge style={{ backgroundColor: status?.color || '#6b7280' }}>
            {asset.assetStatus_name}
          </Badge>
        );
      }
    },
  ];

  const handleCreate = () => {
    const nextTag = `AST-${String(assets.length + 1).padStart(4, '0')}`;
    setFormData({
      tenant_id: 1,
      description: '',
      assetTag: nextTag,
      serialNumber: '',
      brand: '',
      cost: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      condition: 'New',
      category_id: 1,
      department_id: 1,
      site_id: 1,
      location_id: 1,
      assetStatus_id: 1,
      isDepreciable: true,
    });
    setIsCreateOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({ ...asset });
    setIsEditOpen(true);
  };

  const handleView = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.description) return;
    
    const category = categories.find(c => c.id === formData.category_id);
    const department = departments.find(d => d.id === formData.department_id);
    const site = sites.find(s => s.id === formData.site_id);
    const location = locations.find(l => l.id === formData.location_id);
    const status = statuses.find(s => s.id === formData.assetStatus_id);
    
    createItem<Asset>('asset.assets', {
      ...formData,
      category_name: category?.name || '',
      department_name: department?.name || '',
      site_name: site?.name || '',
      location_name: location?.name || '',
      assetStatus_name: status?.name || 'Active',
    } as Omit<Asset, 'id'>);
    
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selectedAsset || !formData.description) return;
    
    const category = categories.find(c => c.id === formData.category_id);
    const department = departments.find(d => d.id === formData.department_id);
    const site = sites.find(s => s.id === formData.site_id);
    const location = locations.find(l => l.id === formData.location_id);
    const status = statuses.find(s => s.id === formData.assetStatus_id);
    
    updateItem<Asset>('asset.assets', selectedAsset.id, {
      ...formData,
      category_name: category?.name || selectedAsset.category_name,
      department_name: department?.name || selectedAsset.department_name,
      site_name: site?.name || selectedAsset.site_name,
      location_name: location?.name || selectedAsset.location_name,
      assetStatus_name: status?.name || selectedAsset.assetStatus_name,
    });
    
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedAsset) return;
    deleteItem<Asset>('asset.assets', selectedAsset.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const AssetForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="description">Asset Description *</Label>
          <Input
            id="description"
            value={formData.description || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter asset description"
          />
        </div>
        
        <div>
          <Label htmlFor="assetTag">Asset Tag</Label>
          <Input id="assetTag" value={formData.assetTag || ''} disabled />
        </div>
        
        <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, serialNumber: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="cost">Cost (ZAR)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cost: Number(e.target.value) })}
          />
        </div>
        
        <div>
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select
            id="condition"
            value={formData.condition || 'New'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, condition: e.target.value })}
            options={[
              { value: 'New', label: 'New' },
              { value: 'Excellent', label: 'Excellent' },
              { value: 'Good', label: 'Good' },
              { value: 'Fair', label: 'Fair' },
              { value: 'Poor', label: 'Poor' },
            ]}
          />
        </div>
        
        <div>
          <Label htmlFor="category_id">Category</Label>
          <Select
            id="category_id"
            value={formData.category_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category_id: Number(e.target.value) })}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
        </div>
        
        <div>
          <Label htmlFor="department_id">Department</Label>
          <Select
            id="department_id"
            value={formData.department_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, department_id: Number(e.target.value) })}
            options={departments.map(d => ({ value: d.id, label: d.name }))}
          />
        </div>
        
        <div>
          <Label htmlFor="site_id">Site</Label>
          <Select
            id="site_id"
            value={formData.site_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, site_id: Number(e.target.value) })}
            options={sites.map(s => ({ value: s.id, label: s.name }))}
          />
        </div>
        
        <div>
          <Label htmlFor="location_id">Location</Label>
          <Select
            id="location_id"
            value={formData.location_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, location_id: Number(e.target.value) })}
            options={locations.map(l => ({ value: l.id, label: l.name }))}
          />
        </div>
        
        <div>
          <Label htmlFor="assetStatus_id">Status</Label>
          <Select
            id="assetStatus_id"
            value={formData.assetStatus_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assetStatus_id: Number(e.target.value) })}
            options={statuses.map(s => ({ value: s.id, label: s.name }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader 
        title="Assets"
        description="View and manage all organizational assets"
        textColor={PROSUITE_COLORS.asset.text}
        accentColor={PROSUITE_COLORS.asset.accent}
        actions={
          <Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}>
            <Icon name="plus" size={16} className="mr-2" />
            New Asset
          </Button>
        }
      />
      
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={assets}
            columns={columns}
            searchKeys={['description', 'assetTag', 'brand', 'serialNumber']}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            emptyMessage="No assets found. Click 'New Asset' to create one."
          />
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Asset</DialogTitle>
          </DialogHeader>
          <AssetForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}>
              <Icon name="save" size={16} className="mr-2" />
              Create Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset: {selectedAsset?.assetTag}</DialogTitle>
          </DialogHeader>
          <AssetForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.asset.text }}>
              <Icon name="save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.description}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Asset Tag:</span><p className="font-medium">{selectedAsset.assetTag}</p></div>
              <div><span className="text-muted-foreground">Serial Number:</span><p className="font-medium">{selectedAsset.serialNumber || '-'}</p></div>
              <div><span className="text-muted-foreground">Brand:</span><p className="font-medium">{selectedAsset.brand}</p></div>
              <div><span className="text-muted-foreground">Cost:</span><p className="font-medium">{formatCurrency(selectedAsset.cost)}</p></div>
              <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{selectedAsset.category_name}</p></div>
              <div><span className="text-muted-foreground">Department:</span><p className="font-medium">{selectedAsset.department_name}</p></div>
              <div><span className="text-muted-foreground">Site:</span><p className="font-medium">{selectedAsset.site_name}</p></div>
              <div><span className="text-muted-foreground">Location:</span><p className="font-medium">{selectedAsset.location_name}</p></div>
              <div><span className="text-muted-foreground">Condition:</span><p className="font-medium">{selectedAsset.condition}</p></div>
              <div><span className="text-muted-foreground">Status:</span><Badge style={{ backgroundColor: statuses.find(s => s.id === selectedAsset.assetStatus_id)?.color }}>{selectedAsset.assetStatus_name}</Badge></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewOpen(false); handleEdit(selectedAsset!); }}>
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Asset"
        description={`Are you sure you want to delete "${selectedAsset?.description}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
