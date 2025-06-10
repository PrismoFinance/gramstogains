
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, AlertTriangle, HelpCircle } from 'lucide-react';
import { generateSalesInsights, type GenerateSalesInsightsOutput } from '@/ai/flows/generate-sales-insights';
import { mockProductTemplates, mockProductBatches, mockWholesaleOrders, mockDispensaries } from '@/lib/mock-data';
import type { WholesaleDataForAI, ProductTemplateForAI, ProductBatchForAI, WholesaleOrderForAI, Dispensary } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AiInsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [insightsResult, setInsightsResult] = useState<GenerateSalesInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Prepare data for AI, transforming mock data into AI-specific types
  const exampleWholesaleData: WholesaleDataForAI = {
    productTemplates: mockProductTemplates.map(({ id, productName, productCategory, strainType }) => ({ id, productName, productCategory, strainType })),
    productBatches: mockProductBatches.map(({ id, productTemplateId, metrcPackageId, thcPercentage, cbdPercentage, wholesalePricePerUnit, currentStockQuantity }) => ({ id, productTemplateId, metrcPackageId, thcPercentage, cbdPercentage, wholesalePricePerUnit, currentStockQuantity })),
    wholesaleOrders: mockWholesaleOrders.map(order => ({
      id: order.id,
      dispensaryId: order.dispensaryId,
      productsOrdered: order.productsOrdered.map(po => ({
        productTemplateId: po.productTemplateId,
        productBatchId: po.productBatchId,
        productName: po.productName,
        batchMetrcPackageId: po.batchMetrcPackageId,
        quantity: po.quantity,
        wholesalePricePerUnit: po.wholesalePricePerUnit,
        subtotal: po.subtotal,
        thcPercentageAtSale: po.thcPercentageAtSale,
        cbdPercentageAtSale: po.cbdPercentageAtSale,
      })),
      totalOrderAmount: order.totalOrderAmount,
      orderDate: order.orderDate,
      salesAssociateId: order.salesAssociateId,
      paymentStatus: order.paymentStatus,
      metrcManifestId: order.metrcManifestId,
    })),
    dispensaries: mockDispensaries.map(({ id, dispensaryName, licenseNumber, address }) => ({ id, dispensaryName, licenseNumber, address })),
  };

  const [wholesaleDataInput, setWholesaleDataInput] = useState(JSON.stringify(exampleWholesaleData, null, 2));
  const [analysisFocus, setAnalysisFocus] = useState('');


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
    setInsightsResult(null);
    setError(null);
    try {
      let parsedData: WholesaleDataForAI;
      try {
        parsedData = JSON.parse(wholesaleDataInput);
      } catch (e) {
         throw new SyntaxError("Invalid JSON format in wholesale data. Please check your input.");
      }
      
      if (!parsedData.productTemplates || !parsedData.productBatches || !parsedData.wholesaleOrders || !parsedData.dispensaries) {
        throw new Error("Missing one or more required data fields (productTemplates, productBatches, wholesaleOrders, dispensaries).");
      }

      const inputForAI: WholesaleDataForAI & { analysisFocus?: string } = {
        ...parsedData,
        analysisFocus: analysisFocus || undefined,
      };

      const result: GenerateSalesInsightsOutput = await generateSalesInsights(inputForAI);
      setInsightsResult(result);
      toast({ title: 'Insights Generated', description: 'AI analysis complete.' });
    } catch (e: any) {
      console.error("Error generating insights:", e);
      let errorMessage = "Failed to generate insights. Please try again.";
      if (e instanceof SyntaxError) {
        errorMessage = e.message;
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
            AI-Powered Wholesale Insights
          </h1>
          <p className="text-muted-foreground">Analyze wholesale order data to uncover trends and opportunities.</p>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Wholesale Data Input</CardTitle>
          <CardDescription>
            Paste your wholesale data in JSON format. This should include product templates, specific product batches, wholesale orders, and dispensary information.
            An example structure (based on current mock data) is pre-filled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={wholesaleDataInput}
            onChange={(e) => setWholesaleDataInput(e.target.value)}
            placeholder="Enter wholesale data as JSON..."
            rows={15}
            className="font-code text-sm"
          />
          <div>
            <Label htmlFor="analysisFocus" className="flex items-center gap-1">
              Analysis Focus (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                  <TooltipContent className="w-64">
                    <p>Guide the AI by specifying areas of interest, e.g., "Identify underperforming product templates" or "Which METRC batches are selling fastest?".</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input 
              id="analysisFocus"
              value={analysisFocus}
              onChange={(e) => setAnalysisFocus(e.target.value)}
              placeholder="e.g., Top selling strains to urban dispensaries"
            />
          </div>
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

      {insightsResult && (
        <div className="space-y-4">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>Generated Insights</CardTitle>
                    <CardDescription>Review the AI-generated analysis below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
                    {insightsResult.insights}
                    </div>
                </CardContent>
            </Card>

            {insightsResult.suggestedActions && insightsResult.suggestedActions.length > 0 && (
                 <Card className="shadow-lg border-accent">
                    <CardHeader>
                        <CardTitle className="text-accent">Suggested Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {insightsResult.suggestedActions.map((action, idx) => <li key={idx}>{action}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {insightsResult.warnings && insightsResult.warnings.length > 0 && (
                 <Card className="shadow-lg border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Warnings / Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {insightsResult.warnings.map((warning, idx) => <li key={idx}>{warning}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}
