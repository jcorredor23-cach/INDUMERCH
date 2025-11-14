
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, AlertTriangle, Plus } from "lucide-react";
import type { Incident, ProductionOrder } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface IncidentsSectionProps {
  incidents: Incident[];
  orders: ProductionOrder[];
  clients: Record<string, string>;
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

function LogIncidentModal({ orders, clients, onAddIncident }: Omit<IncidentsSectionProps, 'incidents'>) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const [type, setType] = useState<Incident['type']>('Falla Equipo');
    const [description, setDescription] = useState('');
    const [opId, setOpId] = useState<string | undefined>(undefined);

    const handleSubmit = () => {
        if (!description.trim()) {
            toast({ title: "Descripción requerida", description: "La descripción de la novedad es obligatoria.", variant: "destructive" });
            return;
        }
        onAddIncident({ type, description, op_id: opId });
        setOpen(false);
        setDescription('');
        setOpId(undefined);
        setType('Falla Equipo');
    };

    const activeOps = orders.filter(op => op.status === 'En Proceso' || op.status === 'Crítico' || op.status === 'Pendiente');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-amber-500 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-amber-600 transition duration-200 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Registrar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-amber-700 flex items-center">
                        <AlertOctagon className="w-5 h-5 mr-2" />
                        Registrar Novedad / Contratiempo
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="incident-type-select">Tipo de Novedad</Label>
                        <Select value={type} onValueChange={v => setType(v as Incident['type'])}>
                            <SelectTrigger id="incident-type-select"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Falla Equipo">Falla de Equipo (Crítica)</SelectItem>
                                <SelectItem value="Error Humano">Error Humano / Operativo</SelectItem>
                                <SelectItem value="Retraso MP">Retraso de Materia Prima</SelectItem>
                                <SelectItem value="Calidad">Problema de Calidad</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="incident-op-select">Vincular a OP (Opcional)</Label>
                        <Select value={opId} onValueChange={setOpId}>
                            <SelectTrigger id="incident-op-select"><SelectValue placeholder="Ninguna" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguna</SelectItem>
                                {activeOps.map(op => <SelectItem key={op.id} value={op.op_id}>{op.op_id} ({clients[op.client_id] || 'N/A'})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="incident-description">Descripción Breve</Label>
                        <Textarea id="incident-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describa el contratiempo..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full bg-amber-500 text-gray-800 hover:bg-amber-600">Guardar Novedad</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function IncidentsSection({ incidents, orders, clients, onAddIncident }: IncidentsSectionProps) {

  const typeClasses: Record<Incident['type'], string> = {
    'Falla Equipo': 'bg-red-100 text-red-700 border-red-500',
    'Error Humano': 'bg-yellow-100 text-yellow-700 border-yellow-500',
    'Retraso MP': 'bg-blue-100 text-blue-700 border-blue-500',
    'Calidad': 'bg-purple-100 text-purple-700 border-purple-500',
    'Otro': 'bg-gray-100 text-gray-700 border-gray-400',
  };
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <section className="bg-white p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-4 flex justify-between items-center font-headline">
        <span className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-slate-500" />Registro de Novedades</span>
        <LogIncidentModal orders={orders} clients={clients} onAddIncident={onAddIncident} />
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto p-1">
        {incidents.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Sin novedades registradas.</p>
        ) : (
          incidents.map(incident => (
            <div key={incident.id} className={`p-3 bg-white rounded-lg shadow-sm border-l-4 ${typeClasses[incident.type]} transition-transform duration-200 hover:scale-105`}>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeClasses[incident.type].replace('border-l-4', '')}`}>{incident.type}</span>
              <p className="text-sm text-gray-800 font-medium my-1">{incident.description}</p>
              <div className="text-xs text-gray-500 flex justify-between items-center mt-2 pt-2 border-t">
                  <span>OP: <span className="font-semibold text-indigo-700">{incident.op_id || 'N/A'}</span></span>
                  <span>{isClient ? formatDateTime(incident.timestamp) : '...'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
