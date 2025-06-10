
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp, FileText, Truck } from "lucide-react"; // Added Truck for orders
import { mockProducts, mockWholesaleOrders, mockDispensaries } from "@/lib/mock-data"; // Updated to mockWholesaleOrders
import { SalesChart } from "@/components/dashboard/SalesChart"; // This can be repurposed for order values
import { RecentOrdersTable } from "@/components/dashboard/RecentSalesTable"; // Renamed to RecentOrdersTable
import { useAuth } from "@/contexts/AuthContext";
import type { WholesaleOrder } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const totalRevenue = mockWholesaleOrders.reduce((sum, order) => sum + order.totalOrderAmount, 0);
  const totalOrders = mockWholesaleOrders.length;
  const totalProducts = mockProducts.filter(p => p.activeStatus).length; // Count only active products
  const totalDispensaries = mockDispensaries.length;

  // Chart data for wholesale orders over time
  const chartData = mockWholesaleOrders.reduce((acc, order) => {
    const date = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.revenue += order.totalOrderAmount; // Changed from 'sales' to 'revenue'
    } else {
      acc.push({ date, revenue: order.totalOrderAmount });
    }
    return acc;
  }, [] as { date: string; revenue: number }[]).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Welcome, {user?.username}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Wholesale)</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+18.5% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wholesale Orders</CardTitle>
            <Truck className="h-5 w-5 text-accent" /> {/* Changed icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12 since last week (mock)</p>
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
            <CardTitle className="text-sm font-medium">Active Dispensaries</CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDispensaries}</div>
            <p className="text-xs text-muted-foreground">+1 new this quarter (mock)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Wholesale Order Revenue Overview</CardTitle>
            <CardDescription>A chart showing wholesale order revenue over the recent period.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             {/* SalesChart component can be reused, just ensure dataKey matches */}
             <SalesChart data={chartData} dataKey="revenue" /> 
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Wholesale Orders</CardTitle>
            <CardDescription>Top 5 most recent wholesale orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pass sorted orders, newest first */}
            <RecentOrdersTable orders={mockWholesaleOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
