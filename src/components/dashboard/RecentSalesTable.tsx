'use client';

import type { Sale } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Associate</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>
                <div className="font-medium">{sale.productName}</div>
                <div className="text-xs text-muted-foreground">ID: {sale.productId}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${sale.salesAssociateName.charAt(0).toUpperCase()}`} alt={sale.salesAssociateName} />
                    <AvatarFallback>{sale.salesAssociateName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{sale.salesAssociateName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">${sale.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {new Date(sale.saleDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
