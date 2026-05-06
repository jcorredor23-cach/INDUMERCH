'use server';
/**
 * @fileOverview Predicts potential stock shortages based on production order forecasts and historical consumption rates.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveStockAlertsInputSchema = z.object({
  materials: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      stock: z.number(),
      unit: z.string(),
      min_stock: z.number(),
    })
  ),
  productionOrders: z.array(
    z.object({
      op_id: z.string(),
      mp_target_id: z.string(),
      mp_consumption: z.number(),
      targetWeek: z.number(),
    })
  ),
  currentWeek: z.number(),
});
export type PredictiveStockAlertsInput = z.infer<typeof PredictiveStockAlertsInputSchema>;

const PredictiveStockAlertsOutputSchema = z.array(
  z.object({
    materialId: z.string(),
    predictedStock: z.number(),
    shortage: z.boolean(),
    amountShort: z.number().optional(),
    reasoning: z.string().optional().describe('Brief explanation of the prediction.'),
  })
);
export type PredictiveStockAlertsOutput = z.infer<typeof PredictiveStockAlertsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'predictiveStockAlertsPrompt',
  input: {schema: PredictiveStockAlertsInputSchema},
  output: {schema: PredictiveStockAlertsOutputSchema},
  prompt: `Eres un experto en suministros industriales. Basándote en los niveles actuales de stock y las órdenes de producción planeadas para la semana {{currentWeek}}, predice si habrá faltantes.

Materiales:
{{#each materials}}
- {{name}} (ID: {{id}}): Stock actual {{stock}} {{unit}}, Mínimo {{min_stock}} {{unit}}
{{/each}}

Órdenes de Producción (Semana {{currentWeek}}):
{{#each productionOrders}}
- OP: {{op_id}}, Material: {{mp_target_id}}, Consumo estimado: {{mp_consumption}}
{{/each}}

Calcula el stock proyectado restando el consumo total de las órdenes del stock actual. Si el stock proyectado es menor al mínimo, marca shortage como true.`,
});

export async function predictStockShortages(
  input: PredictiveStockAlertsInput
): Promise<PredictiveStockAlertsOutput> {
  const {output} = await prompt(input);
  if (!output) throw new Error('No se pudo generar la predicción de stock.');
  return output;
}

export const predictiveStockAlertsFlow = ai.defineFlow(
  {
    name: 'predictiveStockAlertsFlow',
    inputSchema: PredictiveStockAlertsInputSchema,
    outputSchema: PredictiveStockAlertsOutputSchema,
  },
  async input => {
    return predictStockShortages(input);
  }
);
