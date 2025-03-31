'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTasks } from '@/store/features/tasksSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import CompletedTasksChart from '@/components/dashboard/CompletedTasksChart';
import DueTasksChart from '@/components/dashboard/DueTasksChart';
import EstimationPieChart from '@/components/dashboard/EstimationPieChart';
import TaskReminders from '@/components/dashboard/TaskReminders';

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, items, isInitialized } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        // Only fetch if we haven't initialized the data yet
        if (!isInitialized) {
            dispatch(fetchTasks(200));
        }
    }, [dispatch, isInitialized]);

    if (loading && items.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mx-auto mt-8 max-w-4xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your tasks and progress
                </p>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Completed Tasks per Day</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <CompletedTasksChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tasks Due per Day</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <DueTasksChart />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Estimation Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                        <EstimationPieChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 overflow-auto">
                        <TaskReminders />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}