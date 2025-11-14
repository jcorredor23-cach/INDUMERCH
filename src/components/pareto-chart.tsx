
"use client"

import { useMemo } from "react";
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Incident } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface ParetoChartProps {
    incidents: Incident[];
}

export function ParetoChart({ incidents }: ParetoChartProps) {
    const paretoData = useMemo(() => {
        if (!incidents || incidents.length === 0) return [];

        const frequency = incidents.reduce((acc, incident) => {
            acc[incident.type] = (acc[incident.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedFrequency = Object.entries(frequency)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);

        const totalIncidents = incidents.length;
        let cumulativeCount = 0;
        
        return sortedFrequency.map(item => {
            cumulativeCount += item.count;
            return {
                name: item.type,
                count: item.count,
                cumulative: parseFloat(((cumulativeCount / totalIncidents) * 100).toFixed(1)),
            };
        });

    }, [incidents]);

    return (
        <Card className="shadow-2xl rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700 flex items-center font-headline">
                    <AlertCircle className="w-5 h-5 mr-2 text-slate-500" />
                    Diagnóstico de Problemas Críticos (Pareto)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    {paretoData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={paretoData}
                                margin={{
                                    top: 20, right: 30, left: 0, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{fontSize: 12}} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Cantidad de Incidentes', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fill: '#666' } }}/>
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Porcentaje Acumulado (%)', angle: 90, position: 'insideRight', offset: 10, style: { textAnchor: 'middle', fill: '#666' } }} />
                                <Tooltip
                                     contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '0.5rem',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}}/>
                                <Bar yAxisId="left" dataKey="count" name="Número de Incidentes" barSize={30} fill="#413ea0" />
                                <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Porcentaje Acumulado" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex items-center justify-center h-full text-gray-500">
                            No hay incidentes registrados para generar el diagrama.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

