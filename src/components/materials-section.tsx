
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import type { Material } from "@/lib/types";
import { PredictiveStockAlertsOutput } from "@/ai/flows/predictive-stock-alerts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MaterialsSectionProps {
  materials: Material[];
  predictions?: PredictiveStockAlertsOutput | null;
}

export function MaterialsSection({ materials, predictions }: MaterialsSectionProps) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-2xl h-fit xl:col-span-1">
      <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-4 flex items-center font-headline">
        <Package className="w-5 h-5 mr-2 text-slate-500" />
        Inventario de Materia Prima
      </h2>
      <div className="space-y-4">
        {materials.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No hay materiales.</p>
        ) : (
          materials.map(mp => {
            const prediction = predictions?.find(p => p.materialId === mp.id);
            const lowStock = mp.stock <= mp.min_stock;
            const isPredictedShortage = prediction?.shortage || false;

            let stockClass = "bg-gray-100 text-gray-700 border-gray-300";
            if (isPredictedShortage) {
              stockClass = "bg-red-200 text-red-800 border-red-600";
            } else if (lowStock) {
              stockClass = "bg-red-100 text-red-700 border-red-500";
            } else if (mp.stock > mp.min_stock * 2) {
              stockClass = "bg-green-100 text-green-700 border-green-500";
            }

            return (
              <div key={mp.id} className={`flex items-center justify-between p-4 ${stockClass} rounded-lg shadow-sm border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="font-semibold">{mp.name}</div>
                <div className="flex items-center gap-4 text-right">
                  {prediction && (
                    <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <div className={`flex items-center text-xs font-bold ${isPredictedShortage ? 'text-red-600' : 'text-green-600'}`}>
                              {isPredictedShortage ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                              <span>Pred: {prediction.predictedStock.toLocaleString()} {mp.unit === 'ton' ? 'Ton' : mp.unit}</span>
                           </div>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>Stock Proyectado para la semana actual.</p>
                         </TooltipContent>
                       </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  <div>
                    <span className="text-lg font-bold">{mp.stock.toLocaleString()}</span>
                    <span className="text-sm ml-1">{mp.unit === 'ton' ? 'Ton' : mp.unit}</span>
                    {(lowStock || isPredictedShortage) && 
                      <span className={`ml-2 text-xs font-bold px-2 py-1 ${isPredictedShortage ? 'bg-red-600' : 'bg-red-500'} text-white rounded-full inline-flex items-center`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {isPredictedShortage ? 'FUTURO FALTANTE' : 'BAJO STOCK'}
                      </span>
                    }
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
