
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
  const [unit, setUnit] = useState<Material['unit']>('ton');
  const [minStock, setMinStock] = useState<number | string>('');

  useEffect(() => {
    if (isOpen) {
      if (material) {
        setName(material.name);
        setStock(material.stock);
        setUnit(material.unit);
        setMinStock(material.min_stock);
      } else {
        // Reset form for new material
        setName('');
        setStock('');
        setUnit('ton');
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
      unit,
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
              <Input id="material-stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" min="0" />
            </div>
             <div>
              <Label htmlFor="material-unit">Unidad</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Material['unit'])}>
                <SelectTrigger id="material-unit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ton">ton (Toneladas)</SelectItem>
                  <SelectItem value="kg">kg (Kilogramos)</SelectItem>
                  <SelectItem value="m3">m³ (Metros cúbicos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="material-min-stock">Stock Mínimo Requerido</Label>
            <Input id="material-min-stock" type="number" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="0" min="0" />
            <p className="text-xs text-gray-500 mt-1">El sistema alertará cuando el stock baje de este nivel.</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">Guardar Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
