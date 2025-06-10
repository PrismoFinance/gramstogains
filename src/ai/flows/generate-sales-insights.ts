// src/ai/flows/generate-sales-insights.ts
'use server';

/**
 * @fileOverview Analyzes sales data to identify correlations and potential insights, suggesting new vendors based on inventory gaps and market needs.
 *
 * - generateSalesInsights - A function that triggers the sales insights generation process.
 * - GenerateSalesInsightsInput - The input type for the generateSalesInsights function.
 * - GenerateSalesInsightsOutput - The return type for the generateSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
});
export type GenerateSalesInsightsInput = z.infer<typeof GenerateSalesInsightsInputSchema>;

const GenerateSalesInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights and suggestions for optimizing sales.'),
});
export type GenerateSalesInsightsOutput = z.infer<typeof GenerateSalesInsightsOutputSchema>;

export async function generateSalesInsights(input: GenerateSalesInsightsInput): Promise<GenerateSalesInsightsOutput> {
  return generateSalesInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesInsightsPrompt',
  input: {schema: GenerateSalesInsightsInputSchema},
  output: {schema: GenerateSalesInsightsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing sales data and providing actionable insights.

  Analyze the following sales data to identify correlations, trends, and potential areas for improvement. Suggest new vendors to explore based on gaps in current inventory and market needs.

  Sales Data: {{{salesData}}}

  Provide a detailed report of your findings.`,
});

const generateSalesInsightsFlow = ai.defineFlow(
  {
    name: 'generateSalesInsightsFlow',
    inputSchema: GenerateSalesInsightsInputSchema,
    outputSchema: GenerateSalesInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
