'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTasks, setView } from '@/store/features/tasksSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import TasksHeader from '@/components/tasks/TasksHeader';
import TasksTable from '@/components/tasks/TasksTable';
import TasksKanban from '@/components/tasks/TasksKanban';
import TaskDetailDrawer from '@/components/tasks/TasksDetailDrawer';

export default function TasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        loading,
        error,
        view
    } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks(10));
    }, [dispatch]);

    const handleViewChange = (view: 'table' | 'kanban') => {
        dispatch(setView(view));
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin" />
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
        <div className="container mx-auto space-y-6 pb-12">
            <TasksHeader currentView={view} onViewChange={handleViewChange} />

            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {view === 'table' ? <TasksTable /> : <TasksKanban />}
                </CardContent>
            </Card>

            <TaskDetailDrawer />
        </div>
    );
}