import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductionOrder, ProductionOrderStatus, Material } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock, Calendar, Droplets, User } from "lucide-react";
import { OpActions } from "./op-actions";

interface OpListItemProps {
    order: ProductionOrder;
    clientName: string;
    materialsMap: Record<string, Material>;
    isCurrentWeek: boolean;
    onStart: (id: string) => void;
    onComplete: (id: string) => void;
    onMarkCritical: (id: string) => void;
    onDelete: (id: string) => void;
}

const statusClasses: Record<ProductionOrderStatus, { bg: string; text: string, border: string }> = {
    Pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
    'En Proceso': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    Crítico: { bg: 'bg-red-100 animate-pulse', text: 'text-red-800', border: 'border-red-600' },
    Terminada: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-500' },
};

export function OpListItem({ order, clientName, materialsMap, isCurrentWeek, ...actionHandlers }: OpListItemProps) {
    const statusInfo = statusClasses[order.status];
    
    const alertBorderClass = order.job_type === 'Express/Small Job' ? 'border-red-600' :
                             order.priority === 'Alta' ? 'border-amber-500' :
                             order.status === 'Crítico' ? 'border-red-600' : 'border-indigo-500';

    const renderAlertBadge = () => {
        if(order.status === 'Crítico') return <Badge variant="destructive" className="mr-2">¡CRÍTICO!</Badge>
        if(order.job_type === 'Express/Small Job') return <Badge variant="destructive" className="mr-2 bg-red-600">EXPRESS</Badge>
        if(order.priority === 'Alta') return <Badge className="bg-amber-500 text-white mr-2">ALTA PRIORIDAD</Badge>
        return null;
    }

    const consumptionString = order.materials.map(m => {
        const material = materialsMap[m.materialId];
        return `${m.consumption} ${material?.unit || 'u.'} de ${material?.name || m.materialId}`;
    }).join(', ');

    return (
        <div className={cn("p-4 bg-white rounded-xl shadow-md mb-3 border-l-8 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1", alertBorderClass)}>
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800 font-headline">{order.op_id}</h3>
                <Badge className={cn(statusInfo.bg, statusInfo.text, "text-xs font-bold")}>{order.status.toUpperCase()}</Badge>
            </div>
            <p className="text-lg font-semibold text-indigo-700 mt-1">{order.product}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3 text-gray-600">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> <span>Cliente: <span className="font-medium text-gray-800">{clientName}</span></span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> <span>Semana: <span className={cn("font-bold", isCurrentWeek ? 'text-indigo-600' : 'text-gray-800')}>{order.targetWeek}</span> {isCurrentWeek && '(Actual)'}</span></div>
            </div>
             <div className="flex items-start gap-2 mt-3 text-sm text-gray-600">
                <Droplets className="w-4 h-4 text-gray-400 mt-1 shrink-0" /> 
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800">Consumo:</span>
                    <span className="text-red-500">{consumptionString}</span>
                </div>
            </div>


            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                 <div>
                    <p className="font-bold text-gray-500 mb-1">Tiempos Estimados:</p>
                    <div className="flex items-center gap-2 text-gray-700"><Clock className="w-3 h-3"/> Inicio: {formatDateTime(order.start_time_est)}</div>
                    <div className="flex items-center gap-2 text-gray-700"><Clock className="w-3 h-3"/> Fin: {formatDateTime(order.end_time_est)}</div>
                </div>
                 <div>
                    <p className="font-bold text-gray-500 mb-1">Tiempos Reales:</p>
                    <div className="flex items-center gap-2 text-gray-700"><Clock className="w-3 h-3"/> Inicio: {formatDateTime(order.start_time_real)}</div>
                    <div className="flex items-center gap-2 text-gray-700"><Clock className="w-3 h-3"/> Fin: {formatDateTime(order.end_time_real)}</div>
                </div>
            </div>

             <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  {renderAlertBadge()}
                </div>
                <OpActions order={order} {...actionHandlers} isKanban={false} />
            </div>
        </div>
    );
}
