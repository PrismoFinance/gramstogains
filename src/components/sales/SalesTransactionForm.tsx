
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import type { ProductTemplate, ProductBatch, User, WholesaleOrder, Dispensary, ProductOrdered } from '@/lib/types';
import { mockWholesaleOrders, mockProductTemplates, mockProductBatches } from '@/lib/mock-data'; 
import { Loader2, PlusCircle, Trash2, CalendarIcon, Tag, Layers } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Schema for one item in the order, referencing a specific batch
const productOrderedSchema = z.object({
  productTemplateId: z.string().min(1, "Product template is required"),
  productBatchId: z.string().min(1, "Product batch is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  // metrcPackageId is derived from productBatchId, not directly input here
});

const wholesaleOrderSchema = z.object({
  dispensaryId: z.string().min(1, 'Dispensary is required'),
  orderDate: z.date({ required_error: "Order date is required." }),
  productsOrdered: z.array(productOrderedSchema).min(1, "At least one product must be added to the order"),
  paymentMethod: z.enum(['Cash', 'Credit Card', 'Debit Card', 'ACH', 'Check', 'Other']),
  paymentTerms: z.enum(['Net 15', 'Net 30', 'Net 60', 'Due on Receipt', 'Prepaid']),
  paymentStatus: z.enum(['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled']),
  metrcManifestId: z.string().optional(),
  shipmentDate: z.date().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type WholesaleOrderFormValues = z.infer<typeof wholesaleOrderSchema>;

interface WholesaleOrderFormProps {
  productTemplates: ProductTemplate[];
  productBatches: ProductBatch[]; // All available batches
  dispensaries: Dispensary[];
  currentUser: User;
}

export function WholesaleOrderForm({ productTemplates, productBatches, dispensaries, currentUser }: WholesaleOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const defaultProductOrderItem = { productTemplateId: '', productBatchId: '', quantity: 1 };

  const { control, handleSubmit, watch, setValue, reset, getValues, formState: { errors } } = useForm<WholesaleOrderFormValues>({
    resolver: zodResolver(wholesaleOrderSchema),
    defaultValues: {
      dispensaryId: '',
      orderDate: new Date(),
      productsOrdered: [defaultProductOrderItem],
      paymentMethod: 'ACH',
      paymentTerms: 'Net 30',
      paymentStatus: 'Pending',
      metrcManifestId: '',
      notes: '',
      trackingNumber: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productsOrdered"
  });

  const watchedProductsOrdered = watch("productsOrdered");
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  useEffect(() => {
    let total = 0;
    watchedProductsOrdered.forEach(item => {
      const batch = productBatches.find(b => b.id === item.productBatchId);
      if (batch && item.quantity > 0) {
        total += batch.wholesalePricePerUnit * item.quantity;
      }
    });
    setTotalOrderAmount(total);
  }, [watchedProductsOrdered, productBatches]);


  const onSubmit = async (data: WholesaleOrderFormValues) => {
    setIsSubmitting(true);

    const productsOrderedWithDetails: ProductOrdered[] = [];
    for (const item of data.productsOrdered) {
      const template = productTemplates.find(pt => pt.id === item.productTemplateId);
      const batch = productBatches.find(b => b.id === item.productBatchId);

      if (!template || !batch) {
        toast({ title: 'Error', description: `Invalid product or batch selected.`, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
      if (item.quantity > batch.currentStockQuantity) {
        toast({ title: 'Error', description: `Not enough stock for ${template.productName} (Batch: ${batch.metrcPackageId}). Available: ${batch.currentStockQuantity}`, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
      productsOrderedWithDetails.push({
        productTemplateId: template.id,
        productBatchId: batch.id,
        productName: template.productName,
        batchMetrcPackageId: batch.metrcPackageId,
        quantity: item.quantity,
        wholesalePricePerUnit: batch.wholesalePricePerUnit,
        subtotal: batch.wholesalePricePerUnit * item.quantity,
        thcPercentageAtSale: batch.thcPercentage,
        cbdPercentageAtSale: batch.cbdPercentage,
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const newWholesaleOrder: WholesaleOrder = {
      id: `order${Date.now()}`,
      dispensaryId: data.dispensaryId,
      dispensaryName: dispensaries.find(d => d.id === data.dispensaryId)?.dispensaryName,
      orderDate: data.orderDate.toISOString(),
      productsOrdered: productsOrderedWithDetails,
      totalOrderAmount: productsOrderedWithDetails.reduce((sum, item) => sum + item.subtotal, 0),
      paymentMethod: data.paymentMethod,
      paymentTerms: data.paymentTerms,
      paymentStatus: data.paymentStatus,
      salesAssociateId: currentUser.id,
      salesAssociateName: currentUser.username,
      metrcManifestId: data.metrcManifestId,
      shipmentDate: data.shipmentDate?.toISOString(),
      trackingNumber: data.trackingNumber,
      notes: data.notes,
    };

    // Update mock data (in a real app, this would be an API call)
    mockWholesaleOrders.push(newWholesaleOrder);
    productsOrderedWithDetails.forEach(orderedProd => {
        const batchIndex = mockProductBatches.findIndex(b => b.id === orderedProd.productBatchId);
        if (batchIndex !== -1) {
            mockProductBatches[batchIndex].currentStockQuantity -= orderedProd.quantity;
        }
    });
    
    toast({ title: 'Wholesale Order Created!', description: `Order ${newWholesaleOrder.id} for ${newWholesaleOrder.dispensaryName} totalling $${newWholesaleOrder.totalOrderAmount.toFixed(2)} recorded.` });
    reset(); 
    setValue("productsOrdered", [defaultProductOrderItem]); // Reset field array explicitly
    setTotalOrderAmount(0);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dispensary and Order Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dispensaryId">Dispensary</Label>
          <Controller
            name="dispensaryId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="dispensaryId" className={errors.dispensaryId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a dispensary" />
                </SelectTrigger>
                <SelectContent>
                  {dispensaries.map((dispensary) => (
                    <SelectItem key={dispensary.id} value={dispensary.id}>
                      {dispensary.dispensaryName} ({dispensary.licenseNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.dispensaryId && <p className="text-sm text-destructive mt-1">{errors.dispensaryId.message}</p>}
        </div>
        <div>
            <Label htmlFor="orderDate">Order Date</Label>
            <Controller
                name="orderDate"
                control={control}
                render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground", errors.orderDate ? "border-destructive" : "" )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent>
                    </Popover>
                )} />
            {errors.orderDate && <p className="text-sm text-destructive mt-1">{errors.orderDate.message}</p>}
        </div>
      </div>

      {/* Products Ordered Section */}
      <div className="space-y-4">
        <Label>Products Ordered</Label>
        {fields.map((item, index) => {
          const selectedTemplateId = watch(`productsOrdered.${index}.productTemplateId`);
          const availableBatches = productBatches.filter(b => b.productTemplateId === selectedTemplateId && b.activeStatus && b.currentStockQuantity > 0);
          const selectedBatchId = watch(`productsOrdered.${index}.productBatchId`);
          const selectedBatchDetails = productBatches.find(b => b.id === selectedBatchId);

          return (
            <div key={item.id} className="p-3 border rounded-md bg-muted/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* Product Template Select */}
                <div className="flex-grow">
                  <Label htmlFor={`productsOrdered.${index}.productTemplateId`}>Product Template</Label>
                  <Controller
                    name={`productsOrdered.${index}.productTemplateId`}
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue(`productsOrdered.${index}.productBatchId`, ''); // Reset batch on template change
                        }} 
                        value={field.value}
                      >
                        <SelectTrigger className={errors.productsOrdered?.[index]?.productTemplateId ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select product template" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTemplates.filter(pt => pt.activeStatus).map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.productName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.productsOrdered?.[index]?.productTemplateId && <p className="text-sm text-destructive mt-1">{errors.productsOrdered?.[index]?.productTemplateId?.message}</p>}
                </div>

                {/* Product Batch Select (Dynamic) */}
                <div className="flex-grow">
                  <Label htmlFor={`productsOrdered.${index}.productBatchId`}>Batch (METRC ID)</Label>
                  <Controller
                    name={`productsOrdered.${index}.productBatchId`}
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedTemplateId || availableBatches.length === 0}>
                        <SelectTrigger className={errors.productsOrdered?.[index]?.productBatchId ? 'border-destructive' : ''}>
                          <SelectValue placeholder={!selectedTemplateId ? "Select template first" : availableBatches.length === 0 ? "No active batches" : "Select batch"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBatches.map(batch => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.metrcPackageId} (Stock: {batch.currentStockQuantity}, THC: {batch.thcPercentage.toFixed(1)}%, Price: ${batch.wholesalePricePerUnit.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.productsOrdered?.[index]?.productBatchId && <p className="text-sm text-destructive mt-1">{errors.productsOrdered?.[index]?.productBatchId?.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                {/* Quantity Input */}
                <div className="sm:col-span-1">
                  <Label htmlFor={`productsOrdered.${index}.quantity`}>Quantity</Label>
                  <Controller
                    name={`productsOrdered.${index}.quantity`}
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min="1"
                        max={selectedBatchDetails?.currentStockQuantity || undefined}
                        {...field}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10) || 0;
                          field.onChange(val);
                        }}
                        className={errors.productsOrdered?.[index]?.quantity ? 'border-destructive' : ''}
                        disabled={!selectedBatchId}
                      />
                    )}
                  />
                  {errors.productsOrdered?.[index]?.quantity && <p className="text-sm text-destructive mt-1">{errors.productsOrdered?.[index]?.quantity?.message}</p>}
                  {selectedBatchDetails && watch(`productsOrdered.${index}.quantity`) > selectedBatchDetails.currentStockQuantity && (
                    <p className="text-sm text-destructive mt-1">Max stock: {selectedBatchDetails.currentStockQuantity}</p>
                  )}
                </div>

                {/* Batch Info Display */}
                <div className="sm:col-span-1 mt-2 sm:mt-0 flex items-end">
                  {selectedBatchDetails && (
                    <Badge variant="outline" className="text-xs gap-1 whitespace-nowrap h-10 flex items-center px-3">
                        <Tag className="h-3 w-3"/> Price: ${selectedBatchDetails.wholesalePricePerUnit.toFixed(2)}
                    </Badge>
                  )}
                </div>

                {/* Remove Button */}
                <div className="sm:col-span-1 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10 self-end">
                    <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove Item</span>
                    </Button>
                </div>
              </div>
            </div>
          );
        })}
        <Button type="button" variant="outline" size="sm" onClick={() => append(defaultProductOrderItem)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product Item
        </Button>
        {errors.productsOrdered && typeof errors.productsOrdered === 'object' && !Array.isArray(errors.productsOrdered) && (
            <p className="text-sm text-destructive mt-1">{errors.productsOrdered.message}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="p-4 border rounded-md bg-muted/50">
        <h4 className="font-medium mb-2">Order Summary:</h4>
        {watchedProductsOrdered.map((item, index) => {
          const template = productTemplates.find(pt => pt.id === item.productTemplateId);
          const batch = productBatches.find(b => b.id === item.productBatchId);
          if (!template || !batch || item.quantity <= 0) return null;
          return (
            <div key={index} className="flex justify-between text-sm items-center py-1 border-b last:border-b-0">
              <div>
                {template.productName} <br/>
                <Badge variant="outline" className="text-xs font-normal">Batch: {batch.metrcPackageId}</Badge>
                <span className="text-muted-foreground"> (x{item.quantity})</span>
              </div>
              <span>${(batch.wholesalePricePerUnit * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <hr className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Order Amount:</span>
          <span>${totalOrderAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment and Shipping Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Controller name="paymentMethod" control={control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}> <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}><SelectValue /></SelectTrigger> <SelectContent> {(['Cash', 'Credit Card', 'Debit Card', 'ACH', 'Check', 'Other'] as const).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)} </SelectContent> </Select> )} />
            {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
        </div>
        <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Controller name="paymentTerms" control={control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}> <SelectTrigger className={errors.paymentTerms ? 'border-destructive' : ''}><SelectValue /></SelectTrigger> <SelectContent> {(['Net 15', 'Net 30', 'Net 60', 'Due on Receipt', 'Prepaid'] as const).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)} </SelectContent> </Select> )} />
            {errors.paymentTerms && <p className="text-sm text-destructive mt-1">{errors.paymentTerms.message}</p>}
        </div>
        <div>
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Controller name="paymentStatus" control={control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}> <SelectTrigger className={errors.paymentStatus ? 'border-destructive' : ''}><SelectValue /></SelectTrigger> <SelectContent> {(['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)} </SelectContent> </Select> )} />
            {errors.paymentStatus && <p className="text-sm text-destructive mt-1">{errors.paymentStatus.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="metrcManifestId">Metrc Manifest ID (Optional)</Label>
            <Input id="metrcManifestId" {...control.register("metrcManifestId")} className={errors.metrcManifestId ? 'border-destructive' : ''} />
            {errors.metrcManifestId && <p className="text-sm text-destructive mt-1">{errors.metrcManifestId.message}</p>}
        </div>
        <div>
            <Label htmlFor="shipmentDate">Shipment Date (Optional)</Label>
            <Controller name="shipmentDate" control={control} render={({ field }) => ( <Popover> <PopoverTrigger asChild> <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground", errors.shipmentDate ? "border-destructive" : "" )}> <CalendarIcon className="mr-2 h-4 w-4" /> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} </Button> </PopoverTrigger> <PopoverContent className="w-auto p-0"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> )} />
             {errors.shipmentDate && <p className="text-sm text-destructive mt-1">{errors.shipmentDate.message}</p>}
        </div>
      </div>
        <div>
            <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
            <Input id="trackingNumber" {...control.register("trackingNumber")} className={errors.trackingNumber ? 'border-destructive' : ''} />
             {errors.trackingNumber && <p className="text-sm text-destructive mt-1">{errors.trackingNumber.message}</p>}
        </div>
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" {...control.register("notes")} className={errors.notes ? 'border-destructive' : ''} />
         {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
      </div>
      
      <div>
        <Label>Sales Associate</Label>
        <Input type="text" value={currentUser.username} readOnly disabled className="bg-muted/50" />
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Wholesale Order'}
      </Button>
    </form>
  );
}
