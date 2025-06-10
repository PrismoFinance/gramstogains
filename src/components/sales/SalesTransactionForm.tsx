'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Product, User, Sale } from '@/lib/types';
import { mockSales } from '@/lib/mock-data'; // For mock data storage
import { Loader2 } from 'lucide-react';

const saleSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  // salesAssociateId is auto-filled
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface SalesTransactionFormProps {
  products: Product[];
  currentUser: User;
}

export function SalesTransactionForm({ products, currentUser }: SalesTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
    },
  });

  const selectedProductId = watch('productId');
  const quantity = watch('quantity');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId, products]);

  useEffect(() => {
    if (selectedProduct && quantity > 0) {
      setTotalAmount(selectedProduct.price * quantity);
    } else {
      setTotalAmount(0);
    }
  }, [selectedProduct, quantity]);

  const onSubmit = async (data: SaleFormValues) => {
    setIsSubmitting(true);
    if (!selectedProduct) {
      toast({ title: 'Error', description: 'Please select a valid product.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    if (data.quantity > selectedProduct.stock) {
      toast({ title: 'Error', description: `Not enough stock for ${selectedProduct.name}. Available: ${selectedProduct.stock}`, variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSale: Sale = {
      id: `sale${Date.now()}`, // Simple unique ID
      productId: data.productId,
      productName: selectedProduct.name,
      quantity: data.quantity,
      unitPrice: selectedProduct.price,
      totalAmount: selectedProduct.price * data.quantity,
      saleDate: new Date().toISOString(),
      salesAssociateId: currentUser.id,
      salesAssociateName: currentUser.username,
    };

    // Update mock data (in a real app, this would be an API call)
    mockSales.push(newSale);
    const productIndex = products.findIndex(p => p.id === data.productId);
    if (productIndex !== -1) {
      products[productIndex].stock -= data.quantity;
    }
    
    toast({ title: 'Sale Recorded!', description: `${selectedProduct.name} (x${data.quantity}) sold for $${newSale.totalAmount.toFixed(2)}.` });
    reset();
    setSelectedProduct(null);
    setTotalAmount(0);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="productId">Product</Label>
        <Controller
          name="productId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="productId" className={errors.productId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                    {product.name} (Stock: {product.stock}) - ${product.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.productId && <p className="text-sm text-destructive mt-1">{errors.productId.message}</p>}
      </div>

      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
                <Input
                    id="quantity"
                    type="number"
                    min="1"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                    className={errors.quantity ? 'border-destructive' : ''}
                />
            )}
        />
        {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
        {selectedProduct && quantity > selectedProduct.stock && (
          <p className="text-sm text-destructive mt-1">Quantity exceeds available stock ({selectedProduct.stock}).</p>
        )}
      </div>

      {selectedProduct && (
        <div className="p-4 border rounded-md bg-muted/50">
          <h4 className="font-medium mb-2">Order Summary:</h4>
          <p>Product: {selectedProduct.name}</p>
          <p>Unit Price: ${selectedProduct.price.toFixed(2)}</p>
          <p>Quantity: {quantity}</p>
          <p className="font-semibold mt-1">Total: ${totalAmount.toFixed(2)}</p>
        </div>
      )}
      
      <div>
        <Label>Sales Associate</Label>
        <Input type="text" value={currentUser.username} readOnly disabled className="bg-muted/50" />
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting || !selectedProduct || quantity <= 0 || (selectedProduct !== null && quantity > selectedProduct.stock) }>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Record Sale'}
      </Button>
    </form>
  );
}
