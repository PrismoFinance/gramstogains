
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { Switch } from '@/components/ui/switch';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ProductBatch, ProductTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, CalendarIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const productBatchFormSchema = z.object({
  metrcPackageId: z.string().min(1, "METRC Package ID is required"),
  thcPercentage: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0, "THC must be non-negative").max(100, "THC cannot exceed 100")
  ),
  cbdPercentage: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0, "CBD must be non-negative").max(100, "CBD cannot exceed 100")
  ),
  wholesalePricePerUnit: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0, "Price must be non-negative")
  ),
  currentStockQuantity: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().min(0, "Stock must be non-negative").int("Stock must be a whole number")
  ),
  productionDate: z.date().optional().nullable(),
  expirationDate: z.date().optional().nullable(),
  activeStatus: z.boolean(),
});

type ProductBatchFormValues = z.infer<typeof productBatchFormSchema>;

interface BatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTemplate: ProductTemplate | null;
  allProductBatches: ProductBatch[]; // All batches to filter from
  onSaveBatch: (batch: ProductBatch, isNew: boolean) => void;
  onDeleteBatch: (batchId: string) => void;
}

export function BatchDialog({
  isOpen,
  onClose,
  productTemplate,
  allProductBatches,
  onSaveBatch,
  onDeleteBatch,
}: BatchDialogProps) {
  const { toast } = useToast();
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);

  const productBatchesForTemplate = useMemo(() => {
    return productTemplate ? allProductBatches.filter(b => b.productTemplateId === productTemplate.id) : [];
  }, [productTemplate, allProductBatches]);

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductBatchFormValues>({
    resolver: zodResolver(productBatchFormSchema),
    defaultValues: {
      metrcPackageId: '',
      thcPercentage: 0,
      cbdPercentage: 0,
      wholesalePricePerUnit: 0,
      currentStockQuantity: 0,
      productionDate: null,
      expirationDate: null,
      activeStatus: true,
    }
  });

  useEffect(() => {
    if (!isOpen) {
      setIsBatchFormOpen(false);
      setEditingBatch(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isBatchFormOpen) {
      if (editingBatch) {
        reset({
          metrcPackageId: editingBatch.metrcPackageId,
          thcPercentage: editingBatch.thcPercentage,
          cbdPercentage: editingBatch.cbdPercentage,
          wholesalePricePerUnit: editingBatch.wholesalePricePerUnit,
          currentStockQuantity: editingBatch.currentStockQuantity,
          productionDate: editingBatch.productionDate ? new Date(editingBatch.productionDate) : null,
          expirationDate: editingBatch.expirationDate ? new Date(editingBatch.expirationDate) : null,
          activeStatus: editingBatch.activeStatus,
        });
      } else {
        reset({
          metrcPackageId: '',
          thcPercentage: 0,
          cbdPercentage: 0,
          wholesalePricePerUnit: 0, // Consider defaulting from template or last batch
          currentStockQuantity: 0,
          productionDate: new Date(),
          expirationDate: null,
          activeStatus: true,
        });
      }
    }
  }, [editingBatch, isBatchFormOpen, reset]);

  const handleAddNewBatch = () => {
    setEditingBatch(null);
    setIsBatchFormOpen(true);
  };

  const handleEditBatch = (batch: ProductBatch) => {
    setEditingBatch(batch);
    setIsBatchFormOpen(true);
  };

  const onSubmitBatch = (data: ProductBatchFormValues) => {
    if (!productTemplate) return;

    const batchToSave: ProductBatch = {
      ...data,
      id: editingBatch?.id || `batch_${Date.now()}`,
      productTemplateId: productTemplate.id,
      unitOfMeasure: productTemplate.unitOfMeasure, // Inherit from template
      productionDate: data.productionDate ? data.productionDate.toISOString() : undefined,
      expirationDate: data.expirationDate ? data.expirationDate.toISOString() : undefined,
    };
    onSaveBatch(batchToSave, !editingBatch);
    setIsBatchFormOpen(false);
    setEditingBatch(null);
  };
  
  if (!productTemplate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-card max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">Manage Batches for: {productTemplate.productName}</DialogTitle>
          <DialogDescription>
            View, add, or edit inventory batches for this product template. Unit of Measure: {productTemplate.unitOfMeasure}
          </DialogDescription>
        </DialogHeader>

        {!isBatchFormOpen ? (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={handleAddNewBatch}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Batch
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>METRC ID</TableHead>
                    <TableHead className="text-right">THC%</TableHead>
                    <TableHead className="text-right">CBD%</TableHead>
                    <TableHead className="text-right">Price/Unit</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Prod. Date</TableHead>
                    <TableHead>Exp. Date</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productBatchesForTemplate.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No batches found for this template.</TableCell></TableRow>
                  ) : (
                    productBatchesForTemplate.map(batch => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.metrcPackageId}</TableCell>
                      <TableCell className="text-right">{batch.thcPercentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{batch.cbdPercentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">${batch.wholesalePricePerUnit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{batch.currentStockQuantity}</TableCell>
                      <TableCell>{batch.productionDate ? format(new Date(batch.productionDate), 'MM/dd/yy') : 'N/A'}</TableCell>
                      <TableCell>{batch.expirationDate ? format(new Date(batch.expirationDate), 'MM/dd/yy') : 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        {batch.activeStatus ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : <XCircle className="h-5 w-5 text-destructive mx-auto" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditBatch(batch)} className="hover:text-accent mr-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Batch {batch.metrcPackageId}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the batch.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDeleteBatch(batch.id)}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmitBatch)} className="space-y-4 py-2 flex-grow overflow-y-auto">
            <div>
              <Label htmlFor="metrcPackageId">METRC Package ID</Label>
              <Input id="metrcPackageId" {...register('metrcPackageId')} className={errors.metrcPackageId ? 'border-destructive' : ''} />
              {errors.metrcPackageId && <p className="text-sm text-destructive mt-1">{errors.metrcPackageId.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="thcPercentage">THC Percentage (%)</Label>
                <Input id="thcPercentage" type="number" step="0.1" {...register('thcPercentage')} className={errors.thcPercentage ? 'border-destructive' : ''} />
                {errors.thcPercentage && <p className="text-sm text-destructive mt-1">{errors.thcPercentage.message}</p>}
              </div>
              <div>
                <Label htmlFor="cbdPercentage">CBD Percentage (%)</Label>
                <Input id="cbdPercentage" type="number" step="0.1" {...register('cbdPercentage')} className={errors.cbdPercentage ? 'border-destructive' : ''} />
                {errors.cbdPercentage && <p className="text-sm text-destructive mt-1">{errors.cbdPercentage.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wholesalePricePerUnit">Wholesale Price per Unit ($)</Label>
                <Input id="wholesalePricePerUnit" type="number" step="0.01" {...register('wholesalePricePerUnit')} className={errors.wholesalePricePerUnit ? 'border-destructive' : ''} />
                {errors.wholesalePricePerUnit && <p className="text-sm text-destructive mt-1">{errors.wholesalePricePerUnit.message}</p>}
              </div>
              <div>
                <Label htmlFor="currentStockQuantity">Current Stock Quantity ({productTemplate.unitOfMeasure})</Label>
                <Input id="currentStockQuantity" type="number" {...register('currentStockQuantity')} className={errors.currentStockQuantity ? 'border-destructive' : ''} />
                {errors.currentStockQuantity && <p className="text-sm text-destructive mt-1">{errors.currentStockQuantity.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productionDate">Production Date (Optional)</Label>
                 <Controller name="productionDate" control={control} render={({ field }) => ( <Popover> <PopoverTrigger asChild> <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground", errors.productionDate && "border-destructive" )}> <CalendarIcon className="mr-2 h-4 w-4" /> {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>} </Button> </PopoverTrigger> <PopoverContent className="w-auto p-0"> <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> )} />
                {errors.productionDate && <p className="text-sm text-destructive mt-1">{errors.productionDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                <Controller name="expirationDate" control={control} render={({ field }) => ( <Popover> <PopoverTrigger asChild> <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground", errors.expirationDate && "border-destructive" )}> <CalendarIcon className="mr-2 h-4 w-4" /> {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>} </Button> </PopoverTrigger> <PopoverContent className="w-auto p-0"> <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> )} />
                {errors.expirationDate && <p className="text-sm text-destructive mt-1">{errors.expirationDate.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Controller name="activeStatus" control={control} render={({ field }) => ( <Switch id="activeStatus" checked={field.value} onCheckedChange={field.onChange} /> )} />
              <Label htmlFor="activeStatus">Batch is Active (available for sale)</Label>
            </div>
            {errors.activeStatus && <p className="text-sm text-destructive mt-1">{errors.activeStatus.message}</p>}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsBatchFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingBatch ? 'Save Changes' : 'Add Batch')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
