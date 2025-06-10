
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
import type { WholesaleDataForAI } from '@/lib/types'; // Using the specific type

// Define Zod schemas for input validation based on WholesaleDataForAI
const ProductForAISchema = z.object({
  id: z.string(),
  productName: z.string(),
  productCategory: z.string(),
  strainType: z.string(),
  thcPercentage: z.number(),
  cbdPercentage: z.number(),
  wholesalePricePerUnit: z.number(),
  currentStockQuantity: z.number(),
});

const ProductOrderedForAISchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  wholesalePricePerUnit: z.number(),
  subtotal: z.number(),
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
  products: z.array(ProductForAISchema).describe("List of products offered by the manufacturing lab."),
  wholesaleOrders: z.array(WholesaleOrderForAISchema).describe("List of wholesale orders placed by dispensaries."),
  dispensaries: z.array(DispensaryForAISchema).describe("List of dispensaries the lab sells to."),
  // Adding a field for specific questions or focus areas for the AI
  analysisFocus: z.string().optional().describe("Optional: Specific area or question to focus the analysis on (e.g., 'Identify underperforming products', 'Suggest new product categories based on dispensary demand').")
});
// No need to export type GenerateSalesInsightsInput separately if it's inferred from WholesaleDataForAI, but explicit schema is better for Genkit
export type GenerateSalesInsightsInput = z.infer<typeof GenerateSalesInsightsInputSchema>;


const GenerateSalesInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights, trends, and actionable suggestions for optimizing wholesale operations and product strategy.'),
  suggestedActions: z.array(z.string()).optional().describe("List of concrete actions suggested by the AI."),
  warnings: z.array(z.string()).optional().describe("Potential warnings or risks identified from the data (e.g., low stock for popular items, declining sales for a product line).")
});
export type GenerateSalesInsightsOutput = z.infer<typeof GenerateSalesInsightsOutputSchema>;

export async function generateSalesInsights(input: WholesaleDataForAI & { analysisFocus?: string }): Promise<GenerateSalesInsightsOutput> {
  // Map WholesaleDataForAI to GenerateSalesInsightsInput if necessary, or ensure compatibility
  // For this example, we assume WholesaleDataForAI is directly compatible or can be easily transformed.
  // The Zod schema provides validation.
  const validatedInput: GenerateSalesInsightsInput = {
    products: input.products,
    wholesaleOrders: input.wholesaleOrders,
    dispensaries: input.dispensaries,
    analysisFocus: input.analysisFocus,
  };
  return generateSalesInsightsFlow(validatedInput);
}

const prompt = ai.definePrompt({
  name: 'generateWholesaleInsightsPrompt', // Renamed for clarity
  input: {schema: GenerateSalesInsightsInputSchema},
  output: {schema: GenerateSalesInsightsOutputSchema},
  prompt: `You are an AI business analyst for a cannabis manufacturing lab. Your role is to analyze wholesale order data, product inventory, and dispensary information to provide actionable insights.

  Data Provided:
  - Products: Details about each product offered by the lab (name, category, strain, THC/CBD, price, stock).
  - Wholesale Orders: Records of orders placed by dispensaries, including products ordered, quantities, total amounts, dates, and payment status.
  - Dispensaries: Information about the dispensaries that are customers of the lab.

  Analysis Task:
  Based on the provided data (Products: {{{json products}}}, Wholesale Orders: {{{json wholesaleOrders}}}, Dispensaries: {{{json dispensaries}}}), perform a comprehensive analysis.

  {{#if analysisFocus}}
  Specifically focus on: {{{analysisFocus}}}
  {{else}}
  Consider the following areas:
  1.  Identify top-selling products and product categories to dispensaries.
  2.  Analyze purchasing patterns of different dispensaries. Are there regional preferences or dispensary types that favor certain products?
  3.  Detect trends in product demand (e.g., rising or falling popularity of certain strains, categories, or THC/CBD profiles).
  4.  Assess inventory levels against sales velocity. Highlight any products with low stock that are in high demand, or high stock with low demand.
  5.  Identify potential gaps in the product portfolio based on dispensary purchasing patterns or market trends.
  6.  Suggest strategies to optimize sales, such as targeted promotions for certain dispensaries, new product development opportunities, or adjustments to wholesale pricing.
  7.  If there are significant gaps between current inventory/product offerings and dispensary needs/market demand, suggest exploring new raw material vendors or production adjustments.
  {{/if}}

  Output Requirements:
  -   **insights**: Provide a detailed narrative report of your findings, including key observations, identified correlations, and overall business insights.
  -   **suggestedActions**: (Optional) List 3-5 concrete, actionable recommendations based on your analysis.
  -   **warnings**: (Optional) List any potential risks or warnings, such as popular items running low on stock, or products with declining sales.

  Be concise, data-driven, and focus on providing practical value to the manufacturing lab's management.
  `,
  config: {
    safetySettings: [ // Example safety settings, adjust as needed for cannabis-related content
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const generateSalesInsightsFlow = ai.defineFlow(
  {
    name: 'generateWholesaleInsightsFlow', // Renamed for clarity
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
