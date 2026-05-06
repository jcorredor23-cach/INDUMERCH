'use server';

/**
 * @fileOverview Analyzes the impact of logged exceptions on production timelines, material consumption, and overall efficiency.
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
  impactedArea: z.string().describe('The area most impacted by the incident (e.g., Tiempos, Costos, Calidad).'),
  suggestedActions: z.string().describe('Suggested actions to mitigate the impact.'),
});
export type ExceptionImpactAnalysisOutput = z.infer<typeof ExceptionImpactAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'exceptionImpactAnalysisPrompt',
  input: {schema: ExceptionImpactAnalysisInputSchema},
  output: {schema: ExceptionImpactAnalysisOutputSchema},
  prompt: `Eres un analista experto en operaciones de fundición y metalmecánica.
  Analiza el siguiente incidente y los detalles de la orden de producción asociada para determinar el impacto en la eficiencia, materiales y tiempos.

  Incidente: {{{incidentDescription}}}
  Detalles de la Orden: {{{opDetails}}}

  Proporciona un análisis crítico y sugiere pasos concretos para mitigar el retraso o el desperdicio.`,
});

export async function exceptionImpactAnalysis(
  input: ExceptionImpactAnalysisInput
): Promise<ExceptionImpactAnalysisOutput> {
  const {output} = await prompt(input);
  if (!output) throw new Error('No se pudo generar el análisis de impacto.');
  return output;
}

export const exceptionImpactAnalysisFlow = ai.defineFlow(
  {
    name: 'exceptionImpactAnalysisFlow',
    inputSchema: ExceptionImpactAnalysisInputSchema,
    outputSchema: ExceptionImpactAnalysisOutputSchema,
  },
  async input => {
    return exceptionImpactAnalysis(input);
  }
);
