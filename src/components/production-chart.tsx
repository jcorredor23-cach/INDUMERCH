"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionOrder } from "@/lib/types";
import { TrendingUp } from "lucide-react";

interface ProductionChartProps {
    orders: ProductionOrder[];
}

export function ProductionChart({ orders }: ProductionChartProps) {
    const chartData = useMemo(() => {
        const weeksData: { [key: number]: { week: number, Terminada: number } } = {};

        orders.forEach(order => {
            if (order.status === 'Terminada' && order.completionWeek) {
                const week = order.completionWeek;
                if (!weeksData[week]) {
                    weeksData[week] = { week: week, Terminada: 0 };
                }
                weeksData[week].Terminada++;
            }
        });
        
        // sort by week and take last 6 weeks
        return Object.values(weeksData)
            .sort((a, b) => a.week - b.week)
            .slice(-6);

    }, [orders]);

    return (
        <Card className="shadow-2xl rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700 flex items-center font-headline">
                    <TrendingUp className="w-5 h-5 mr-2 text-slate-500" />
                    Producción Semanal (Coladas Terminadas)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="week" 
                                    tickFormatter={(week) => `Sem ${week}`}
                                    fontSize={12}
                                />
                                <YAxis allowDecimals={false} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(230, 230, 250, 0.5)' }}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '0.5rem',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{fontSize: '12px'}} />
                                <Bar dataKey="Terminada" fill="#4f46e5" name="Coladas Terminadas" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No hay suficientes datos de producción para mostrar el gráfico.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
