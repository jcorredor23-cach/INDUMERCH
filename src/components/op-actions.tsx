"use client";

import { Button } from "@/components/ui/button";
import { ProductionOrder } from "@/lib/types";
import { Flame, Play, Check, Trash2 } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OpActionsProps {
  order: ProductionOrder;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onMarkCritical: (id: string) => void;
  onDelete: (id: string) => void;
  isKanban: boolean;
}

export function OpActions({ order, onStart, onComplete, onMarkCritical, onDelete, isKanban = false }: OpActionsProps) {
  
  const sizeClass = isKanban ? 'p-1 h-7 w-7' : 'p-2 h-9 w-9';
  const iconSize = isKanban ? 'h-4 w-4' : 'h-5 w-5';

  if (order.status === 'Terminada') {
    return (
      <div className={`flex items-center ${isKanban ? 'justify-end' : ''}`}>
        <span className="text-green-600 font-bold text-sm">FINALIZADA</span>
      </div>
    );
  }

  const renderActionButton = () => {
    if (order.status === 'Pendiente') {
      return (
        <Button onClick={() => onStart(order.id)} size={isKanban ? 'sm' : 'default'} className="bg-indigo-600 hover:bg-indigo-700">
          <Play className={isKanban ? 'mr-1 h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!isKanban && 'Iniciar'}
        </Button>
      );
    }
    if (order.status === 'En Proceso' || order.status === 'Crítico') {
      return (
        <Button onClick={() => onComplete(order.id)} size={isKanban ? 'sm' : 'default'} className="bg-green-600 hover:bg-green-700">
          <Check className={isKanban ? 'mr-1 h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!isKanban && 'Terminar'}
        </Button>
      );
    }
    return null;
  };

  const isCriticalDisabled = order.status === 'Terminada' || order.status === 'Crítico';
  const isDeleteDisabled = order.status !== 'Pendiente';

  return (
    <div className="flex justify-end items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMarkCritical(order.id)}
                disabled={isCriticalDisabled}
                className={`${sizeClass} text-amber-500 hover:bg-amber-100 hover:text-amber-600 disabled:text-gray-400 disabled:bg-gray-200`}
              >
                <Flame className={iconSize} />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isCriticalDisabled ? "No se puede marcar" : "Marcar como Crítico"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <AlertDialogTrigger asChild disabled={isDeleteDisabled}>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleteDisabled}
                    className={`${sizeClass} text-red-500 hover:bg-red-100 hover:text-red-600 disabled:text-gray-400 disabled:bg-gray-200`}
                  >
                    <Trash2 className={iconSize} />
                  </Button>
                </AlertDialogTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDeleteDisabled ? "No se puede eliminar" : "Eliminar OP"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar la OP {order.op_id}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La orden de producción será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(order.id)} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {renderActionButton()}
    </div>
  );
}
