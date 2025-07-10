
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductDialog } from '@/components/products/ProductDialog';
import { BatchDialog } from '@/components/products/BatchDialog';
import { ProductImportDialog } from '@/components/products/ProductImportDialog'; // New import
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react'; // New import
import { mockProductTemplates as initialMockProductTemplates, mockProductBatches as initialMockProductBatches } from '@/lib/mock-data';
import type { ProductTemplate, ProductBatch } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ALL_FILTER_VALUE = "_all_";

export default function ProductsPage() {
  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>(initialMockProductTemplates);
  const [productBatches, setProductBatches] = useState<ProductBatch[]>(initialMockProductBatches);
  
  // Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false); // New state

  // Data for dialogs
  const [editingProductTemplate, setEditingProductTemplate] = useState<ProductTemplate | null>(null);
  const [managingBatchesForTemplate, setManagingBatchesForTemplate] = useState<ProductTemplate | null>(null);

  // Filtering and searching states
  const [searchTerm, setSearchTerm] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState(ALL_FILTER_VALUE);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.role !== 'administrator') {
      router.replace('/dashboard'); 
    }
  }, [user, router]);

  if (!user || user.role !== 'administrator') {
     return <p className="text-center py-10">Access Denied. Administrator role required.</p>;
  }

  // Handlers for Product Templates
  const handleAddProductTemplate = () => {
    setEditingProductTemplate(null);
    setIsProductDialogOpen(true);
  };

  const handleEditProductTemplate = (template: ProductTemplate) => {
    setEditingProductTemplate(template);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProductTemplate = (templateId: string) => {
    setProductTemplates(prevTemplates => prevTemplates.filter(pt => pt.id !== templateId));
    setProductBatches(prevBatches => prevBatches.filter(pb => pb.productTemplateId !== templateId));
    toast({ title: 'Template Deleted', description: 'Product template and associated batches deleted.'});
  };

  const handleSaveProductTemplate = (template: ProductTemplate) => {
    if (editingProductTemplate) {
      setProductTemplates(prevTemplates => prevTemplates.map(pt => (pt.id === template.id ? template : pt)));
    } else {
      const newTemplateWithId = { ...template, id: template.id || `pt${Date.now()}` };
      setProductTemplates(prevTemplates => [...prevTemplates, newTemplateWithId]);
    }
    toast({ title: editingProductTemplate ? 'Template Updated' : 'Template Added', description: `${template.productName} saved.`});
  };

  // Handlers for Batches
  const handleManageBatches = (template: ProductTemplate) => {
    setManagingBatchesForTemplate(template);
    setIsBatchDialogOpen(true);
  };

  const handleSaveBatch = (batch: ProductBatch, isNew: boolean) => {
    if (isNew) {
      const newBatchWithId = { ...batch, id: batch.id || `batch${Date.now()}`};
      setProductBatches(prevBatches => [...prevBatches, newBatchWithId]);
      toast({ title: 'Batch Added', description: `New batch for ${managingBatchesForTemplate?.productName} saved.`});
    } else {
      setProductBatches(prevBatches => prevBatches.map(b => (b.id === batch.id ? batch : b)));
      toast({ title: 'Batch Updated', description: `Batch ${batch.metrcPackageId} updated.`});
    }
  };

  const handleDeleteBatch = (batchId: string) => {
    setProductBatches(prevBatches => prevBatches.filter(b => b.id !== batchId));
    toast({ title: 'Batch Deleted', description: 'Batch removed successfully.'});
  };

  // Handler for CSV Import
  const handleDataImport = (newTemplates: ProductTemplate[], newBatches: ProductBatch[]) => {
    setProductTemplates(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const trulyNewTemplates = newTemplates.filter(t => !existingIds.has(t.id));
        return [...prev, ...trulyNewTemplates];
    });
    setProductBatches(prev => [...prev, ...newBatches]);
    toast({
        title: "Import Successful",
        description: `${newBatches.length} batches and ${newTemplates.length} new templates were imported.`
    });
  };


  const filteredProductTemplates = useMemo(() => productTemplates.filter(template =>
    template.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (productCategoryFilter === ALL_FILTER_VALUE || template.productCategory === productCategoryFilter)
  ), [productTemplates, searchTerm, productCategoryFilter]);
  
  const productCategories = useMemo(() => Array.from(new Set(productTemplates.map(pt => pt.productCategory))), [productTemplates]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product definitions and their inventory batches.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
                <Upload className="mr-2 h-5 w-5" />
                Import from CSV
            </Button>
            <Button onClick={handleAddProductTemplate} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Template
            </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 border rounded-lg bg-card">
        <Input
          type="text"
          placeholder="Search product templates by name..."
          className="flex-grow p-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:ring-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
            <SelectTrigger className="md:w-[200px] bg-input text-foreground focus:ring-ring focus:ring-2">
                <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Categories</SelectItem>
                {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      <ProductTable
        productTemplates={filteredProductTemplates}
        productBatches={productBatches}
        onEdit={handleEditProductTemplate}
        onDelete={handleDeleteProductTemplate}
        onManageBatches={handleManageBatches}
      />
      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSave={handleSaveProductTemplate}
        product={editingProductTemplate}
      />
      {managingBatchesForTemplate && (
        <BatchDialog
          isOpen={isBatchDialogOpen}
          onClose={() => {
            setIsBatchDialogOpen(false);
            setManagingBatchesForTemplate(null);
          }}
          productTemplate={managingBatchesForTemplate}
          allProductBatches={productBatches}
          onSaveBatch={handleSaveBatch}
          onDeleteBatch={handleDeleteBatch}
        />
      )}
      <ProductImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleDataImport}
        existingTemplates={productTemplates}
      />
    </div>
  );
}
