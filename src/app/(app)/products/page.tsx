
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductDialog } from '@/components/products/ProductDialog';
import { BatchDialog } from '@/components/products/BatchDialog'; // New import
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProductTemplate, setEditingProductTemplate] = useState<ProductTemplate | null>(null);
  
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false); // State for BatchDialog
  const [managingBatchesForTemplate, setManagingBatchesForTemplate] = useState<ProductTemplate | null>(null); // State for BatchDialog

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

  const filteredProductTemplates = useMemo(() => productTemplates.filter(template =>
    template.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (productCategoryFilter === ALL_FILTER_VALUE || template.productCategory === productCategoryFilter)
  ), [productTemplates, searchTerm, productCategoryFilter]);
  
  const productCategories = useMemo(() => Array.from(new Set(productTemplates.map(pt => pt.productCategory))), [productTemplates]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Product Template Management</h1>
          <p className="text-muted-foreground">Manage your product definitions and their inventory batches.</p>
        </div>
        <Button onClick={handleAddProductTemplate} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Product Template
        </Button>
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
        onManageBatches={handleManageBatches} // Pass new handler
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
          allProductBatches={productBatches} // Pass all batches
          onSaveBatch={handleSaveBatch}
          onDeleteBatch={handleDeleteBatch}
        />
      )}
    </div>
  );
}
