
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus, Plus, Trash2 } from "lucide-react";
import type { Client, Material, Product, ProductionOrder, MaterialConsumption, Operator, Machine } from '@/lib/types';
import { getCurrentISOWeek, getCurrentDateTimeLocal } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CreateOpModalProps {
  clients: Client[];
  materials: Material[];
  products: Product[];
  operators: Operator[];
  machines: Machine[];
  onAddOrder: (order: Omit<ProductionOrder, 'id' | 'op_id' | 'createdAt' | 'status'>) => void;
}

export function CreateOpModal({ clients, materials, products, operators, machines, onAddOrder }: CreateOpModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [productName, setProductName] = useState('');
  const [jobType, setJobType] = useState<'Normal Production' | 'Express/Small Job'>('Normal Production');
  const [targetWeek, setTargetWeek] = useState(String(getCurrentISOWeek()));
  const [materialInputs, setMaterialInputs] = useState<MaterialConsumption[]>([{ materialId: materials[0]?.id || '', consumption: 0 }]);
  const [estStartTime, setEstStartTime] = useState('');
  const [estEndTime, setEstEndTime] = useState('');
  const [operatorId, setOperatorId] = useState<string>('unassigned');
  const [machineId, setMachineId] = useState<string>('unassigned');

  const materialsMap = new Map(materials.map(m => [m.id, m]));

  useEffect(() => {
    if (open) {
      const defaultStartTime = getCurrentDateTimeLocal();
      const defaultEndTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
      defaultEndTime.setMinutes(defaultEndTime.getMinutes() - defaultEndTime.getTimezoneOffset());
      setEstStartTime(defaultStartTime);
      setEstEndTime(defaultEndTime.toISOString().slice(0, 16));
    }
  }, [open]);

  const resetForm = () => {
    setClientId('');
    setPriority('Media');
    setProductName('');
    setJobType('Normal Production');
    setTargetWeek(String(getCurrentISOWeek()));
    setMaterialInputs([{ materialId: materials[0]?.id || '', consumption: 0 }]);
    setEstStartTime(getCurrentDateTimeLocal());
    const newEndTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
    newEndTime.setMinutes(newEndTime.getMinutes() - newEndTime.getTimezoneOffset());
    setEstEndTime(newEndTime.toISOString().slice(0, 16));
    setOperatorId('unassigned');
    setMachineId('unassigned');
  };
  
  const handleMaterialChange = (index: number, field: keyof MaterialConsumption, value: string | number) => {
    const newInputs = [...materialInputs];
    if (field === 'consumption') {
      newInputs[index][field] = Number(value);
    } else {
      newInputs[index][field] = value as string;
    }
    setMaterialInputs(newInputs);
  };

  const addMaterialInput = () => {
    if (materialInputs.length < 4) {
      setMaterialInputs([...materialInputs, { materialId: materials[0]?.id || '', consumption: 0 }]);
    }
  };

  const removeMaterialInput = (index: number) => {
    const newInputs = materialInputs.filter((_, i) => i !== index);
    setMaterialInputs(newInputs);
  };
  
  const handleSubmit = () => {
    if (!clientId || !productName ) {
      toast({ title: "Campos incompletos", description: "Por favor, complete todos los campos obligatorios.", variant: "destructive" });
      return;
    }
    const validMaterials = materialInputs.filter(m => m.materialId && m.consumption > 0);
    if(validMaterials.length === 0){
        toast({ title: "Materia prima requerida", description: "Debe especificar al menos un material a consumir.", variant: "destructive" });
        return;
    }

    const totalConsumption = validMaterials.reduce((sum, m) => sum + m.consumption, 0);
    if (totalConsumption <= 0) {
      toast({ title: "Consumo inválido", description: "La cantidad de consumo debe ser un número positivo.", variant: "destructive" });
      return;
    }

    const startTimeMs = new Date(estStartTime).getTime();
    const endTimeMs = new Date(estEndTime).getTime();
    if (startTimeMs >= endTimeMs) {
      toast({ title: "Fechas inválidas", description: "La hora de fin debe ser posterior a la de inicio.", variant: "destructive" });
      return;
    }

    onAddOrder({
      client_id: clientId,
      priority,
      product: productName,
      job_type: jobType,
      targetWeek: parseInt(targetWeek),
      materials: validMaterials,
      start_time_est: startTimeMs,
      end_time_est: endTimeMs,
      qty: totalConsumption,
      operator_id: operatorId === 'unassigned' ? undefined : operatorId,
      machine_id: machineId === 'unassigned' ? undefined : machineId,
    });
    
    setOpen(false);
    resetForm();
  };

  const productGroups = products.reduce((acc, product) => {
    (acc[product.group] = acc[product.group] || []).push(product);
    return acc;
  }, {} as Record<string, Product[]>);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Nueva Colada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-700 flex items-center">
            <FilePlus className="w-5 h-5 mr-2" />
            Crear Nueva Orden de Colada
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="op-client-select">Cliente / Empresa</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                        <SelectTrigger id="op-client-select"><SelectValue placeholder="-- Seleccione un Cliente --" /></SelectTrigger>
                        <SelectContent>
                            {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="op-priority-select">Prioridad</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                        <SelectTrigger id="op-priority-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Baja">Baja</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label htmlFor="op-product-select">Producto a Fundir</Label>
                <Select value={productName} onValueChange={setProductName}>
                    <SelectTrigger id="op-product-select"><SelectValue placeholder="-- Seleccione un producto --" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(productGroups).map(([group, products]) => (
                        <SelectGroup key={group}>
                          <Label className="px-2 py-1.5 text-sm font-semibold">{group}</Label>
                          {products.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="op-job-type-select">Tipo de Producción</Label>
                <Select value={jobType} onValueChange={(v) => setJobType(v as any)}>
                    <SelectTrigger id="op-job-type-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Normal Production">Colada Grande / Producción Normal</SelectItem>
                        <SelectItem value="Express/Small Job">Trabajo Express / Pequeño (Interferencia)</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-red-500 mt-1">Marcar "Express" genera alerta visual.</p>
            </div>
            <div>
                <Label htmlFor="op-target-week">Semana Objetivo</Label>
                <Input id="op-target-week" type="number" value={targetWeek} onChange={e => setTargetWeek(e.target.value)} min="1" max="53" />
            </div>

             <hr/>
            <h4 className="text-base font-semibold text-gray-700">Asignación</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="op-operator-select">Operario a Cargo</Label>
                  <Select value={operatorId} onValueChange={setOperatorId}>
                      <SelectTrigger id="op-operator-select"><SelectValue placeholder="-- Asignar Operario --" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="unassigned">Sin asignar</SelectItem>
                          {operators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label htmlFor="op-machine-select">Máquina a Utilizar</Label>
                  <Select value={machineId} onValueChange={setMachineId}>
                      <SelectTrigger id="op-machine-select"><SelectValue placeholder="-- Asignar Máquina --" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="unassigned">Sin asignar</SelectItem>
                          {machines.filter(m => m.status === 'Disponible').map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
            </div>

            <hr/>
            <h4 className="text-base font-semibold text-gray-700">Materia Prima a Consumir</h4>
            <div className="space-y-3">
              {materialInputs.map((input, index) => {
                return (
                <div key={index} className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6">
                    <Select value={input.materialId} onValueChange={(v) => handleMaterialChange(index, 'materialId', v)}>
                        <SelectTrigger><SelectValue placeholder="Seleccione material"/></SelectTrigger>
                        <SelectContent>
                            {materials.map(mp => <SelectItem key={mp.id} value={mp.id}>{mp.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5 flex items-center">
                    <Input type="number" value={input.consumption} onChange={e => handleMaterialChange(index, 'consumption', e.target.value)} min="0" placeholder="Cantidad" />
                     <span className="ml-2 text-sm text-gray-600 font-medium">kg</span>
                  </div>
                   <div className="col-span-1">
                    <Button variant="ghost" size="icon" onClick={() => removeMaterialInput(index)} className="text-red-500 hover:bg-red-100 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )})}
              {materialInputs.length < 4 && (
                <Button onClick={addMaterialInput} variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-2" /> Añadir Otro Material
                </Button>
              )}
            </div>

            <hr />
            <h4 className="text-base font-semibold text-gray-700">Estimación de Tiempos</h4>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="op-est-start-time">Inicio Estimado</Label>
                    <Input id="op-est-start-time" type="datetime-local" value={estStartTime} onChange={e => setEstStartTime(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="op-est-end-time">Fin Estimado</Label>
                    <Input id="op-est-end-time" type="datetime-local" value={estEndTime} onChange={e => setEstEndTime(e.target.value)} />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700">Crear Colada (Pendiente)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
