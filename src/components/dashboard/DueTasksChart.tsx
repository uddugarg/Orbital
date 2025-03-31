'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { addDays, format } from 'date-fns';
import { groupTasksByDueDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function DueTasksChart() {
    const { items, loading } = useSelector((state: RootState) => state.tasks);
    const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);

    useEffect(() => {
        if (items.length > 0) {
            const tasksByDueDate = groupTasksByDueDate(items);

            const today = new Date();
            const dataPoints = [];

            for (let i = 0; i < 14; i++) {
                const date = addDays(today, i);
                const formattedDate = format(date, 'yyyy-MM-dd');

                dataPoints.push({
                    date: format(date, 'MMM dd'),
                    count: tasksByDueDate[formattedDate] || 0,
                });
            }

            setChartData(dataPoints);
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
            <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="count"
                    name="Tasks Due"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}