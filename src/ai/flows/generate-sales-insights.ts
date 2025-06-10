
// src/ai/flows/generate-sales-insights.ts
'use server';

/**
 * @fileOverview Analyzes wholesale order data to identify correlations, trends, and potential insights for a manufacturing lab, 
 * suggesting new product development or vendor outreach based on dispensary purchasing patterns and inventory gaps.
 *
 * - generateSalesInsights - A function that triggers the wholesale insights generation process.
 * - GenerateSalesInsightsInput - The input type for the generateSalesInsights function.
 * - GenerateSalesInsightsOutput - The return type for the generateSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { WholesaleDataForAI, ProductTemplateForAI, ProductBatchForAI, WholesaleOrderForAI, Dispensary } from '@/lib/types'; 

// Define Zod schemas for input validation based on WholesaleDataForAI

const ProductTemplateForAISchema = z.object({
  id: z.string(),
  productName: z.string(),
  productCategory: z.string(),
  strainType: z.string(),
});

const ProductBatchForAISchema = z.object({
  id: z.string(),
  productTemplateId: z.string(),
  metrcPackageId: z.string(),
  thcPercentage: z.number(),
  cbdPercentage: z.number(),
  wholesalePricePerUnit: z.number(),
  currentStockQuantity: z.number(),
});

const ProductOrderedForAISchema = z.object({
  productTemplateId: z.string(),
  productBatchId: z.string(),
  productName: z.string(), // from template
  batchMetrcPackageId: z.string(), // from batch
  quantity: z.number(),
  wholesalePricePerUnit: z.number(), // from batch
  subtotal: z.number(),
  thcPercentageAtSale: z.number().optional(), // from batch
  cbdPercentageAtSale: z.number().optional(), // from batch
});

const WholesaleOrderForAISchema = z.object({
  id: z.string(),
  dispensaryId: z.string(),
  productsOrdered: z.array(ProductOrderedForAISchema),
  totalOrderAmount: z.number(),
  orderDate: z.string(), // ISO date string
  salesAssociateId: z.string(),
  paymentStatus: z.string(),
  metrcManifestId: z.string().optional(),
});

const DispensaryForAISchema = z.object({
  id: z.string(),
  dispensaryName: z.string(),
  licenseNumber: z.string(),
  address: z.string().optional(),
});

const GenerateSalesInsightsInputSchema = z.object({
  productTemplates: z.array(ProductTemplateForAISchema).describe("List of product templates offered by the manufacturing lab."),
  productBatches: z.array(ProductBatchForAISchema).describe("List of specific product batches, each with a METRC ID, test results, and stock."),
  wholesaleOrders: z.array(WholesaleOrderForAISchema).describe("List of wholesale orders placed by dispensaries, detailing which batches were sold."),
  dispensaries: z.array(DispensaryForAISchema).describe("List of dispensaries the lab sells to."),
  analysisFocus: z.string().optional().describe("Optional: Specific area or question to focus the analysis on.")
});
export type GenerateSalesInsightsInput = z.infer<typeof GenerateSalesInsightsInputSchema>;


const GenerateSalesInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights, trends, and actionable suggestions for optimizing wholesale operations and product strategy.'),
  suggestedActions: z.array(z.string()).optional().describe("List of concrete actions suggested by the AI."),
  warnings: z.array(z.string()).optional().describe("Potential warnings or risks identified from the data (e.g., low stock for popular batches, declining sales for a product line).")
});
export type GenerateSalesInsightsOutput = z.infer<typeof GenerateSalesInsightsOutputSchema>;

export async function generateSalesInsights(input: WholesaleDataForAI & { analysisFocus?: string }): Promise<GenerateSalesInsightsOutput> {
  const validatedInput: GenerateSalesInsightsInput = {
    productTemplates: input.productTemplates,
    productBatches: input.productBatches,
    wholesaleOrders: input.wholesaleOrders,
    dispensaries: input.dispensaries,
    analysisFocus: input.analysisFocus,
  };
  return generateSalesInsightsFlow(validatedInput);
}

const prompt = ai.definePrompt({
  name: 'generateWholesaleInsightsPrompt',
  input: {schema: GenerateSalesInsightsInputSchema},
  output: {schema: GenerateSalesInsightsOutputSchema},
  prompt: `You are an AI business analyst for a cannabis manufacturing lab. Your role is to analyze wholesale order data, product inventory (templates and specific batches), and dispensary information to provide actionable insights.

  Data Provided:
  - Product Templates: General definitions of products (name, category, strain).
  - Product Batches: Specific METRC-tagged batches of products, including their cannabinoid percentages, stock levels, and price. Each batch links to a product template.
  - Wholesale Orders: Records of orders placed by dispensaries. Each ordered item specifies the product template, the specific product batch sold (with its METRC ID and cannabinoid profile at sale), quantity, and subtotal. Orders also include METRC Manifest IDs.
  - Dispensaries: Information about the dispensaries that are customers.

  Analysis Task:
  Based on the provided data (Product Templates: {{{json productTemplates}}}, Product Batches: {{{json productBatches}}}, Wholesale Orders: {{{json wholesaleOrders}}}, Dispensaries: {{{json dispensaries}}}), perform a comprehensive analysis.
  
  Key considerations:
  - Link ordered items back to specific Product Batches using productBatchId to analyze performance of individual batches (e.g., sales velocity, dispensary preference for specific METRC IDs or cannabinoid profiles within the same product template).
  - Aggregate batch data to analyze Product Template performance (e.g., overall demand for "Green Crack Flower" across all its batches).

  {{#if analysisFocus}}
  Specifically focus on: {{{analysisFocus}}}
  {{else}}
  Consider the following areas:
  1.  Identify top-selling Product Templates and top-selling individual Product Batches (by METRC ID).
  2.  Analyze purchasing patterns of different dispensaries. Do they prefer specific Product Templates, or even specific batches (e.g., higher THC batches of the same product)?
  3.  Detect trends in demand for Product Templates and specific cannabinoid profiles (e.g., are higher THC batches selling faster?).
  4.  Assess inventory levels of Product Batches against their sales velocity. Highlight any batches with low stock that are in high demand, or high stock with low demand.
  5.  Identify potential gaps in the product portfolio (based on Product Templates) or batch characteristics (e.g., need for more high-CBD batches of a popular template).
  6.  Suggest strategies to optimize sales, such as promoting specific batches to certain dispensaries, or adjusting production focus based on batch performance.
  7.  If there are significant gaps between current batch inventory/characteristics and dispensary needs/market demand, suggest exploring new raw material vendors or production adjustments for future batches.
  {{/if}}

  Output Requirements:
  -   **insights**: Provide a detailed narrative report of your findings, including key observations, identified correlations, and overall business insights. Distinguish between template-level and batch-level findings.
  -   **suggestedActions**: (Optional) List 3-5 concrete, actionable recommendations.
  -   **warnings**: (Optional) List any potential risks or warnings.

  Be concise, data-driven, and focus on providing practical value to the manufacturing lab's management.
  `,
  config: {
    safetySettings: [ 
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const generateSalesInsightsFlow = ai.defineFlow(
  {
    name: 'generateWholesaleInsightsFlow',
    inputSchema: GenerateSalesInsightsInputSchema,
    outputSchema: GenerateSalesInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate insights.");
    }
    return output;
  }
);
