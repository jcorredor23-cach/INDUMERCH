
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/main-layout';
import { MaterialsSection } from '@/components/materials-section';
import { initialMaterials, initialProductionOrders } from '@/lib/data';
import type { Material, ProductionOrder } from '@/lib/types';
import { predictStockShortages, PredictiveStockAlertsOutput } from '@/ai/flows/predictive-stock-alerts';
import { getCurrentISOWeek } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function InventoryPage() {
  const [materials] = useState<Material[]>(initialMaterials);
  const [orders] = useState<ProductionOrder[]>(initialProductionOrders);
  const [predictions, setPredictions] = useState<PredictiveStockAlertsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const simplifiedOrders = orders.flatMap(order => 
        order.materials.map(material => ({
            op_id: order.op_id,
            mp_target_id: material.materialId,
            mp_consumption: material.consumption,
            targetWeek: order.targetWeek
        }))
      );

      const result = await predictStockShortages({
        materials: materials,
        productionOrders: simplifiedOrders,
        currentWeek: getCurrentISOWeek(),
      });
      setPredictions(result);
    } catch (error) {
      console.error("Error running stock prediction:", error);
    }
    setIsLoading(false);
  };
  
  const shortagePredictions = predictions?.filter(p => p.shortage);

  return (
    <MainLayout>
      <main className="max-w-screen-xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <MaterialsSection materials={materials} predictions={predictions} />
            </div>
             <div className="md:col-span-1">
                <Card className="shadow-lg rounded-xl bg-indigo-50 border-indigo-200">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <BrainCircuit className="w-8 h-8 mr-3 text-indigo-600"/>
                            <h2 className="text-lg font-bold text-indigo-800">Asistente IA de Producción</h2>
                        </div>
                        <AlertDescription className="text-indigo-700 mb-4 text-sm">
                            Analiza las órdenes de producción y el inventario actual para predecir futuros desabastecimientos de materia prima.
                        </AlertDescription>
                        <Button onClick={handleRunPrediction} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? 'Analizando...' : 'Ejecutar Análisis Predictivo'}
                        </Button>
                        
                        {shortagePredictions && shortagePredictions.length > 0 && (
                            <div className="mt-4">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>¡Alerta de Desabastecimiento!</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside mt-2">
                                        {shortagePredictions.map(p => {
                                            const material = materials.find(m => m.id === p.materialId);
                                            return (
                                                <li key={p.materialId} className="text-sm">
                                                    <strong>{material?.name}:</strong> Se proyecta un déficit de <strong>{p.amountShort?.toLocaleString() ?? 0} {material?.unit}</strong>.
                                                </li>
                                            )
                                        })}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                         {predictions && shortagePredictions?.length === 0 && (
                             <div className="mt-4">
                                <Alert variant="default" className="bg-green-100 border-green-300 text-green-800">
                                    <AlertCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle>¡Todo en Orden!</AlertTitle>
                                    <AlertDescription>
                                        No se predicen desabastecimientos para la semana actual.
                                    </AlertDescription>
                                </Alert>
                            </div>
                         )}

                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </MainLayout>
  );
}
