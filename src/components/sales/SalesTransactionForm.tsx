
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
import type { Product, User, WholesaleOrder, Dispensary, ProductOrdered } from '@/lib/types';
import { mockWholesaleOrders } from '@/lib/mock-data'; 
import { Loader2, PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';

const productOrderedSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  // wholesalePricePerUnit and subtotal will be calculated
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
  products: Product[];
  dispensaries: Dispensary[];
  currentUser: User;
}

export function WholesaleOrderForm({ products, dispensaries, currentUser }: WholesaleOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<WholesaleOrderFormValues>({
    resolver: zodResolver(wholesaleOrderSchema),
    defaultValues: {
      dispensaryId: '',
      orderDate: new Date(),
      productsOrdered: [{ productId: '', quantity: 1 }],
      paymentMethod: 'ACH',
      paymentTerms: 'Net 30',
      paymentStatus: 'Pending',
      metrcManifestId: '',
      notes: '',
      trackingNumber: '',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "productsOrdered"
  });

  const watchedProductsOrdered = watch("productsOrdered");
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  useEffect(() => {
    let total = 0;
    watchedProductsOrdered.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && item.quantity > 0) {
        total += product.wholesalePricePerUnit * item.quantity;
      }
    });
    setTotalOrderAmount(total);
  }, [watchedProductsOrdered, products]);


  const onSubmit = async (data: WholesaleOrderFormValues) => {
    setIsSubmitting(true);

    const productsOrderedWithDetails: ProductOrdered[] = data.productsOrdered.map(item => {
      const productDetails = products.find(p => p.id === item.productId);
      if (!productDetails) throw new Error("Invalid product in order."); // Should be caught by validation
      if (item.quantity > productDetails.currentStockQuantity) {
        toast({ title: 'Error', description: `Not enough stock for ${productDetails.productName}. Available: ${productDetails.currentStockQuantity}`, variant: 'destructive' });
        throw new Error("Not enough stock");
      }
      return {
        productId: item.productId,
        productName: productDetails.productName,
        quantity: item.quantity,
        wholesalePricePerUnit: productDetails.wholesalePricePerUnit,
        subtotal: productDetails.wholesalePricePerUnit * item.quantity,
      };
    }).filter(Boolean) as ProductOrdered[];

    if (productsOrderedWithDetails.some(item => !item)){
         setIsSubmitting(false);
         return;
    }


    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

    mockWholesaleOrders.push(newWholesaleOrder);
    productsOrderedWithDetails.forEach(orderedProd => {
        const productIndex = products.findIndex(p => p.id === orderedProd.productId);
        if (productIndex !== -1) {
            products[productIndex].currentStockQuantity -= orderedProd.quantity;
        }
    });
    
    toast({ title: 'Wholesale Order Created!', description: `Order ${newWholesaleOrder.id} for ${newWholesaleOrder.dispensaryName} totalling $${newWholesaleOrder.totalOrderAmount.toFixed(2)} recorded.` });
    reset();
    setTotalOrderAmount(0);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                    errors.orderDate ? "border-destructive" : ""
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                )}
            />
            {errors.orderDate && <p className="text-sm text-destructive mt-1">{errors.orderDate.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Products Ordered</Label>
        {fields.map((item, index) => {
          const selectedProductDetails = products.find(p => p.id === watchedProductsOrdered[index]?.productId);
          return (
            <div key={item.id} className="flex items-end gap-2 p-3 border rounded-md bg-muted/20">
              <div className="flex-grow">
                <Label htmlFor={`productsOrdered.${index}.productId`}>Product</Label>
                 <Controller
                    name={`productsOrdered.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            const product = products.find(p => p.id === value);
                            if (product && watchedProductsOrdered[index]?.quantity > product.currentStockQuantity) {
                                setValue(`productsOrdered.${index}.quantity`, product.currentStockQuantity);
                            }
                        }} value={field.value}>
                        <SelectTrigger className={errors.productsOrdered?.[index]?.productId ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.filter(p => p.activeStatus).map(product => (
                            <SelectItem key={product.id} value={product.id} disabled={product.currentStockQuantity === 0}>
                                {product.productName} (Stock: {product.currentStockQuantity}) - ${product.wholesalePricePerUnit.toFixed(2)}/{product.unitOfMeasure}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    )}
                />
                {errors.productsOrdered?.[index]?.productId && <p className="text-sm text-destructive mt-1">{errors.productsOrdered?.[index]?.productId?.message}</p>}
              </div>
              <div className="w-1/4">
                <Label htmlFor={`productsOrdered.${index}.quantity`}>Quantity</Label>
                <Controller
                    name={`productsOrdered.${index}.quantity`}
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={e => {
                                const val = parseInt(e.target.value, 10) || 0;
                                field.onChange(val);
                            }}
                            className={errors.productsOrdered?.[index]?.quantity ? 'border-destructive' : ''}
                        />
                    )}
                />
                {errors.productsOrdered?.[index]?.quantity && <p className="text-sm text-destructive mt-1">{errors.productsOrdered?.[index]?.quantity?.message}</p>}
                 {selectedProductDetails && watchedProductsOrdered[index]?.quantity > selectedProductDetails.currentStockQuantity && (
                    <p className="text-sm text-destructive mt-1">Max stock: {selectedProductDetails.currentStockQuantity}</p>
                )}
              </div>
              <div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: '', quantity: 1 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
        {errors.productsOrdered && typeof errors.productsOrdered === 'object' && !Array.isArray(errors.productsOrdered) && (
            <p className="text-sm text-destructive mt-1">{errors.productsOrdered.message}</p>
        )}
      </div>

      <div className="p-4 border rounded-md bg-muted/50">
        <h4 className="font-medium mb-2">Order Summary:</h4>
        {watchedProductsOrdered.map((item, index) => {
          const product = products.find(p => p.id === item.productId);
          if (!product || item.quantity <= 0) return null;
          return (
            <div key={index} className="flex justify-between text-sm">
              <span>{product.productName} (x{item.quantity})</span>
              <span>${(product.wholesalePricePerUnit * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total Order Amount:</span>
          <span>${totalOrderAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(['Cash', 'Credit Card', 'Debit Card', 'ACH', 'Check', 'Other'] as const).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                    </Select>
                )} />
            {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
        </div>
        <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.paymentTerms ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(['Net 15', 'Net 30', 'Net 60', 'Due on Receipt', 'Prepaid'] as const).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                    </Select>
                )} />
            {errors.paymentTerms && <p className="text-sm text-destructive mt-1">{errors.paymentTerms.message}</p>}
        </div>
        <div>
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Controller
                name="paymentStatus"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.paymentStatus ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                    </Select>
                )} />
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
            <Controller
                name="shipmentDate"
                control={control}
                render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                     errors.shipmentDate ? "border-destructive" : ""
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                )}
            />
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
