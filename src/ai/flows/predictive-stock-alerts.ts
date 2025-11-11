'use server';
/**
 * @fileOverview Predicts potential stock shortages based on production order forecasts and historical consumption rates.
 *
 * - predictStockShortages - A function that predicts potential stock shortages.
 * - PredictiveStockAlertsInput - The input type for the predictStockShortages function.
 * - PredictiveStockAlertsOutput - The return type for the predictStockShortages function.
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
  })
);
export type PredictiveStockAlertsOutput = z.infer<typeof PredictiveStockAlertsOutputSchema>;

export async function predictStockShortages(
  input: PredictiveStockAlertsInput
): Promise<PredictiveStockAlertsOutput> {
  return predictiveStockAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveStockAlertsPrompt',
  input: {schema: PredictiveStockAlertsInputSchema},
  output: {schema: PredictiveStockAlertsOutputSchema},
  prompt: `You are a supply chain expert. Given the current material stock levels and upcoming production orders, predict potential stock shortages for each material.

For each material, calculate the predicted stock level after considering the consumption from all production orders in the current week.

Determine if a shortage is predicted based on whether the predicted stock level falls below the minimum stock level. if a shortage is predicted, specify the ammount short.

Materials:
{{#each materials}}
- ID: {{id}}, Name: {{name}}, Stock: {{stock}} {{unit}}, Minimum Stock: {{min_stock}} {{unit}}
{{/each}}

Production Orders (Current Week: {{currentWeek}}):
{{#each productionOrders}}
- OP ID: {{op_id}}, Material ID: {{mp_target_id}}, Consumption: {{mp_consumption}}, Target Week: {{targetWeek}}
{{/each}}

Output the predicted stock levels and shortage status for each material in JSON format.
`,
});

const predictiveStockAlertsFlow = ai.defineFlow(
  {
    name: 'predictiveStockAlertsFlow',
    inputSchema: PredictiveStockAlertsInputSchema,
    outputSchema: PredictiveStockAlertsOutputSchema,
  },
  async input => {
    const {
      materials,
      productionOrders,
      currentWeek,
    } = input;

    const currentWeekOrders = productionOrders.filter(
      order => order.targetWeek === currentWeek
    );

    const materialPredictions = materials.map(material => {
      const materialConsumption = currentWeekOrders
        .filter(order => order.mp_target_id === material.id)
        .reduce((sum, order) => sum + order.mp_consumption, 0);

      const predictedStock = material.stock - materialConsumption;
      const shortage = predictedStock < material.min_stock;
      const amountShort = shortage ? material.min_stock - predictedStock : 0;

      return {
        materialId: material.id,
        predictedStock: predictedStock,
        shortage: shortage,
        amountShort: amountShort,
      };
    });

    return materialPredictions;
  }
);
