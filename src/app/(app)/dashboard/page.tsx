'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp, FileText } from "lucide-react";
import { mockProducts, mockSales } from "@/lib/mock-data"; // Assuming sales data is also in mock-data
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Calculate some summary data (mocked)
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = mockSales.length;
  const totalProducts = mockProducts.length;

  const chartData = mockSales.reduce((acc, sale) => {
    const date = new Date(sale.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.sales += sale.totalAmount;
    } else {
      acc.push({ date, sales: sale.totalAmount });
    }
    return acc;
  }, [] as { date: string; sales: number }[]).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Welcome, {user?.username}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <FileText className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">+15 since last week (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <ShoppingBag className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">+2 new this month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Trend</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Upward</div>
            <p className="text-xs text-muted-foreground">Positive trend last 30 days (mock)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A chart showing sales revenue over the recent period.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <SalesChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Top 5 most recent sales transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSalesTable sales={mockSales.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
