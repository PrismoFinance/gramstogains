
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductDialog } from '@/components/products/ProductDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockProductTemplates as initialMockProductTemplates, mockProductBatches as initialMockProductBatches } from '@/lib/mock-data'; // Updated mock data
import type { ProductTemplate, ProductBatch } from '@/lib/types'; // Updated types
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ALL_FILTER_VALUE = "_all_";

export default function ProductsPage() {
  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>(initialMockProductTemplates);
  const [productBatches, setProductBatches] = useState<ProductBatch[]>(initialMockProductBatches); // Added state for batches
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProductTemplate, setEditingProductTemplate] = useState<ProductTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState(ALL_FILTER_VALUE);

  const { user } = useAuth();
  const router = useRouter();

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
    setIsDialogOpen(true);
  };

  const handleEditProductTemplate = (template: ProductTemplate) => {
    setEditingProductTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteProductTemplate = (templateId: string) => {
    setProductTemplates(productTemplates.filter(pt => pt.id !== templateId));
    // Also remove associated batches
    setProductBatches(productBatches.filter(pb => pb.productTemplateId !== templateId));
    // In a real app, call an API to delete template and its batches
  };

  const handleSaveProductTemplate = (template: ProductTemplate) => {
    if (editingProductTemplate) {
      setProductTemplates(productTemplates.map(pt => (pt.id === template.id ? template : pt)));
    } else {
      const newTemplateWithId = { ...template, id: template.id || `pt${Date.now()}` };
      setProductTemplates([...productTemplates, newTemplateWithId]);
    }
    // In a real app, call an API to save
  };

  // TODO: Implement batch management (add, edit, delete individual batches)
  // const handleManageBatches = (templateId: string) => {
  //   console.log("Manage batches for template ID:", templateId);
  //   // This would typically open a new dialog or navigate to a batch management page
  // };

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
          <p className="text-muted-foreground">Manage your product definitions. Batches are managed separately.</p>
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
        productBatches={productBatches} // Pass batches for aggregate calculations
        onEdit={handleEditProductTemplate}
        onDelete={handleDeleteProductTemplate}
        // onManageBatches={handleManageBatches}
      />
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProductTemplate}
        product={editingProductTemplate}
      />
    </div>
  );
}
