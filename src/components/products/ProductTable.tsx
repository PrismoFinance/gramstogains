
'use client';

import Image from 'next/image';
import type { ProductTemplate, ProductBatch } from '@/lib/types'; // Changed Product to ProductTemplate
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
import { Edit, Trash2, PackageOpen, PackageX, CheckCircle, XCircle, Layers } from 'lucide-react'; // Added Layers for batches
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
  productTemplates: ProductTemplate[]; // Changed from products: Product[]
  productBatches: ProductBatch[]; // Added to calculate aggregates
  onEdit: (productTemplate: ProductTemplate) => void; // Changed from product: Product
  onDelete: (productTemplateId: string) => void; // Changed from productId
  // onManageBatches: (productTemplateId: string) => void; // Placeholder for future batch management
}

export function ProductTable({ productTemplates, productBatches, onEdit, onDelete }: ProductTableProps) {

  const getBatchDataForTemplate = (templateId: string) => {
    const batches = productBatches.filter(b => b.productTemplateId === templateId && b.activeStatus && b.currentStockQuantity > 0);
    
    const totalStock = batches.reduce((sum, b) => sum + b.currentStockQuantity, 0);
    
    let avgThc = 0;
    let avgCbd = 0;
    if (batches.length > 0) {
      avgThc = batches.reduce((sum, b) => sum + b.thcPercentage, 0) / batches.length;
      avgCbd = batches.reduce((sum, b) => sum + b.cbdPercentage, 0) / batches.length;
    }
    const activeBatchCount = productBatches.filter(b => b.productTemplateId === templateId && b.activeStatus).length;

    return { totalStock, avgThc, avgCbd, activeBatchCount };
  };


  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Batches</TableHead> {/* Was METRC ID, now shows batch info */}
              <TableHead>Category</TableHead>
              <TableHead>Strain</TableHead>
              <TableHead className="text-right">Avg. THC%</TableHead>
              <TableHead className="text-right">Avg. CBD%</TableHead>
              {/* <TableHead className="text-right">Wholesale Price</TableHead> Removed, price is per batch */}
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
              const { totalStock, avgThc, avgCbd, activeBatchCount } = getBatchDataForTemplate(template.id);
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
                  <TableCell className="font-medium">{template.productName}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="gap-1">
                        <Layers className="h-3 w-3"/> {activeBatchCount} Active
                     </Badge>
                     {/* Placeholder for manage batches button: <Button size="xs" variant="link" onClick={() => onManageBatches(template.id)}>Manage</Button> */}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{template.productCategory}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.strainType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{avgThc.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{avgCbd.toFixed(1)}%</TableCell>
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
                    <Button variant="ghost" size="icon" onClick={() => onEdit(template)} className="hover:text-accent mr-2">
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
