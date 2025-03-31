'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { groupTasksByEstimatedHours } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function EstimationPieChart() {
    const { items, loading } = useSelector((state: RootState) => state.tasks);
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        if (items.length > 0) {
            const tasksByHours = groupTasksByEstimatedHours(items);

            const data = Object.entries(tasksByHours).map(([name, value]) => ({
                name,
                value,
            }));

            setChartData(data);
        }
    }, [items]);

    if (loading || chartData.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value} tasks`, 'Count']}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
