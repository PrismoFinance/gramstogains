
'use client';

import React, { useState, useMemo } from 'react';
import type { WholesaleOrder, Product, Dispensary } from '@/lib/types';
import { mockWholesaleOrders, mockProducts, mockDispensaries, mockUsers } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, FilterX, Package } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { SimpleDateRangePicker } from '@/components/reports/SimpleDateRangePicker';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const ALL_FILTER_VALUE = "_all_";

export default function WholesaleReportsPage() {
  const [ordersData, setOrdersData] = useState<WholesaleOrder[]>(mockWholesaleOrders);
  const [productsData] = useState<Product[]>(mockProducts);
  const [dispensariesData] = useState<Dispensary[]>(mockDispensaries);


  const [searchTerm, setSearchTerm] = useState('');
  const [dispensaryFilter, setDispensaryFilter] = useState(ALL_FILTER_VALUE);
  const [productFilter, setProductFilter] = useState(ALL_FILTER_VALUE);
  const [associateFilter, setAssociateFilter] = useState(ALL_FILTER_VALUE);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(ALL_FILTER_VALUE);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const uniqueProductsForFilter = useMemo(() => Array.from(new Set(productsData.map(p => p.productName))), [productsData]);
  const uniqueAssociates = useMemo(() => Array.from(new Set(ordersData.map(s => s.salesAssociateName))), [ordersData]);
  const uniqueDispensaries = useMemo(() => Array.from(new Set(dispensariesData.map(d => d.dispensaryName))), [dispensariesData]);
  const paymentStatuses: WholesaleOrder['paymentStatus'][] = ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'];


  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      const orderDate = new Date(order.orderDate);
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.dispensaryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.metrcManifestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.salesAssociateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.productsOrdered.some(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDispensary = dispensaryFilter === ALL_FILTER_VALUE || order.dispensaryId === dispensaryFilter;
      const matchesProduct = productFilter === ALL_FILTER_VALUE || order.productsOrdered.some(p => p.productId === productFilter);
      const matchesAssociate = associateFilter === ALL_FILTER_VALUE || order.salesAssociateId === associateFilter;
      const matchesPaymentStatus = paymentStatusFilter === ALL_FILTER_VALUE || order.paymentStatus === paymentStatusFilter;
      const matchesDate = !dateRange || (
        (!dateRange.from || orderDate >= dateRange.from) &&
        (!dateRange.to || orderDate <= new Date(dateRange.to.getTime() + 86399999)) // Include full end day
      );
      return matchesSearch && matchesDispensary && matchesProduct && matchesAssociate && matchesPaymentStatus && matchesDate;
    });
  }, [ordersData, searchTerm, dispensaryFilter, productFilter, associateFilter, paymentStatusFilter, dateRange]);

  const totalFilteredRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => sum + order.totalOrderAmount, 0);
  }, [filteredOrders]);

  const clearFilters = () => {
    setSearchTerm('');
    setDispensaryFilter(ALL_FILTER_VALUE);
    setProductFilter(ALL_FILTER_VALUE);
    setAssociateFilter(ALL_FILTER_VALUE);
    setPaymentStatusFilter(ALL_FILTER_VALUE);
    setDateRange(undefined);
  };
  
  const exportToCSV = () => {
    let csvContent = "OrderID,OrderDate,DispensaryName,TotalAmount,PaymentMethod,PaymentTerms,PaymentStatus,SalesAssociate,MetrcID,ShipmentDate,ProductsOrdered(ID|Name|Qty|Price|Subtotal)\n";
    
    filteredOrders.forEach(order => {
        const productsString = order.productsOrdered.map(p => 
            `${p.productId}|${p.productName}|${p.quantity}|${p.wholesalePricePerUnit}|${p.subtotal}`
        ).join(';');

        csvContent += `"${order.id}","${new Date(order.orderDate).toLocaleDateString()}","${order.dispensaryName || 'N/A'}","${order.totalOrderAmount.toFixed(2)}","${order.paymentMethod}","${order.paymentTerms}","${order.paymentStatus}","${order.salesAssociateName}","${order.metrcManifestId || ''}","${order.shipmentDate ? new Date(order.shipmentDate).toLocaleDateString() : ''}","${productsString}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "wholesale_orders_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Wholesale Order Reports</h1>
          <p className="text-muted-foreground">Analyze wholesale performance and filter order data.</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter Wholesale Orders</CardTitle>
          <CardDescription>Use the filters below to refine your report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search by ID, dispensary, METRC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={dispensaryFilter} onValueChange={setDispensaryFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Dispensary" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Dispensaries</SelectItem>
                {dispensariesData.map(d => <SelectItem key={d.id} value={d.id}>{d.dispensaryName}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Product in Order" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Any Product</SelectItem>
                {productsData.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={associateFilter} onValueChange={setAssociateFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Sales Associate" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Associates</SelectItem>
                {mockUsers.filter(u => u.role === 'sales_representative' || u.role === 'administrator').map(name => <SelectItem key={name.id} value={name.id}>{name.username}</SelectItem>)}
              </SelectContent>
            </Select>
             <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Payment Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Statuses</SelectItem>
                {paymentStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
             <SimpleDateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
           <div className="flex justify-end">
            <Button onClick={clearFilters} variant="ghost" size="sm">
              <FilterX className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
       <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Filtered Wholesale Orders</CardTitle>
            <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} orders. Total Revenue: <span className="font-semibold text-primary">${totalFilteredRevenue.toFixed(2)}</span>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Dispensary</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>METRC ID</TableHead>
                    <TableHead>Sales Associate</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No orders match your filters.</TableCell></TableRow>
                ) : (
                    filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.dispensaryName || dispensariesData.find(d=>d.id === order.dispensaryId)?.dispensaryName}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="link" size="sm" className="p-0 h-auto">
                                        {order.productsOrdered.length} item(s) <Package className="ml-1 h-3 w-3"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-2">
                                        <p className="text-sm font-medium">Products in Order:</p>
                                        {order.productsOrdered.map(p => (
                                            <div key={p.productId} className="text-xs">
                                                {p.productName} (x{p.quantity}) - ${p.subtotal.toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                        <TableCell className="text-right font-semibold">${order.totalOrderAmount.toFixed(2)}</TableCell>
                        <TableCell><Badge variant={order.paymentStatus === 'Paid' ? 'default' : order.paymentStatus === 'Pending' ? 'secondary' : 'destructive'}>{order.paymentStatus}</Badge></TableCell>
                        <TableCell>{order.metrcManifestId || 'N/A'}</TableCell>
                        <TableCell>{order.salesAssociateName}</TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
