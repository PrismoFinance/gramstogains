
'use client';

import type { WholesaleOrder } from '@/lib/types'; // Changed from Sale
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
import { Package } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: WholesaleOrder[]; // Changed from Sale[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) { // Renamed from RecentSalesTable
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dispensary</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Order Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {/* Using dispensary name for avatar */}
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${order.dispensaryName?.charAt(0).toUpperCase() || 'D'}`} alt={order.dispensaryName || 'Dispensary'} />
                    <AvatarFallback>{order.dispensaryName?.charAt(0).toUpperCase() || 'D'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.dispensaryName || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Order ID: {order.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="gap-1">
                  <Package className="h-3 w-3" />
                  {order.productsOrdered.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">${order.totalOrderAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === 'Paid' ? 'default' : order.paymentStatus === 'Pending' ? 'secondary' : 'destructive'}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
