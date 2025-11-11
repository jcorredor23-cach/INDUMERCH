'use server';

/**
 * @fileOverview Provides insights on material consumption patterns based on historical data.
 *
 * - getMaterialConsumptionInsights - A function that retrieves insights on material consumption.
 * - MaterialConsumptionInsightsInput - The input type for the getMaterialConsumptionInsights function.
 * - MaterialConsumptionInsightsOutput - The return type for the getMaterialConsumptionInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaterialConsumptionInsightsInputSchema = z.object({
  materialId: z.string().describe('The ID of the material to analyze.'),
  timePeriod: z.string().describe('The time period to analyze (e.g., last week, last month, last year).'),
  productionData: z.string().describe('Production data for analysis of material consumption.'),
});

export type MaterialConsumptionInsightsInput = z.infer<typeof MaterialConsumptionInsightsInputSchema>;

const MaterialConsumptionInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights on material consumption patterns.'),
  recommendations: z.string().describe('Recommendations for optimizing material usage and reducing waste.'),
});

export type MaterialConsumptionInsightsOutput = z.infer<typeof MaterialConsumptionInsightsOutputSchema>;

export async function getMaterialConsumptionInsights(
  input: MaterialConsumptionInsightsInput
): Promise<MaterialConsumptionInsightsOutput> {
  return materialConsumptionInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'materialConsumptionInsightsPrompt',
  input: {schema: MaterialConsumptionInsightsInputSchema},
  output: {schema: MaterialConsumptionInsightsOutputSchema},
  prompt: `You are an expert in production management and data analysis.
  Analyze the following material consumption data for {{materialId}} over the {{timePeriod}}.
  Provide insights on consumption patterns and recommendations for optimizing material usage and reducing waste.

  Production Data: {{{productionData}}}
  \n  Respond concisely.
  Do not use bullet points.
  Do not use lists.
`,
});

const materialConsumptionInsightsFlow = ai.defineFlow(
  {
    name: 'materialConsumptionInsightsFlow',
    inputSchema: MaterialConsumptionInsightsInputSchema,
    outputSchema: MaterialConsumptionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
