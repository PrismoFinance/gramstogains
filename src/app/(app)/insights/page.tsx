
'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, AlertTriangle, Search, PieChartIcon, List, FileText } from 'lucide-react';
import { generateSalesInsights, type GenerateSalesInsightsOutput, type SalesInsightsProduct } from '@/ai/flows/generate-sales-insights';
import { mockProductTemplates, mockWholesaleOrders } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleDateRangePicker } from '@/components/reports/SimpleDateRangePicker';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
const ALL_FILTER_VALUE = "_all_";

export default function AiInsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [insightsResult, setInsightsResult] = useState<GenerateSalesInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [question, setQuestion] = useState('What are our best selling 510 carts over the last 60 days?');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [productCategoryFilter, setProductCategoryFilter] = useState('Vapes');

  const productCategories = useMemo(() => Array.from(new Set(mockProductTemplates.map(pt => pt.productCategory))), []);
  
  const groupedProductsByStrain = useMemo(() => {
    if (!insightsResult?.detailedProductList) return {};
    
    return insightsResult.detailedProductList.reduce((acc, product) => {
      const strain = product.strainType || 'Other';
      if (!acc[strain]) {
        acc[strain] = [];
      }
      acc[strain].push(product);
      // Sort by quantity desc within each strain
      acc[strain].sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
      return acc;
    }, {} as Record<string, SalesInsightsProduct[]>);

  }, [insightsResult]);


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
      if (!question.trim()) {
        throw new Error("Please ask a question to analyze.");
      }
      
      const result = await generateSalesInsights({
        naturalLanguageQuery: question,
        filters: {
            dateRange,
            productCategory: productCategoryFilter === ALL_FILTER_VALUE ? undefined : productCategoryFilter,
        },
        // In a real app, you might pass all data or the AI would use a tool to fetch it.
        // For this mock, we pass it all.
        allOrders: mockWholesaleOrders,
        allTemplates: mockProductTemplates
      });
      setInsightsResult(result);
      toast({ title: 'Insights Generated', description: 'AI analysis complete.' });
    } catch (e: any) {
      console.error("Error generating insights:", e);
      setError(e.message || "Failed to generate insights. Please try again.");
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" />
            Sales Analytics
          </h1>
          <p className="text-muted-foreground">Ask questions about your sales data to uncover trends and opportunities.</p>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Use natural language to query your sales data. You can also use the filters below to narrow your focus. The AI will analyze the relevant data to answer your question.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="naturalLanguageQuery">Your Question</Label>
                <Input 
                id="naturalLanguageQuery"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., 'What are my top selling flower products this month?'"
                />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Date Range (Optional)</Label>
                <SimpleDateRangePicker date={dateRange} onDateChange={setDateRange} />
             </div>
             <div className="space-y-2">
                <Label>Product Category (Optional)</Label>
                <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_FILTER_VALUE}>All Categories</SelectItem>
                        {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateInsights} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
                <>
                 <Search className="mr-2 h-4 w-4" />
                 Generate Insights
                </>
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

      {isLoading && (
         <Card className="shadow-lg text-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <CardTitle className="mt-4">Analyzing Sales Data...</CardTitle>
            <CardDescription className="mt-2">The AI is processing your request. Please wait a moment.</CardDescription>
         </Card>
      )}

      {insightsResult && (
        <div className="space-y-6">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Analysis Summary</CardTitle>
                    <CardDescription>A brief summary of the findings based on your question.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-md whitespace-pre-wrap font-sans">
                    {insightsResult.summary}
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                {insightsResult.topProductsChartData && insightsResult.topProductsChartData.length > 0 && (
                    <Card className="lg:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary" />Top 5 Products by Quantity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <Pie
                                    data={insightsResult.topProductsChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {insightsResult.topProductsChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
                
                {Object.keys(groupedProductsByStrain).length > 0 && (
                     <Card className="lg:col-span-3 shadow-lg">
                        <CardHeader>
                             <CardTitle className="flex items-center"><List className="mr-2 h-5 w-5 text-primary"/>Detailed List by Strain</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-y-auto">
                           {Object.entries(groupedProductsByStrain).map(([strain, products]) => (
                                <div key={strain} className="mb-4 last:mb-0">
                                    <h4 className="font-semibold text-md mb-2 text-accent">{strain}</h4>
                                    <ul className="space-y-2">
                                        {products.map(product => (
                                            <li key={product.productTemplateId} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded-md">
                                                <span>{product.productName}</span>
                                                <Badge variant="secondary">Sold: {product.totalQuantitySold}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                           ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
