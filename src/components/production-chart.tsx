"use client"

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionOrder, ProductionOrderStatus } from "@/lib/types";
import { PieChart as PieChartIcon } from "lucide-react";

interface ProductionChartProps {
    orders: ProductionOrder[];
}

const COLORS: Record<ProductionOrderStatus, string> = {
    'Pendiente': '#facc15', // yellow-400
    'En Proceso': '#3b82f6', // blue-500
    'Crítico': '#ef4444', // red-500
    'Terminada': '#6b7280', // gray-500
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 5) return null; // Don't render small labels

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${value} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export function ProductionChart({ orders }: ProductionChartProps) {
    const chartData = useMemo(() => {
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<ProductionOrderStatus, number>);

        return (Object.keys(statusCounts) as ProductionOrderStatus[])
            .map(status => ({
                name: status,
                value: statusCounts[status]
            }))
            .filter(item => item.value > 0);

    }, [orders]);

    return (
        <Card className="shadow-2xl rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700 flex items-center font-headline">
                    <PieChartIcon className="w-5 h-5 mr-2 text-slate-500" />
                    Distribución de Órdenes de Producción
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as ProductionOrderStatus]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '0.5rem',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{fontSize: '14px', paddingTop: '20px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No hay órdenes para mostrar en el gráfico.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
