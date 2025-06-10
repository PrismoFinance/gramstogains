'use client';

import { SalesTransactionForm } from '@/components/sales/SalesTransactionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockProducts } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

export default function NewSalePage() {
  const { user } = useAuth();

  if (!user) {
    // This should ideally be handled by the layout, but as a fallback
    return <p>Loading or not authorized...</p>; 
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Record New Sale</CardTitle>
          <CardDescription>Enter the details of the sales transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTransactionForm products={mockProducts} currentUser={user} />
        </CardContent>
      </Card>
    </div>
  );
}
