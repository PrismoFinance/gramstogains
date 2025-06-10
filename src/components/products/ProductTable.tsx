
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductTemplate, ProductBatch } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PackageOpen, PackageX, CheckCircle, XCircle, Layers, Settings2, FileText } from 'lucide-react';
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

interface ProductTableProps {
  productTemplates: ProductTemplate[];
  productBatches: ProductBatch[];
  onEdit: (productTemplate: ProductTemplate) => void;
  onDelete: (productTemplateId: string) => void;
  onManageBatches: (productTemplate: ProductTemplate) => void;
}

export function ProductTable({ productTemplates, productBatches, onEdit, onDelete, onManageBatches }: ProductTableProps) {

  const getBatchDataForTemplate = (templateId: string) => {
    const batchesForTemplate = productBatches.filter(b => b.productTemplateId === templateId);
    // Batches that are active AND have stock are used for averaging and total stock calculation
    const activeStockedBatches = batchesForTemplate.filter(b => b.activeStatus && b.currentStockQuantity > 0);
    
    const totalStock = activeStockedBatches.reduce((sum, b) => sum + b.currentStockQuantity, 0);
    
    let avgThc = 0;
    let avgCbd = 0;
    if (activeStockedBatches.length > 0) {
      avgThc = activeStockedBatches.reduce((sum, b) => sum + b.thcPercentage, 0) / activeStockedBatches.length;
      avgCbd = activeStockedBatches.reduce((sum, b) => sum + b.cbdPercentage, 0) / activeStockedBatches.length;
    }
    // Count of batches that are marked as active (may or may not have stock)
    const activeBatchCount = batchesForTemplate.filter(b => b.activeStatus).length;

    return { totalStock, avgThc, avgCbd, activeBatchCount, hasActiveStockedBatches: activeStockedBatches.length > 0 };
  };


  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name / COA</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Strain</TableHead>
              <TableHead className="text-right">Avg. THC%</TableHead>
              <TableHead className="text-right">Avg. CBD%</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Total Stock</TableHead>
              <TableHead className="text-center">Stock Status</TableHead>
              <TableHead className="text-center">Template Active</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productTemplates.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-10 text-muted-foreground">
                  No product templates found.
                </TableCell>
              </TableRow>
            )}
            {productTemplates.map((template) => {
              const { totalStock, avgThc, avgCbd, activeBatchCount, hasActiveStockedBatches } = getBatchDataForTemplate(template.id);
              return (
                <TableRow key={template.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Image
                      src={template.imageUrl || `https://placehold.co/60x40.png?text=${template.productName.charAt(0)}`}
                      alt={template.productName}
                      width={60}
                      height={40}
                      className="rounded-md object-cover"
                      data-ai-hint="cannabis product"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{template.productName}</div>
                    {template.coaUrl && (
                      <Link href={template.coaUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1 mt-1">
                        <FileText className="h-3 w-3" /> View COA
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                        <Badge variant="outline" className="text-xs">
                            <Layers className="mr-1 h-3 w-3"/> {activeBatchCount} Active
                        </Badge>
                        <Button
                            variant="link"
                            size="xs"
                            className="p-0 h-auto text-accent hover:text-accent/80 text-xs flex items-center gap-1"
                            onClick={() => onManageBatches(template)}
                        >
                            <Settings2 className="h-3 w-3 mr-0.5"/> Manage Batches
                        </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{template.productCategory}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.strainType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{hasActiveStockedBatches ? avgThc.toFixed(1) : 'N/A'}%</TableCell>
                  <TableCell className="text-right">{hasActiveStockedBatches ? avgCbd.toFixed(1) : 'N/A'}%</TableCell>
                  <TableCell>{template.unitOfMeasure}</TableCell>
                  <TableCell className="text-right">{totalStock}</TableCell>
                  <TableCell className="text-center">
                    {totalStock > 0 ? (
                      <Badge variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <PackageOpen className="mr-1 h-3 w-3"/> In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <PackageX className="mr-1 h-3 w-3" /> Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {template.activeStatus ? (
                       <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                       <XCircle className="h-5 w-5 text-destructive mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(template)} className="hover:text-accent mr-1">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Template</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Template</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product template "{template.productName}" and all its associated batches.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(template.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
