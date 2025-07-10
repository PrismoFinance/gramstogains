
// src/ai/flows/generate-sales-insights.ts
'use server';

/**
 * @fileOverview Analyzes wholesale order data to answer natural language questions about sales performance.
 *
 * - generateSalesInsights - A function that triggers the sales analysis process.
 * - GenerateSalesInsightsInput - The input type for the generateSalesInsights function.
 * - GenerateSalesInsightsOutput - The return type for the generateSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  WholesaleOrder,
  ProductTemplate
} from '@/lib/types';
import {
  parse,
  isWithinInterval,
  subDays
} from 'date-fns';

// Schemas for the new conversational flow

const SalesInsightsFiltersSchema = z.object({
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional().describe("Date range to filter the sales data."),
  productCategory: z.string().optional().describe("Filter sales data by a specific product category (e.g., 'Vapes', 'Flower')."),
});

// We are not using a tool for this simple case, so the AI will receive all the data.
// In a real-world app, a tool would fetch this from a database based on filters.
const GenerateSalesInsightsInputSchema = z.object({
  naturalLanguageQuery: z.string().describe("The user's question about their sales data."),
  filters: SalesInsightsFiltersSchema.optional().describe("Structured filters to apply to the data before analysis."),
  allOrders: z.any().describe("An array of all wholesale order objects."),
  allTemplates: z.any().describe("An array of all product template objects."),
});
export type GenerateSalesInsightsInput = z.infer < typeof GenerateSalesInsightsInputSchema > ;

// Define the structure for the detailed product list and chart data
export const SalesInsightsProductSchema = z.object({
  productTemplateId: z.string(),
  productName: z.string(),
  strainType: z.string(),
  totalQuantitySold: z.number(),
});
export type SalesInsightsProduct = z.infer < typeof SalesInsightsProductSchema > ;

const TopProductChartDataItemSchema = z.object({
  name: z.string().describe("The name of the product."),
  value: z.number().describe("The total quantity sold for this product."),
});

const GenerateSalesInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise, natural language summary of the findings that directly answers the user\'s question.'),
  topProductsChartData: z.array(TopProductChartDataItemSchema).optional().describe("Data for the top 5 products to be displayed in a pie chart, where 'name' is the product name and 'value' is the total quantity sold."),
  detailedProductList: z.array(SalesInsightsProductSchema).optional().describe("A comprehensive list of all products that match the query, including their total quantity sold and strain type, for detailed display."),
});
export type GenerateSalesInsightsOutput = z.infer < typeof GenerateSalesInsightsOutputSchema > ;


// This is the main function called by the UI.
export async function generateSalesInsights(input: GenerateSalesInsightsInput): Promise < GenerateSalesInsightsOutput > {
  // 1. Pre-filter data based on structured filters (Date and Category)
  // This simulates what would happen in a database query before hitting the LLM.
  const allOrders: WholesaleOrder[] = input.allOrders;
  const allTemplates: ProductTemplate[] = input.allTemplates;

  const sixtyDaysAgo = subDays(new Date(), 60);
  const now = new Date();

  // Default to last 60 days if no date range is provided in the filter
  const dateFrom = input.filters?.dateRange?.from || sixtyDaysAgo;
  const dateTo = input.filters?.dateRange?.to || now;
  const interval = {
    start: dateFrom,
    end: dateTo
  };

  const categoryFilter = input.filters?.productCategory;

  const relevantTemplateIds = new Set(
    allTemplates
    .filter(t => !categoryFilter || t.productCategory === categoryFilter)
    .map(t => t.id)
  );

  const filteredOrders = allOrders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const dateMatch = isWithinInterval(orderDate, interval);
    if (!dateMatch) return false;

    // Check if any product in the order matches the category filter
    return order.productsOrdered.some(p => relevantTemplateIds.has(p.productTemplateId));
  });

  // 2. Aggregate filtered data to create a simplified data structure for the AI.
  // This reduces the amount of data sent to the LLM.
  const productSales: Record < string, {
    productName: string;strainType: string;totalQuantity: number
  } > = {};

  for (const order of filteredOrders) {
    for (const product of order.productsOrdered) {
      if (relevantTemplateIds.has(product.productTemplateId)) {
        if (!productSales[product.productTemplateId]) {
          const template = allTemplates.find(t => t.id === product.productTemplateId);
          if (template) {
            productSales[product.productTemplateId] = {
              productName: template.productName,
              strainType: template.strainType,
              totalQuantity: 0,
            };
          }
        }
        if (productSales[product.productTemplateId]) {
          productSales[product.productTemplateId].totalQuantity += product.quantity;
        }
      }
    }
  }

  const salesDataForAI = Object.entries(productSales).map(([id, data]) => ({
    productTemplateId: id,
    productName: data.productName,
    strainType: data.strainType,
    totalQuantitySold: data.totalQuantity,
  }));

  // 3. Call the AI flow with the user's question and the pre-processed data.
  const flowInput = {
    naturalLanguageQuery: input.naturalLanguageQuery,
    salesData: salesDataForAI
  };

  return generateSalesInsightsFlow(flowInput);
}


// This is the Genkit flow definition.
const prompt = ai.definePrompt({
  name: 'conversationalSalesAnalysisPrompt',
  input: {
    schema: z.object({
      naturalLanguageQuery: z.string(),
      salesData: z.array(SalesInsightsProductSchema),
    }),
  },
  output: {
    schema: GenerateSalesInsightsOutputSchema
  },
  prompt: `You are an expert sales analyst for a cannabis manufacturer.
  Your task is to analyze the provided sales data to answer the user's question.

  User's Question: "{{{naturalLanguageQuery}}}"

  Filtered Sales Data (product name, strain, and total quantity sold in the period):
  {{{json salesData}}}

  Based on the user's question and the provided data, perform the following actions:
  1.  **summary**: Write a concise, natural language summary that directly answers the user's question. For example, if they ask for the best sellers, state what they are.
  2.  **topProductsChartData**: Identify the top 5 products from the sales data based on 'totalQuantitySold'. Format this as a list of objects with 'name' and 'value' keys, where 'name' is the 'productName' and 'value' is the 'totalQuantitySold'.
  3.  **detailedProductList**: Return the full list of products from the provided sales data. This list will be used to show a detailed breakdown in the UI, grouped by strain.

  Focus only on the data provided. Your analysis should be quantitative and directly address the user's query.
  `,
  config: {
    safetySettings: [{
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_ONLY_HIGH'
    }, {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }, ],
  }
});

const generateSalesInsightsFlow = ai.defineFlow({
  name: 'generateConversationalSalesInsightsFlow',
  inputSchema: z.object({
    naturalLanguageQuery: z.string(),
    salesData: z.array(SalesInsightsProductSchema),
  }),
  outputSchema: GenerateSalesInsightsOutputSchema,
}, async (input) => {
  if (!input.salesData || input.salesData.length === 0) {
    return {
      summary: "No relevant sales data found for the selected filters. Please try expanding your date range or changing the product category.",
      topProductsChartData: [],
      detailedProductList: [],
    };
  }

  const {
    output
  } = await prompt(input);
  if (!output) {
    throw new Error("AI failed to generate insights.");
  }
  return output;
});

    