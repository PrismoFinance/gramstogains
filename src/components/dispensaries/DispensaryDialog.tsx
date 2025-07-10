
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import type { Dispensary } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const dispensarySchema = z.object({
  dispensaryName: z.string().min(1, 'Dispensary name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhoneNumber: z.string().optional(), // Could add more specific phone validation
  address: z.string().optional(),
  notes: z.string().optional(),
});

type DispensaryFormValues = z.infer<typeof dispensarySchema>;

interface DispensaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dispensary: Dispensary) => void;
  dispensary: Dispensary | null;
}

export function DispensaryDialog({ isOpen, onClose, onSave, dispensary }: DispensaryDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DispensaryFormValues>({
    resolver: zodResolver(dispensarySchema),
    defaultValues: {
        dispensaryName: '',
        licenseNumber: '',
        contactPerson: '',
        contactEmail: '',
        contactPhoneNumber: '',
        address: '',
        notes: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
        if (dispensary) {
        reset({
            dispensaryName: dispensary.dispensaryName,
            licenseNumber: dispensary.licenseNumber,
            contactPerson: dispensary.contactPerson || '',
            contactEmail: dispensary.contactEmail || '',
            contactPhoneNumber: dispensary.contactPhoneNumber || '',
            address: dispensary.address || '',
            notes: dispensary.notes || '',
        });
        } else {
        reset({ // Reset to default values for a new dispensary
            dispensaryName: '',
            licenseNumber: '',
            contactPerson: '',
            contactEmail: '',
            contactPhoneNumber: '',
            address: '',
            notes: '',
        });
        }
    }
  }, [dispensary, isOpen, reset]);

  const onSubmit = (data: DispensaryFormValues) => {
    const dispensaryToSave: Dispensary = {
      ...data,
      id: dispensary?.id || `disp${Date.now()}`, 
    };
    onSave(dispensaryToSave);
    toast({ title: dispensary ? 'Dispensary Updated' : 'Dispensary Added', description: `${data.dispensaryName} has been saved successfully.` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{dispensary ? 'Edit Dispensary' : 'Add New Dispensary'}</DialogTitle>
          <DialogDescription>
            {dispensary ? 'Update the details for this dispensary.' : 'Fill in the details for the new dispensary client.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="dispensaryName">Dispensary Name</Label>
            <Input id="dispensaryName" {...register('dispensaryName')} className={errors.dispensaryName ? 'border-destructive' : ''} />
            {errors.dispensaryName && <p className="text-sm text-destructive mt-1">{errors.dispensaryName.message}</p>}
          </div>
          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" {...register('licenseNumber')} className={errors.licenseNumber ? 'border-destructive' : ''} />
            {errors.licenseNumber && <p className="text-sm text-destructive mt-1">{errors.licenseNumber.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
                <Input id="contactPerson" {...register('contactPerson')} />
            </div>
            <div>
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input id="contactEmail" type="email" {...register('contactEmail')} className={errors.contactEmail ? 'border-destructive' : ''}/>
                {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>}
            </div>
          </div>
           <div>
            <Label htmlFor="contactPhoneNumber">Contact Phone (Optional)</Label>
            <Input id="contactPhoneNumber" {...register('contactPhoneNumber')} />
          </div>
          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea id="address" {...register('address')} />
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" {...register('notes')} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (dispensary ? 'Save Changes' : 'Add Dispensary')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
