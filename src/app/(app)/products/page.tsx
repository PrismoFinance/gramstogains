
'use client';

import React, { useState, useEffect } from 'react';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductDialog } from '@/components/products/ProductDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockProducts as initialMockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialMockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState(''); // Renamed from categoryFilter

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    // In a real app, call an API to delete
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    } else {
      // For new products, ensure a unique ID if not already set by dialog (though dialog does set it)
      const newProductWithId = { ...product, id: product.id || `prod${Date.now()}` };
      setProducts([...products, newProductWithId]);
    }
    // In a real app, call an API to save
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (productCategoryFilter === '' || product.productCategory === productCategoryFilter)
  );
  
  // Get unique product categories from the current list of products
  const productCategories = Array.from(new Set(products.map(p => p.productCategory)));


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your inventory and product details for wholesale.</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Product
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 border rounded-lg bg-card">
        <Input
          type="text"
          placeholder="Search products by name..."
          className="flex-grow p-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:ring-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
            <SelectTrigger className="md:w-[200px] bg-input text-foreground focus:ring-ring focus:ring-2">
                <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
