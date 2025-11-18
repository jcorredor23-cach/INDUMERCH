
import { useState } from 'react';
import { Package, TrendingDown, TrendingUp, AlertTriangle, Edit, Trash2, Plus } from "lucide-react";
import type { Material } from "@/lib/types";
import { PredictiveStockAlertsOutput } from "@/ai/flows/predictive-stock-alerts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { MaterialFormModal } from './material-form-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MaterialsSectionProps {
  materials: Material[];
  predictions?: PredictiveStockAlertsOutput | null;
  onAddMaterial: (material: Omit<Material, 'id'>) => void;
  onUpdateMaterial: (material: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
}

export function MaterialsSection({ materials, predictions, onAddMaterial, onUpdateMaterial, onDeleteMaterial }: MaterialsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);

  const handleOpenModal = (material?: Material) => {
      setSelectedMaterial(material);
      setModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedMaterial(undefined);
  };
  
  const handleSave = (materialData: Omit<Material, 'id'> | Material) => {
    if ('id' in materialData) {
      onUpdateMaterial(materialData);
    } else {
      onAddMaterial(materialData);
    }
    handleCloseModal();
  };


  return (
    <section className="bg-white p-6 rounded-xl shadow-2xl h-fit xl:col-span-1">
      <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-4 flex items-center justify-between font-headline">
        <div className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-slate-500" />
            Inventario de Materia Prima
        </div>
        <Button onClick={() => handleOpenModal()} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Añadir Material
        </Button>
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

                  <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-200" onClick={() => handleOpenModal(mp)}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción es permanente. Se eliminará el material "{mp.name}" del inventario.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteMaterial(mp.id)} className="bg-destructive hover:bg-destructive/90">
                                    Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

       <MaterialFormModal 
          isOpen={modalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSave} 
          material={selectedMaterial} 
        />
    </section>
  );
}
