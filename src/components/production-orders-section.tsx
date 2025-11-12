
"use client";

import { useMemo } from 'react';
import { ClipboardList, PauseCircle, PlayCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Client, Material, Product, ProductionOrder, ProductionOrderStatus } from '@/lib/types';
import { getCurrentISOWeek } from '@/lib/utils';
import { CreateOpModal } from './create-op-modal';
import { OpListItem } from './op-list-item';
import { OpKanbanCard } from './op-kanban-card';

interface ProductionOrdersSectionProps {
  orders: ProductionOrder[];
  clients: Client[];
  materials: Material[];
  products: Product[];
  onAddOrder: (order: Omit<ProductionOrder, 'id' | 'op_id' | 'createdAt' | 'status'>) => void;
  onStartOrder: (id: string) => void;
  onCompleteOrder: (id: string) => void;
  onMarkCritical: (id: string) => void;
  onDeleteOrder: (id: string) => void;
}

const KanbanColumn = ({ title, icon, children, colorClass }: { title: string; icon: React.ReactNode; children: React.ReactNode; colorClass: string }) => (
    <div className="bg-gray-100/80 rounded-lg p-3 h-full">
        <h3 className={`font-bold mb-3 text-center border-b-2 pb-2 flex items-center justify-center text-sm ${colorClass}`}>
            {icon} {title}
        </h3>
        <div className="space-y-2 h-[500px] overflow-y-auto p-1">
            {children}
        </div>
    </div>
);


export function ProductionOrdersSection({ orders, clients, materials, products, ...handlers }: ProductionOrdersSectionProps) {
  const currentWeek = getCurrentISOWeek();

  const clientsMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c.name])), [clients]);
  const materialsMap = useMemo(() => Object.fromEntries(materials.map(m => [m.id, m])), [materials]);

  const ordersByStatus = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (order.status !== 'Terminada') {
        (acc[order.status] = acc[order.status] || []).push(order);
      }
      return acc;
    }, {} as Record<ProductionOrderStatus, ProductionOrder[]>);
  }, [orders]);
  
  const actionHandlers = {
    onStart: handlers.onStartOrder,
    onComplete: handlers.onCompleteOrder,
    onMarkCritical: handlers.onMarkCritical,
    onDelete: handlers.onDeleteOrder
  };

  const renderKanbanCards = (status: ProductionOrderStatus) => {
      const orderList = ordersByStatus[status] || [];
      if (orderList.length === 0) return <p className="text-center text-xs text-gray-400 p-4">Vacío</p>;
      return orderList.map(order => (
        <OpKanbanCard 
            key={order.id} 
            order={order} 
            clientName={clientsMap[order.client_id] || order.client_id}
            materialsMap={materialsMap}
            {...actionHandlers}
        />
      ));
  }

  return (
    <Card className="shadow-2xl rounded-xl col-span-1 xl:col-span-2">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-slate-700 flex items-center font-headline">
                <ClipboardList className="w-5 h-5 mr-2 text-slate-500" />
                Órdenes de Colada (OP)
            </CardTitle>
            <CreateOpModal clients={clients} materials={materials} products={products} onAddOrder={handlers.onAddOrder} />
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
             <div className="space-y-4 max-h-[600px] overflow-y-auto p-1">
              {orders.length === 0 ? (
                <p className="text-center text-gray-400 py-6">No hay órdenes activas.</p>
              ) : (
                orders.filter(o => o.status !== 'Terminada').map(order => (
                  <OpListItem
                    key={order.id}
                    order={order}
                    clientName={clientsMap[order.client_id] || order.client_id}
                    materialsMap={materialsMap}
                    isCurrentWeek={order.targetWeek === currentWeek}
                    {...actionHandlers}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KanbanColumn title="Pendiente" icon={<PauseCircle className="w-4 h-4 mr-2"/>} colorClass="text-yellow-600 border-yellow-400">
                    {renderKanbanCards('Pendiente')}
                </KanbanColumn>
                <KanbanColumn title="En Proceso" icon={<PlayCircle className="w-4 h-4 mr-2"/>} colorClass="text-blue-600 border-blue-400">
                    {renderKanbanCards('En Proceso')}
                </KanbanColumn>
                <KanbanColumn title="Crítico" icon={<AlertCircle className="w-4 h-4 mr-2"/>} colorClass="text-red-600 border-red-400">
                    {renderKanbanCards('Crítico')}
                </KanbanColumn>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
