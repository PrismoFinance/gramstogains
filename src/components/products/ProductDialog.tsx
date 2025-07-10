
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
import type { ProductTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const productTemplateSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  strainType: z.enum(['Indica', 'Sativa', 'Hybrid', 'CBD', 'Other']),
  productCategory: z.enum(['Flower', 'Concentrates', 'Edibles', 'Vapes', 'Topicals', 'Pre-Rolls', 'Other']),
  unitOfMeasure: z.enum(['Grams', 'Ounces', 'Each', 'Milligrams', 'Other']),
  supplier: z.string().min(1, "Supplier name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL for product image').optional().or(z.literal('')),
  coaUrl: z.string().url('Must be a valid URL for COA').optional().or(z.literal('')),
  activeStatus: z.boolean(),
});

type ProductTemplateFormValues = z.infer<typeof productTemplateSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productTemplate: ProductTemplate) => void;
  product: ProductTemplate | null;
}

const strainTypes: ProductTemplate['strainType'][] = ['Indica', 'Sativa', 'Hybrid', 'CBD', 'Other'];
const productCategories: ProductTemplate['productCategory'][] = ['Flower', 'Concentrates', 'Edibles', 'Vapes', 'Topicals', 'Pre-Rolls', 'Other'];
const unitsOfMeasure: ProductTemplate['unitOfMeasure'][] = ['Grams', 'Ounces', 'Each', 'Milligrams', 'Other'];

export function ProductDialog({ isOpen, onClose, onSave, product }: ProductDialogProps) {
  const { toast } = useToast();
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductTemplateFormValues>({
    resolver: zodResolver(productTemplateSchema),
    defaultValues: {
      productName: '',
      strainType: 'Other',
      productCategory: 'Other',
      unitOfMeasure: 'Each',
      supplier: '',
      description: '',
      imageUrl: '',
      coaUrl: '',
      activeStatus: true,
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          productName: product.productName,
          strainType: product.strainType,
          productCategory: product.productCategory,
          unitOfMeasure: product.unitOfMeasure,
          supplier: product.supplier,
          description: product.description || '',
          imageUrl: product.imageUrl || '',
          coaUrl: product.coaUrl || '',
          activeStatus: product.activeStatus,
        });
      } else {
        reset({ 
          productName: '',
          strainType: 'Other',
          productCategory: 'Other',
          unitOfMeasure: 'Each',
          supplier: '',
          description: '',
          imageUrl: '',
          coaUrl: '',
          activeStatus: true,
        });
      }
    }
  }, [product, isOpen, reset]);

  const onSubmit = (data: ProductTemplateFormValues) => {
    const productTemplateToSave: ProductTemplate = {
      ...data,
      id: product?.id || `pt${Date.now()}`, 
    };
    onSave(productTemplateToSave);
    toast({ title: product ? 'Product Template Updated' : 'Product Template Added', description: `${data.productName} has been saved successfully.` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{product ? 'Edit Product Template' : 'Add New Product Template'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of this product template.' : 'Fill in the details for the new product template.'}
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
          
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" {...register('supplier')} className={errors.supplier ? 'border-destructive' : ''} />
            {errors.supplier && <p className="text-sm text-destructive mt-1">{errors.supplier.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Product Image URL (Optional)</Label>
            <Input id="imageUrl" {...register('imageUrl')} className={errors.imageUrl ? 'border-destructive' : ''} placeholder="https://your-image-url.com/image.png"/>
            {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <Label htmlFor="coaUrl">COA Link (URL, Optional)</Label>
            <Input id="coaUrl" {...register('coaUrl')} className={errors.coaUrl ? 'border-destructive' : ''} placeholder="https://example.com/coa.pdf"/>
            {errors.coaUrl && <p className="text-sm text-destructive mt-1">{errors.coaUrl.message}</p>}
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
            <Label htmlFor="activeStatus">Active Product Template</Label>
          </div>
          {errors.activeStatus && <p className="text-sm text-destructive mt-1">{errors.activeStatus.message}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Add Product Template')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
