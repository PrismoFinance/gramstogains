
'use client';

import { WholesaleOrderForm } from '@/components/sales/SalesTransactionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockProductTemplates, mockProductBatches, mockDispensaries } from '@/lib/mock-data'; // Updated imports
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
            productTemplates={mockProductTemplates.filter(pt => pt.activeStatus)} // Only active templates
            productBatches={mockProductBatches.filter(pb => pb.activeStatus && pb.currentStockQuantity > 0)} // Only active, in-stock batches
            dispensaries={mockDispensaries} 
            currentUser={user} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
