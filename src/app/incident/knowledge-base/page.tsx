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

interface KBArticle {
  id: number;
  tenant_id: number;
  title: string;
  solution_description: string;
  category: string;
  author_id: number;
  status: string;
  views: number;
  helpful_count: number;
}

export default function IncidentKnowledgeBasePage() {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<KBArticle | null>(null);
  const [formData, setFormData] = useState<Partial<KBArticle>>({});

  const loadData = () => {
    setArticles(getCollection<KBArticle>('incident.knowledge_base_solutions'));
    setUsers(getCollection<{ id: number; name: string }>('core.users'));
  };

  useEffect(() => { loadData(); }, []);

  const columns: Column<KBArticle>[] = [
    { key: 'title', header: 'Article Title', sortable: true },
    { key: 'category', header: 'Category' },
    { key: 'author_id', header: 'Author', render: (a) => getUserName(a.author_id) },
    { key: 'views', header: 'Views', sortable: true },
    { key: 'helpful_count', header: 'Helpful', sortable: true },
    { key: 'status', header: 'Status', render: (a) => (
      <Badge style={{ backgroundColor: a.status === 'Published' ? '#22c55e' : a.status === 'Draft' ? '#eab308' : '#6b7280' }}>{a.status}</Badge>
    )},
  ];

  const handleCreate = () => {
    setFormData({ tenant_id: 1, title: '', solution_description: '', category: 'General', author_id: 1, status: 'Draft', views: 0, helpful_count: 0 });
    setIsCreateOpen(true);
  };

  const handleSaveNew = () => {
    if (!formData.title) return;
    createItem<KBArticle>('incident.knowledge_base_solutions', formData as Omit<KBArticle, 'id'>);
    loadData(); setIsCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!selected || !formData.title) return;
    updateItem<KBArticle>('incident.knowledge_base_solutions', selected.id, formData);
    loadData(); setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteItem<KBArticle>('incident.knowledge_base_solutions', selected.id);
    loadData(); setIsDeleteOpen(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Article Title *</Label><Input value={formData.title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })} /></div>
        <div><Label>Category</Label><Select value={formData.category || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })} options={[{ value: 'General', label: 'General' }, { value: 'Technical', label: 'Technical' }, { value: 'Security', label: 'Security' }, { value: 'Network', label: 'Network' }, { value: 'Hardware', label: 'Hardware' }]} /></div>
        <div><Label>Author</Label><Select value={formData.author_id || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, author_id: Number(e.target.value) })} options={users.map(u => ({ value: u.id, label: u.name }))} /></div>
        <div><Label>Status</Label><Select value={formData.status || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Published', label: 'Published' }, { value: 'Archived', label: 'Archived' }]} /></div>
        <div className="col-span-2"><Label>Solution</Label><Textarea value={formData.solution_description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, solution_description: e.target.value })} rows={6} /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Knowledge Base" description="Solutions and procedures for incident resolution" textColor={PROSUITE_COLORS.incident.text} accentColor={PROSUITE_COLORS.incident.accent}
        actions={<Button size="sm" onClick={handleCreate} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="plus" size={16} className="mr-2" />New Article</Button>}
      />
      <Card><CardContent className="p-6">
        <DataTable data={articles} columns={columns} searchKeys={['title', 'solution_description', 'category']}
          onView={(a) => { setSelected(a); setIsViewOpen(true); }}
          onEdit={(a) => { setSelected(a); setFormData({ ...a }); setIsEditOpen(true); }}
          onDelete={(a) => { setSelected(a); setIsDeleteOpen(true); }}
          emptyMessage="No articles found."
        />
      </CardContent></Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Article</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleSaveNew} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="save" size={16} className="mr-2" />Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Article</DialogTitle></DialogHeader>{formContent}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleSaveEdit} style={{ backgroundColor: PROSUITE_COLORS.incident.text }}><Icon name="save" size={16} className="mr-2" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-4">
                <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{selected.category}</span></div>
                <div><span className="text-muted-foreground">Author:</span> <span className="font-medium">{getUserName(selected.author_id)}</span></div>
                <div><span className="text-muted-foreground">Views:</span> <span className="font-medium">{selected.views}</span></div>
                <div><span className="text-muted-foreground">Helpful:</span> <span className="font-medium">{selected.helpful_count}</span></div>
              </div>
              <div><span className="text-muted-foreground">Solution:</span><p className="font-medium mt-1 whitespace-pre-wrap">{selected.solution_description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button><Button onClick={() => { setIsViewOpen(false); setFormData({ ...selected! }); setIsEditOpen(true); }}><Icon name="edit" size={16} className="mr-2" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Delete Article" description={`Delete "${selected?.title}"? This cannot be undone.`} onConfirm={handleDelete} confirmText="Delete" variant="danger" />
    </>
  );
}
