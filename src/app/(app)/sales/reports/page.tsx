'use client';

import React, { useState, useMemo } from 'react';
import type { Sale, Product } from '@/lib/types';
import { mockSales, mockProducts } from '@/lib/mock-data';
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
import { Download, FilterX } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker'; // Placeholder for a date range picker
import type { DateRange } from 'react-day-picker';

// A simple DateRangePicker placeholder component.
// In a real app, you'd use a proper one like from ShadCN examples.
const SimpleDateRangePicker = ({ date, onDateChange }: { date?: DateRange, onDateChange: (date?: DateRange) => void }) => {
  const [fromString, setFromString] = useState(date?.from ? date.from.toISOString().split('T')[0] : '');
  const [toString, setToString] = useState(date?.to ? date.to.toISOString().split('T')[0] : '');

  const handleApply = () => {
    const from = fromString ? new Date(fromString) : undefined;
    const to = toString ? new Date(toString) : undefined;
    if (from && to && from > to) {
      alert("Start date cannot be after end date.");
      return;
    }
    onDateChange({ from, to });
  };
  
  return (
    <div className="flex gap-2 items-end">
      <div>
        <label htmlFor="date-from" className="text-sm font-medium text-muted-foreground">From</label>
        <Input type="date" id="date-from" value={fromString} onChange={e => setFromString(e.target.value)} />
      </div>
      <div>
        <label htmlFor="date-to" className="text-sm font-medium text-muted-foreground">To</label>
        <Input type="date" id="date-to" value={toString} onChange={e => setToString(e.target.value)} />
      </div>
      <Button onClick={handleApply} variant="outline" size="sm">Apply</Button>
    </div>
  );
};


export default function SalesReportsPage() {
  const [salesData, setSalesData] = useState<Sale[]>(mockSales);
  const [productsData, setProductsData] = useState<Product[]>(mockProducts);

  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [associateFilter, setAssociateFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const uniqueProducts = useMemo(() => Array.from(new Set(productsData.map(p => p.name))), [productsData]);
  const uniqueAssociates = useMemo(() => Array.from(new Set(salesData.map(s => s.salesAssociateName))), [salesData]);

  const filteredSales = useMemo(() => {
    return salesData.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sale.salesAssociateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sale.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = productFilter === '' || sale.productName === productFilter;
      const matchesAssociate = associateFilter === '' || sale.salesAssociateName === associateFilter;
      const matchesDate = !dateRange || (
        (!dateRange.from || saleDate >= dateRange.from) &&
        (!dateRange.to || saleDate <= new Date(dateRange.to.getTime() + 86399999)) // Include full end day
      );
      return matchesSearch && matchesProduct && matchesAssociate && matchesDate;
    });
  }, [salesData, searchTerm, productFilter, associateFilter, dateRange]);

  const totalFilteredRevenue = useMemo(() => {
    return filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }, [filteredSales]);

  const clearFilters = () => {
    setSearchTerm('');
    setProductFilter('');
    setAssociateFilter('');
    setDateRange(undefined);
  };
  
  const exportToCSV = () => {
    const headers = "ID,Product Name,Quantity,Unit Price,Total Amount,Sale Date,Sales Associate\n";
    const csvContent = filteredSales.map(s => 
        `${s.id},"${s.productName}",${s.quantity},${s.unitPrice},${s.totalAmount},${new Date(s.saleDate).toLocaleDateString()},"${s.salesAssociateName}"`
    ).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sales_report.csv");
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
          <h1 className="text-3xl font-headline font-bold">Sales Reports</h1>
          <p className="text-muted-foreground">Analyze sales performance and filter data.</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter Sales Data</CardTitle>
          <CardDescription>Use the filters below to refine your sales report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by ID, product, associate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Products</SelectItem>
                {uniqueProducts.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={associateFilter} onValueChange={setAssociateFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Sales Associate" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Associates</SelectItem>
                {uniqueAssociates.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
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
            <CardTitle>Filtered Sales Results</CardTitle>
            <div className="text-sm text-muted-foreground">
                Showing {filteredSales.length} sales. Total Revenue: <span className="font-semibold text-primary">${totalFilteredRevenue.toFixed(2)}</span>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sales Associate</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredSales.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No sales match your filters.</TableCell></TableRow>
                ) : (
                    filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.productName}</TableCell>
                        <TableCell className="text-right">{sale.quantity}</TableCell>
                        <TableCell className="text-right">${sale.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">${sale.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.salesAssociateName}</TableCell>
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
