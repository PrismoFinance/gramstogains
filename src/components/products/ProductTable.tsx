
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
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
import { Edit, Trash2, PackageOpen, PackageX, CheckCircle, XCircle, Tag } from 'lucide-react';
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
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>METRC ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Strain</TableHead>
              <TableHead className="text-right">THC%</TableHead>
              <TableHead className="text-right">CBD%</TableHead>
              <TableHead className="text-right">Wholesale Price</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-10 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Image
                    src={product.imageUrl || `https://placehold.co/60x40.png?text=${product.productName.charAt(0)}`}
                    alt={product.productName}
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint="cannabis product"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.productName}</TableCell>
                <TableCell>
                    {product.metrcPackageId ? (
                        <Badge variant="outline" className="gap-1 text-xs">
                            <Tag className="h-3 w-3"/> {product.metrcPackageId}
                        </Badge>
                    ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.productCategory}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.strainType}</Badge>
                </TableCell>
                <TableCell className="text-right">{product.thcPercentage.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{product.cbdPercentage.toFixed(1)}%</TableCell>
                <TableCell className="text-right">${product.wholesalePricePerUnit.toFixed(2)}</TableCell>
                <TableCell>{product.unitOfMeasure}</TableCell>
                <TableCell className="text-right">{product.currentStockQuantity}</TableCell>
                <TableCell className="text-center">
                  {product.currentStockQuantity > 0 ? (
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
                  {product.activeStatus ? (
                     <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                  ) : (
                     <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="hover:text-accent mr-2">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product "{product.productName}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
