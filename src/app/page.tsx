
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getISOWeek } from 'date-fns';

import type { Material, ProductionOrder, Incident, Client, Product, MaterialConsumption } from '@/lib/types';
import { initialMaterials, initialClients, initialProductionOrders, initialIncidents, products as allProducts } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/firebase';
import { MainLayout } from '@/components/main-layout';

import { ProductionOrdersSection } from '@/components/production-orders-section';
import { IncidentsSection } from '@/components/incidents-section';
import { User, History } from 'lucide-react';
import { ProductionChart } from '@/components/production-chart';
import { Button } from '@/components/ui/button';

export default function SteelFlowDashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [clients] = useState<Client[]>(initialClients);
  const [orders, setOrders] = useState<ProductionOrder[]>(initialProductionOrders);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [lastOPNumber, setLastOPNumber] = useState(() => 
    Math.max(0, ...initialProductionOrders.map(op => parseInt(op.op_id.split('-')[1] || '0')))
  );

  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  const clientsMap = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.id] = client.name;
      return acc;
    }, {} as Record<string, string>);
  }, [clients]);

  const materialsMap = useMemo(() => {
    return materials.reduce((acc, material) => {
      acc[material.id] = material;
      return acc;
    }, {} as Record<string, Material>);
  }, [materials]);

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'Terminada'), [orders]);

  const handleCreateOrder = (newOrderData: Omit<ProductionOrder, 'id' | 'op_id' | 'createdAt' | 'status'>) => {
    const newOPNumber = lastOPNumber + 1;
    const newOrder: ProductionOrder = {
      ...newOrderData,
      id: `doc_${Date.now()}`,
      op_id: `COLADA-${String(newOPNumber).padStart(3, '0')}`,
      createdAt: Date.now(),
      status: 'Pendiente',
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setLastOPNumber(newOPNumber);
    toast({
      title: "Orden Creada",
      description: `${newOrder.op_id} para ${clientsMap[newOrder.client_id]} ha sido creada.`,
      variant: "default",
    });
  };
  
  const handleStartOrder = (orderId: string) => {
    const targetOrder = orders.find(order => order.id === orderId);

    if (!targetOrder) {
        toast({ title: "Error", description: "Orden no encontrada.", variant: "destructive" });
        return;
    }
    
    if (targetOrder.status !== 'Pendiente') {
        toast({ title: "Acción no permitida", description: `${targetOrder.op_id} no está pendiente.`, variant: "destructive" });
        return;
    }
    
    // Check stock for all materials
    for (const materialConsumption of targetOrder.materials) {
        const material = materialsMap[materialConsumption.materialId];
        if (!material) {
            toast({ title: "Error de Datos", description: `Materia prima ${materialConsumption.materialId} no encontrada.`, variant: "destructive" });
            return;
        }
        if (material.stock < materialConsumption.consumption) {
            toast({ 
                title: "Stock Insuficiente", 
                description: `Faltan ${materialConsumption.consumption - material.stock} ${material.unit} de ${material.name}.`,
                variant: "destructive" 
            });
            return;
        }
    }

    // Update material stock
    setMaterials(prevMaterials => {
        const newMaterials = [...prevMaterials];
        for (const materialConsumption of targetOrder.materials) {
            const matIndex = newMaterials.findIndex(m => m.id === materialConsumption.materialId);
            if (matIndex !== -1) {
                newMaterials[matIndex] = {
                    ...newMaterials[matIndex],
                    stock: newMaterials[matIndex].stock - materialConsumption.consumption,
                };
            }
        }
        return newMaterials;
    });

    // Update order status
    setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { 
            ...order, 
            status: 'En Proceso', 
            start_time_real: Date.now(),
            startWeek: getISOWeek(new Date()),
        } : order
    ));
    
    toast({ title: "Orden Iniciada", description: `${targetOrder.op_id} ha comenzado. Stock actualizado.` });
  };

  const handleCompleteOrder = (orderId: string) => {
    const orderToComplete = orders.find(o => o.id === orderId);
     if (!orderToComplete || (orderToComplete.status !== 'En Proceso' && orderToComplete.status !== 'Crítico')) {
        toast({ title: "Acción no permitida", description: "La orden debe estar 'En Proceso' o 'Crítico' para completarse.", variant: "destructive" });
        return;
    }

    setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { 
            ...order, 
            status: 'Terminada', 
            end_time_real: Date.now(),
            completionWeek: getISOWeek(new Date()),
        } : order
    ));
    toast({ title: "Orden Completada", description: `${orderToComplete.op_id} ha sido marcada como terminada.` });
  };

  const handleMarkCritical = (orderId: string) => {
    const orderToMark = orders.find(o => o.id === orderId);
    if (!orderToMark || orderToMark.status === 'Terminada' || orderToMark.status === 'Crítico') {
        toast({ title: "Acción no permitida", description: "La orden ya está terminada o es crítica.", variant: "destructive" });
        return;
    }

    setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'Crítico' } : order
    ));
    toast({ title: "Orden Crítica", description: `${orderToMark.op_id} marcada como crítica.`, variant: "default" });
  };

  const handleDeleteOrder = (orderId: string) => {
     const orderToDelete = orders.find(o => o.id === orderId);
     if (!orderToDelete) return;

    if (orderToDelete.status !== 'Pendiente') {
        toast({ title: "Restricción", description: "Solo se pueden eliminar órdenes pendientes.", variant: "destructive" });
        return;
    }

    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    toast({ title: "Orden Eliminada", description: `${orderToDelete.op_id} ha sido eliminada.` });
  };

  const handleCreateIncident = (newIncidentData: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...newIncidentData,
      id: `inc_${Date.now()}`,
      timestamp: Date.now(),
    };
    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
    toast({ title: "Novedad Registrada", description: `Se ha registrado una nueva novedad de tipo: ${newIncident.type}.` });
  };

  if (isUserLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <MainLayout>
      <main className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-extrabold text-slate-800 font-headline mb-6">Dashboard Principal</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:col-span-2">
            <ProductionOrdersSection
              orders={activeOrders}
              clients={clients}
              materials={materials}
              products={allProducts}
              onAddOrder={handleCreateOrder}
              onStartOrder={handleStartOrder}
              onCompleteOrder={handleCompleteOrder}
              onMarkCritical={handleMarkCritical}
              onDeleteOrder={handleDeleteOrder}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
             <IncidentsSection 
                incidents={incidents} 
                orders={orders}
                clients={clientsMap}
                onAddIncident={handleCreateIncident}
              />
              <ProductionChart orders={orders} />
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
