'use server';

/**
 * @fileOverview Analyzes the impact of logged exceptions on production timelines, material consumption, and overall efficiency.
 *
 * - exceptionImpactAnalysis - A function that handles the analysis of exception impacts.
 * - ExceptionImpactAnalysisInput - The input type for the exceptionImpactAnalysis function.
 * - ExceptionImpactAnalysisOutput - The return type for the exceptionImpactAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExceptionImpactAnalysisInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('The description of the incident that occurred.'),
  opDetails: z.string().describe('Details of the associated production order.'),
});
export type ExceptionImpactAnalysisInput = z.infer<typeof ExceptionImpactAnalysisInputSchema>;

const ExceptionImpactAnalysisOutputSchema = z.object({
  impactSummary: z
    .string()
    .describe('A summary of the impact of the exception on production.'),
  impactedArea: z.string().describe('The area most impacted by the incident.'),
  suggestedActions: z.string().describe('Suggested actions to mitigate the impact.'),
});
export type ExceptionImpactAnalysisOutput = z.infer<typeof ExceptionImpactAnalysisOutputSchema>;

export async function exceptionImpactAnalysis(
  input: ExceptionImpactAnalysisInput
): Promise<ExceptionImpactAnalysisOutput> {
  return exceptionImpactAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exceptionImpactAnalysisPrompt',
  input: {schema: ExceptionImpactAnalysisInputSchema},
  output: {schema: ExceptionImpactAnalysisOutputSchema},
  prompt: `You are an operations analyst tasked with assessing the impact of production exceptions.

  Analyze the following incident description and production order details to determine the impact on production timelines, material consumption, and overall efficiency.

  Incident Description: {{{incidentDescription}}}
  Production Order Details: {{{opDetails}}}

  Based on the analysis, provide a summary of the impact, identify the area most impacted, and suggest actions to mitigate the impact.

  Ensure that the suggested actions are practical and address the root cause of the issue.

  Format your response as follows:
  Impact Summary: [Summary of the impact]
  Impacted Area: [The area most impacted]
  Suggested Actions: [Suggested actions to mitigate the impact]`,
});

const exceptionImpactAnalysisFlow = ai.defineFlow(
  {
    name: 'exceptionImpactAnalysisFlow',
    inputSchema: ExceptionImpactAnalysisInputSchema,
    outputSchema: ExceptionImpactAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
