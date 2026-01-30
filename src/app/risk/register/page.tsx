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
import { getCollection, createItem, updateItem, deleteItem, getUserName, getDepartmentName } from '@/lib/crud';

interface Risk {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  risk_number: string;
  risk_type_id: number;
  department_id: number;
  owner_id: number;
  category_id: number;
  sub_category_id: number | null;
  origin_id: number;
  risk_age_id: number;
  identification_date: string;
  causes: string[];
  consequences: string[];
  impact_rating_id: number;
  likelihood_rating_id: number;
  inherit_risk_score: number;
  priority_id: number;
  approach_id: number;
  monitoring_frequency_id: number;
  residual_score: number;
  is_archived: boolean;
}

interface LookupItem {
  id: number;
  name: string;
  color?: string;
  value?: number;
}

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [riskTypes, setRiskTypes] = useState<LookupItem[]>([]);
  const [impactLevels, setImpactLevels] = useState<LookupItem[]>([]);
  const [likelihoodLevels, setLikelihoodLevels] = useState<LookupItem[]>([]);
  const [departments, setDepartments] = useState<LookupItem[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [approaches, setApproaches] = useState<LookupItem[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [formData, setFormData] = useState<Partial<Risk>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRisks(getCollection<Risk>('risk.risks'));
    setCategories(getCollection<LookupItem>('risk.risk_categories'));
    setRiskTypes(getCollection<LookupItem>('risk.risk_types'));
    setImpactLevels(getCollection<LookupItem>('risk.risk_impact_rating_levels'));
    setLikelihoodLevels(getCollection<LookupItem>('risk.risk_likelihood_rating_levels'));
    setDepartments(getCollection<LookupItem>('core.departments'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
    setApproaches(getCollection<LookupItem>('risk.risk_approaches'));
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 20) return '#dc2626';
    if (score >= 13) return '#f97316';
    if (score >= 7) return '#eab308';
    return '#22c55e';
  };

  const getRiskScoreLabel = (score: number) => {
    if (score >= 20) return 'Critical';
    if (score >= 13) return 'High';
    if (score >= 7) return 'Medium';
    return 'Low';
  };

  const columns: Column<Risk>[] = [
    { key: 'risk_number', header: 'Risk #', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { 
      key: 'category_id', 
      header: 'Category',
      render: (risk) => categories.find(c => c.id === risk.category_id)?.name || '-'
    },
    { 
      key: 'owner_id', 
      header: 'Owner',
      render: (risk) => getUserName(risk.owner_id)
    },
    { 
      key: 'inherit_risk_score', 
      header: 'Inherent Score',
      sortable: true,
      render: (risk) => (
        <Badge style={{ backgroundColor: getRiskScoreColor(risk.inherit_risk_score) }}>
          {risk.inherit_risk_score} - {getRiskScoreLabel(risk.inherit_risk_score)}
        </Badge>
      )
    },
    { 
      key: 'residual_score', 
      header: 'Residual Score',
      sortable: true,
      render: (risk) => (
        <Badge style={{ backgroundColor: getRiskScoreColor(risk.residual_score) }}>
          {risk.residual_score}
        </Badge>
      )
    },
  ];

  const handleCreate = () => {
    setFormData({
      tenant_id: 1,
      title: '',
      description: '',
      risk_number: `R-${new Date().getFullYear()}-${String(risks.length + 1).padStart(3, '0')}`,
      risk_type_id: 1,
      department_id: 1,
      owner_id: 1,
      category_id: 1,
      impact_rating_id: 1,
      likelihood_rating_id: 1,
      inherit_risk_score: 1,
      approach_id: 1,
      residual_score: 1,
      identification_date: new Date().toISOString().split('T')[0],
      causes: [],
      consequences: [],
      is_archived: false,
    });
    setIsCreateOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setSelectedRisk(risk);
    setFormData({ ...risk });
    setIsEditOpen(true);
  };

  const handleView = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsDeleteOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    
    const impact = formData.impact_rating_id || 1;
    const likelihood = formData.likelihood_rating_id || 1;
    const score = impact * likelihood;
    
    createItem<Risk>('risk.risks', {
      ...formData,
      inherit_risk_score: score,
      residual_score: Math.floor(score * 0.6),
    } as Omit<Risk, 'id'>);
    
    loadData();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selectedRisk || !formData.title) return;
    
    const impact = formData.impact_rating_id || selectedRisk.impact_rating_id;
    const likelihood = formData.likelihood_rating_id || selectedRisk.likelihood_rating_id;
    const score = impact * likelihood;
    
    updateItem<Risk>('risk.risks', selectedRisk.id, {
      ...formData,
      inherit_risk_score: score,
    });
    
    loadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedRisk) return;
    deleteItem<Risk>('risk.risks', selectedRisk.id);
    loadData();
    setIsDeleteOpen(false);
  };

  const RiskForm = ({ isNew = false }: { isNew?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Risk Title *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter risk title"
          />
        </div>
        
        <div>
          <Label htmlFor="risk_number">Risk Number</Label>
          <Input
            id="risk_number"
            value={formData.risk_number || ''}
            disabled
          />
        </div>
        
        <div>
          <Label htmlFor="identification_date">Identification Date</Label>
          <Input
            id="identification_date"
            type="date"
            value={formData.identification_date || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, identification_date: e.target.value })}
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
          <Label htmlFor="owner_id">Risk Owner</Label>
          <Select
            id="owner_id"
            value={formData.owner_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, owner_id: Number(e.target.value) })}
            options={users.map(u => ({ value: u.id, label: u.name }))}
          />
        </div>
        
        <div>
          <Label htmlFor="approach_id">Treatment Approach</Label>
          <Select
            id="approach_id"
            value={formData.approach_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, approach_id: Number(e.target.value) })}
            options={approaches.map(a => ({ value: a.id, label: a.name }))}
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the risk..."
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="impact_rating_id">Impact Rating</Label>
          <Select
            id="impact_rating_id"
            value={formData.impact_rating_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, impact_rating_id: Number(e.target.value) })}
            options={impactLevels.map(l => ({ value: l.id, label: `${l.value} - ${l.name}` }))}
          />
        </div>
        
        <div>
          <Label htmlFor="likelihood_rating_id">Likelihood Rating</Label>
          <Select
            id="likelihood_rating_id"
            value={formData.likelihood_rating_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, likelihood_rating_id: Number(e.target.value) })}
            options={likelihoodLevels.map(l => ({ value: l.id, label: `${l.value} - ${l.name}` }))}
          />
        </div>
      </div>
      
      {formData.impact_rating_id && formData.likelihood_rating_id && (
        <div className="p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">Calculated Inherent Score: </span>
          <Badge style={{ backgroundColor: getRiskScoreColor((formData.impact_rating_id || 1) * (formData.likelihood_rating_id || 1)) }}>
            {(formData.impact_rating_id || 1) * (formData.likelihood_rating_id || 1)} - {getRiskScoreLabel((formData.impact_rating_id || 1) * (formData.likelihood_rating_id || 1))}
          </Badge>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader 
        title="Risk Register"
        description="View and manage all organizational risks"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
        actions={
          <Button 
            size="sm" 
            onClick={handleCreate}
            style={{ backgroundColor: PROSUITE_COLORS.risk.text }}
          >
            <Icon name="plus" size={16} className="mr-2" />
            New Risk
          </Button>
        }
      />
      
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={risks}
            columns={columns}
            searchKeys={['title', 'risk_number', 'description']}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            emptyMessage="No risks found. Click 'New Risk' to create one."
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Risk</DialogTitle>
          </DialogHeader>
          <RiskForm isNew />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}>
              <Icon name="save" size={16} className="mr-2" />
              Create Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Risk: {selectedRisk?.title}</DialogTitle>
          </DialogHeader>
          <RiskForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.risk.text }}>
              <Icon name="save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRisk?.title}</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Risk Number:</span>
                  <p className="font-medium">{selectedRisk.risk_number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium">{categories.find(c => c.id === selectedRisk.category_id)?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <p className="font-medium">{getDepartmentName(selectedRisk.department_id)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <p className="font-medium">{getUserName(selectedRisk.owner_id)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Inherent Score:</span>
                  <Badge style={{ backgroundColor: getRiskScoreColor(selectedRisk.inherit_risk_score) }}>
                    {selectedRisk.inherit_risk_score} - {getRiskScoreLabel(selectedRisk.inherit_risk_score)}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Residual Score:</span>
                  <Badge style={{ backgroundColor: getRiskScoreColor(selectedRisk.residual_score) }}>
                    {selectedRisk.residual_score}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Description:</span>
                  <p className="font-medium">{selectedRisk.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewOpen(false); handleEdit(selectedRisk!); }}>
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Risk"
        description={`Are you sure you want to delete "${selectedRisk?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
