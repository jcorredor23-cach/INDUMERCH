import { Package } from "lucide-react";
import type { Material } from "@/lib/types";

interface MaterialsSectionProps {
  materials: Material[];
}

export function MaterialsSection({ materials }: MaterialsSectionProps) {
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
            const lowStock = mp.stock <= mp.min_stock;
            let stockClass = "bg-gray-100 text-gray-700 border-gray-300";
            if (lowStock) {
              stockClass = "bg-red-100 text-red-700 border-red-500";
            } else if (mp.stock > mp.min_stock * 2) {
              stockClass = "bg-green-100 text-green-700 border-green-500";
            }

            return (
              <div key={mp.id} className={`flex items-center justify-between p-4 ${stockClass} rounded-lg shadow-sm border-l-4 transition-transform duration-200 hover:scale-105`}>
                <div className="font-semibold">{mp.name}</div>
                <div className="text-right">
                  <span className="text-lg font-bold">{mp.stock.toLocaleString()}</span>
                  <span className="text-sm ml-1">{mp.unit === 'ton' ? 'Ton' : mp.unit}</span>
                  {lowStock && 
                    <span className="ml-2 text-xs font-bold px-2 py-1 bg-red-500 text-white rounded-full">
                      ALERTA
                    </span>
                  }
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
