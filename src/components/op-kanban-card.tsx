
import { Badge } from "@/components/ui/badge";
import type { ProductionOrder, ProductionOrderStatus, Material } from "@/lib/types";
import { OpActions } from './op-actions';
import { cn } from "@/lib/utils";
import { HardHat, Cog } from 'lucide-react';

interface OpKanbanCardProps {
    order: ProductionOrder;
    clientName: string;
    materialsMap: Record<string, Material>;
    operatorName: string;
    machineName: string;
    onStart: (id: string) => void;
    onComplete: (id: string) => void;
    onMarkCritical: (id: string) => void;
    onDelete: (id: string) => void;
}

const statusClasses: Record<ProductionOrderStatus, { bg: string; border: string; }> = {
    Pendiente: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
    'En Proceso': { bg: 'bg-blue-500', border: 'border-blue-500' },
    Crítico: { bg: 'bg-red-600 animate-pulse', border: 'border-red-600' },
    Terminada: { bg: 'bg-gray-500', border: 'border-gray-500' },
};

export function OpKanbanCard({ order, clientName, materialsMap, operatorName, machineName, ...actionHandlers }: OpKanbanCardProps) {
    const statusClass = statusClasses[order.status];

    const alertBorderClass = order.job_type === 'Express/Small Job' ? 'border-red-600' :
                             order.priority === 'Alta' ? 'border-amber-500' :
                             order.status === 'Crítico' ? 'border-red-600' : 'border-indigo-500';

    const consumptionString = order.materials.map(m => {
        return `${m.consumption} kg de ${materialsMap[m.materialId]?.name || m.materialId}`;
    }).join(', ');

    return (
        <div className={cn("kanban-card p-3 bg-white rounded-lg shadow border-l-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-300 hover:-translate-y-1", alertBorderClass)}>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-indigo-700">{order.op_id}</span>
                <Badge className={cn("text-xs", statusClass.bg)}>{order.status}</Badge>
            </div>
            <p className="text-sm text-gray-800 font-medium truncate">{clientName}</p>
            <p className="text-xs text-indigo-700 font-medium mt-1 truncate">{order.product}</p>
            <p className="text-xs text-gray-500 mt-1 truncate" title={consumptionString}>Sem: {order.targetWeek} | {consumptionString}</p>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 truncate">
                <HardHat className="w-3 h-3" /> <span title={operatorName}>{operatorName}</span>
            </div>
             <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 truncate">
                <Cog className="w-3 h-3" /> <span title={machineName}>{machineName}</span>
            </div>
            <div className="mt-2 pt-2 border-t">
                <OpActions order={order} {...actionHandlers} isKanban={true} />
            </div>
        </div>
    );
}
