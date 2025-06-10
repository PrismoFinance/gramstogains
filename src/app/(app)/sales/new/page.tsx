
'use client';

import { WholesaleOrderForm } from '@/components/sales/SalesTransactionForm'; // Path remains same, component name inside is WholesaleOrderForm
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockProducts, mockDispensaries } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

export default function NewWholesaleOrderPage() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading or not authorized...</p>; 
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create New Wholesale Order</CardTitle>
          <CardDescription>Enter the details for the new wholesale order to a dispensary.</CardDescription>
        </CardHeader>
        <CardContent>
          <WholesaleOrderForm 
            products={mockProducts.filter(p => p.activeStatus)} // Only allow active products to be ordered
            dispensaries={mockDispensaries} 
            currentUser={user} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
