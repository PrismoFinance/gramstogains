
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  strainType: z.enum(['Indica', 'Sativa', 'Hybrid', 'CBD', 'Other']),
  thcPercentage: z.number().min(0, 'THC % must be non-negative').max(100, 'THC % cannot exceed 100'),
  cbdPercentage: z.number().min(0, 'CBD % must be non-negative').max(100, 'CBD % cannot exceed 100'),
  productCategory: z.enum(['Flower', 'Concentrates', 'Edibles', 'Vapes', 'Topicals', 'Pre-Rolls', 'Other']),
  unitOfMeasure: z.enum(['Grams', 'Ounces', 'Each', 'Milligrams', 'Other']),
  wholesalePricePerUnit: z.number().min(0.01, 'Price must be greater than 0'),
  currentStockQuantity: z.number().min(0, 'Stock cannot be negative').int('Stock must be a whole number'),
  supplier: z.string().min(1, "Supplier name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  activeStatus: z.boolean(),
  metrcPackageId: z.string().optional().or(z.literal('')), // Added METRC Package ID
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const strainTypes: Product['strainType'][] = ['Indica', 'Sativa', 'Hybrid', 'CBD', 'Other'];
const productCategories: Product['productCategory'][] = ['Flower', 'Concentrates', 'Edibles', 'Vapes', 'Topicals', 'Pre-Rolls', 'Other'];
const unitsOfMeasure: Product['unitOfMeasure'][] = ['Grams', 'Ounces', 'Each', 'Milligrams', 'Other'];

export function ProductDialog({ isOpen, onClose, onSave, product }: ProductDialogProps) {
  const { toast } = useToast();
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      strainType: 'Other',
      thcPercentage: 0,
      cbdPercentage: 0,
      productCategory: 'Other',
      unitOfMeasure: 'Each',
      wholesalePricePerUnit: 0,
      currentStockQuantity: 0,
      supplier: '',
      description: '',
      imageUrl: '',
      activeStatus: true,
      metrcPackageId: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          productName: product.productName,
          strainType: product.strainType,
          thcPercentage: product.thcPercentage,
          cbdPercentage: product.cbdPercentage,
          productCategory: product.productCategory,
          unitOfMeasure: product.unitOfMeasure,
          wholesalePricePerUnit: product.wholesalePricePerUnit,
          currentStockQuantity: product.currentStockQuantity,
          supplier: product.supplier,
          description: product.description || '',
          imageUrl: product.imageUrl || '',
          activeStatus: product.activeStatus,
          metrcPackageId: product.metrcPackageId || '',
        });
      } else {
        reset({ 
          productName: '',
          strainType: 'Other',
          thcPercentage: 0,
          cbdPercentage: 0,
          productCategory: 'Other',
          unitOfMeasure: 'Each',
          wholesalePricePerUnit: 0,
          currentStockQuantity: 0,
          supplier: '',
          description: '',
          imageUrl: '',
          activeStatus: true,
          metrcPackageId: '',
        });
      }
    }
  }, [product, isOpen, reset]);

  const onSubmit = (data: ProductFormValues) => {
    const productToSave: Product = {
      ...data,
      id: product?.id || `prod${Date.now()}`, 
      wholesalePricePerUnit: Number(data.wholesalePricePerUnit),
      currentStockQuantity: Number(data.currentStockQuantity),
      thcPercentage: Number(data.thcPercentage),
      cbdPercentage: Number(data.cbdPercentage),
      metrcPackageId: data.metrcPackageId || undefined,
    };
    onSave(productToSave);
    toast({ title: product ? 'Product Updated' : 'Product Added', description: `${data.productName} has been saved successfully.` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of this product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input id="productName" {...register('productName')} className={errors.productName ? 'border-destructive' : ''} />
            {errors.productName && <p className="text-sm text-destructive mt-1">{errors.productName.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strainType">Strain Type</Label>
              <Controller
                  name="strainType"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="strainType" className={errors.strainType ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select strain type" />
                          </SelectTrigger>
                          <SelectContent>
                              {strainTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.strainType && <p className="text-sm text-destructive mt-1">{errors.strainType.message}</p>}
            </div>
            <div>
              <Label htmlFor="productCategory">Product Category</Label>
              <Controller
                  name="productCategory"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="productCategory" className={errors.productCategory ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                              {productCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.productCategory && <p className="text-sm text-destructive mt-1">{errors.productCategory.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="thcPercentage">THC %</Label>
              <Input id="thcPercentage" type="number" step="0.1" {...register('thcPercentage', { valueAsNumber: true })} className={errors.thcPercentage ? 'border-destructive' : ''} />
              {errors.thcPercentage && <p className="text-sm text-destructive mt-1">{errors.thcPercentage.message}</p>}
            </div>
            <div>
              <Label htmlFor="cbdPercentage">CBD %</Label>
              <Input id="cbdPercentage" type="number" step="0.1" {...register('cbdPercentage', { valueAsNumber: true })} className={errors.cbdPercentage ? 'border-destructive' : ''} />
              {errors.cbdPercentage && <p className="text-sm text-destructive mt-1">{errors.cbdPercentage.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wholesalePricePerUnit">Wholesale Price Per Unit</Label>
              <Input id="wholesalePricePerUnit" type="number" step="0.01" {...register('wholesalePricePerUnit', { valueAsNumber: true })} className={errors.wholesalePricePerUnit ? 'border-destructive' : ''} />
              {errors.wholesalePricePerUnit && <p className="text-sm text-destructive mt-1">{errors.wholesalePricePerUnit.message}</p>}
            </div>
            <div>
              <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
              <Controller
                  name="unitOfMeasure"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="unitOfMeasure" className={errors.unitOfMeasure ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                              {unitsOfMeasure.map((unit) => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.unitOfMeasure && <p className="text-sm text-destructive mt-1">{errors.unitOfMeasure.message}</p>}
            </div>
          </div>
           <div>
              <Label htmlFor="currentStockQuantity">Current Stock Quantity</Label>
              <Input id="currentStockQuantity" type="number" {...register('currentStockQuantity', { valueAsNumber: true })} className={errors.currentStockQuantity ? 'border-destructive' : ''} />
              {errors.currentStockQuantity && <p className="text-sm text-destructive mt-1">{errors.currentStockQuantity.message}</p>}
            </div>
          
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" {...register('supplier')} className={errors.supplier ? 'border-destructive' : ''} />
            {errors.supplier && <p className="text-sm text-destructive mt-1">{errors.supplier.message}</p>}
          </div>

          <div>
            <Label htmlFor="metrcPackageId">METRC Package ID (Optional)</Label>
            <Input id="metrcPackageId" {...register('metrcPackageId')} className={errors.metrcPackageId ? 'border-destructive' : ''} placeholder="e.g. PKG00012345X"/>
            {errors.metrcPackageId && <p className="text-sm text-destructive mt-1">{errors.metrcPackageId.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL (Optional, e.g. https://placehold.co/300x200.png)</Label>
            <Input id="imageUrl" {...register('imageUrl')} className={errors.imageUrl ? 'border-destructive' : ''} placeholder="https://your-image-url.com/image.png"/>
            {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="activeStatus"
              control={control}
              render={({ field }) => (
                <Switch
                  id="activeStatus"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="activeStatus">Active Product</Label>
          </div>
          {errors.activeStatus && <p className="text-sm text-destructive mt-1">{errors.activeStatus.message}</p>}


          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
