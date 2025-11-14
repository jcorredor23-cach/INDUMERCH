
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, AlertTriangle, Plus, BrainCircuit, Sparkles } from "lucide-react";
import type { Incident, ProductionOrder } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { exceptionImpactAnalysis, ExceptionImpactAnalysisOutput } from '@/ai/flows/exception-impact-analysis';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

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

function IncidentItem({ incident, order, client, onAnalyze }: { incident: Incident, order?: ProductionOrder, client?: string, onAnalyze: (incident: Incident, order: ProductionOrder) => void }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);

  const typeClasses: Record<Incident['type'], string> = {
    'Falla Equipo': 'bg-red-100 text-red-700 border-red-500',
    'Error Humano': 'bg-yellow-100 text-yellow-700 border-yellow-500',
    'Retraso MP': 'bg-blue-100 text-blue-700 border-blue-500',
    'Calidad': 'bg-purple-100 text-purple-700 border-purple-500',
    'Otro': 'bg-gray-100 text-gray-700 border-gray-400',
  };

  return (
    <div className={`p-3 bg-white rounded-lg shadow-sm border-l-4 ${typeClasses[incident.type]} transition-transform duration-200 hover:scale-105`}>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeClasses[incident.type].replace('border-l-4', '')}`}>{incident.type}</span>
      <p className="text-sm text-gray-800 font-medium my-1">{incident.description}</p>
      <div className="text-xs text-gray-500 flex justify-between items-center mt-2 pt-2 border-t">
          <span>OP: <span className="font-semibold text-indigo-700">{incident.op_id || 'N/A'}</span></span>
          <span>{isClient ? formatDateTime(incident.timestamp) : '...'}</span>
      </div>
      {order && (
        <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-100 h-7" onClick={() => onAnalyze(incident, order)}>
                <Sparkles className="w-3 h-3 mr-1.5" />
                Analizar Impacto con IA
            </Button>
        </div>
      )}
    </div>
  )
}

export function IncidentsSection({ incidents, orders, clients, onAddIncident }: IncidentsSectionProps) {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<ExceptionImpactAnalysisOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const ordersMap = new Map(orders.map(o => [o.op_id, o]));
  
  const handleAnalyze = async (incident: Incident, order: ProductionOrder) => {
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    try {
        const opDetails = `
            Producto: ${order.product}, 
            Cliente: ${clients[order.client_id] || 'N/A'},
            Estado Actual: ${order.status},
            Prioridad: ${order.priority},
            Cantidad: ${order.qty}
        `;
        const result = await exceptionImpactAnalysis({
            incidentDescription: incident.description,
            opDetails: opDetails
        });
        setAnalysisResult(result);
    } catch (e) {
        toast({ title: "Error de IA", description: "No se pudo completar el análisis.", variant: "destructive" });
        console.error("Analysis failed:", e);
    } finally {
        setIsLoadingAnalysis(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-4 flex justify-between items-center font-headline">
        <span className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-slate-500" />Registro de Novedades</span>
        <LogIncidentModal orders={orders} clients={clients} onAddIncident={onAddIncident} />
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto p-1 mb-4">
        {incidents.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Sin novedades registradas.</p>
        ) : (
          incidents.map(incident => (
            <IncidentItem 
                key={incident.id}
                incident={incident}
                order={incident.op_id ? ordersMap.get(incident.op_id) : undefined}
                client={incident.op_id ? clients[ordersMap.get(incident.op_id)?.client_id || ''] : undefined}
                onAnalyze={handleAnalyze}
            />
          ))
        )}
      </div>
      
      {(isLoadingAnalysis || analysisResult) && (
        <Card className="shadow-lg rounded-xl bg-indigo-50 border-indigo-200 mt-4">
            <CardContent className="p-4">
                <div className="flex items-center mb-3">
                    <BrainCircuit className="w-6 h-6 mr-3 text-indigo-600"/>
                    <h3 className="text-md font-bold text-indigo-800">Análisis de Impacto IA</h3>
                </div>
                {isLoadingAnalysis && (
                    <div className="flex items-center justify-center p-4">
                         <Sparkles className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
                        <p className="text-indigo-700">Analizando...</p>
                    </div>
                )}
                {analysisResult && (
                    <Alert variant="default" className="bg-transparent border-0 p-0">
                         <AlertTitle className="font-semibold text-indigo-700">Área de Mayor Impacto: {analysisResult.impactedArea}</AlertTitle>
                         <AlertDescription className="text-indigo-900/80 mt-2 space-y-2 text-sm">
                            <p><strong>Resumen:</strong> {analysisResult.impactSummary}</p>
                            <p><strong>Sugerencia:</strong> {analysisResult.suggestedActions}</p>
                         </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      )}

    </section>
  );
}
