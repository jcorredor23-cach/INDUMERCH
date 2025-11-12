
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { initialClients, initialProductionOrders, initialMaterials } from '@/lib/data';
import type { Client, ProductionOrder, Material } from '@/lib/types';
import { OpListItem } from '@/components/op-list-item';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/main-layout';


export default function HistoryPage() {
  const [orders] = useState<ProductionOrder[]>(initialProductionOrders);
  const [clients] = useState<Client[]>(initialClients);
  const [materials] = useState<Material[]>(initialMaterials);

  const finishedOrders = useMemo(() => orders.filter(o => o.status === 'Terminada'), [orders]);

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


  return (
    <MainLayout>
      <main className="max-w-screen-xl mx-auto p-4 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 font-headline">Historial de Coladas Terminadas</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-2xl">
          {finishedOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OP ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha Finalización</TableHead>
                  <TableHead>Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finishedOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.op_id}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{clientsMap[order.client_id]}</TableCell>
                    <TableCell>{formatDateTime(order.end_time_real)}</TableCell>
                    <TableCell>{order.qty} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-12">No hay coladas terminadas para mostrar.</p>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
