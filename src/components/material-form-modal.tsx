
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PackagePlus } from 'lucide-react';

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Omit<Material, 'id'> | Material) => void;
  material?: Material;
}

export function MaterialFormModal({ isOpen, onClose, onSave, material }: MaterialFormModalProps) {
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [stock, setStock] = useState<number | string>('');
  const [minStock, setMinStock] = useState<number | string>('');

  useEffect(() => {
    if (isOpen) {
      if (material) {
        setName(material.name);
        setStock(material.stock);
        setMinStock(material.min_stock);
      } else {
        // Reset form for new material
        setName('');
        setStock('');
        setMinStock('');
      }
    }
  }, [isOpen, material]);

  const handleSubmit = () => {
    const stockNum = Number(stock);
    const minStockNum = Number(minStock);

    if (!name.trim() || isNaN(stockNum) || isNaN(minStockNum) || stockNum < 0 || minStockNum < 0) {
      toast({
        title: "Datos inválidos",
        description: "Por favor, complete todos los campos con valores correctos.",
        variant: "destructive",
      });
      return;
    }

    const materialData = {
      name,
      stock: stockNum,
      unit: 'kg' as const,
      min_stock: minStockNum,
    };

    if (material) {
      onSave({ ...materialData, id: material.id });
    } else {
      onSave(materialData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-700 flex items-center">
            <PackagePlus className="w-5 h-5 mr-2" />
            {material ? 'Editar Materia Prima' : 'Añadir Nueva Materia Prima'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="material-name">Nombre del Material</Label>
            <Input id="material-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Chatarra de Acero" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material-stock">Stock Actual</Label>
              <div className="flex items-center">
                <Input id="material-stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" min="0" className="rounded-r-none" />
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md h-10">
                  kg
                </span>
              </div>
            </div>
             <div>
              <Label htmlFor="material-min-stock">Stock Mínimo</Label>
              <div className="flex items-center">
                <Input id="material-min-stock" type="number" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="0" min="0" className="rounded-r-none" />
                 <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md h-10">
                  kg
                </span>
              </div>
            </div>
          </div>
           <p className="text-xs text-gray-500 mt-1">El sistema alertará cuando el stock baje del nivel mínimo.</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">Guardar Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
