'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, AlertTriangle } from 'lucide-react';
import { generateSalesInsights, type GenerateSalesInsightsInput, type GenerateSalesInsightsOutput } from '@/ai/flows/generate-sales-insights';
import { mockProducts, mockSales } from '@/lib/mock-data';
import type { SalesDataForAI } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AiInsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const exampleSalesData: SalesDataForAI = {
    products: mockProducts.map(({ id, name, category, price, stock }) => ({ id, name, category, price, stock })),
    sales: mockSales.map(({ productId, quantity, totalAmount, saleDate, salesAssociateId }) => ({ productId, quantity, totalAmount, saleDate, salesAssociateId })),
  };
  const [salesDataInput, setSalesDataInput] = useState(JSON.stringify(exampleSalesData, null, 2));

  React.useEffect(() => {
    if (user && user.role !== 'administrator') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'administrator') {
    return <p className="text-center py-10">Access Denied. Administrator role required.</p>;
  }

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    setError(null);
    try {
      const input: GenerateSalesInsightsInput = { salesData: salesDataInput };
      // Validate JSON input
      JSON.parse(salesDataInput);

      const result: GenerateSalesInsightsOutput = await generateSalesInsights(input);
      setInsights(result.insights);
      toast({ title: 'Insights Generated', description: 'AI analysis complete.' });
    } catch (e: any) {
      console.error("Error generating insights:", e);
      let errorMessage = "Failed to generate insights. Please try again.";
      if (e instanceof SyntaxError) {
        errorMessage = "Invalid JSON format in sales data. Please check your input.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Lightbulb className="mr-3 h-8 w-8 text-accent" />
            AI-Powered Sales Insights
          </h1>
          <p className="text-muted-foreground">Analyze sales data to uncover trends and opportunities.</p>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Sales Data Input</CardTitle>
          <CardDescription>
            Paste your sales data in JSON format. The data should ideally include product details (ID, name, category, price, stock) and sales records (product ID, quantity, total amount, date, sales associate).
            An example structure is pre-filled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={salesDataInput}
            onChange={(e) => setSalesDataInput(e.target.value)}
            placeholder="Enter sales data as JSON..."
            rows={15}
            className="font-code text-sm"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateInsights} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Insights'
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-destructive shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
                <CardTitle className="text-destructive">Error Generating Insights</CardTitle>
                <CardDescription className="text-destructive/80">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {insights && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Generated Insights</CardTitle>
            <CardDescription>Review the AI-generated analysis and suggestions below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
              {insights}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
