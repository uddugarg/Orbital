'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2Icon, ClockIcon, AlertCircleIcon, ListTodoIcon } from 'lucide-react';
import { parseISO, differenceInDays, isBefore } from 'date-fns';

export default function DashboardStats() {
    const { items } = useSelector((state: RootState) => state.tasks);

    const totalTasks = items.length;
    const completedTasks = items.filter(task => task.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const inProgressTasks = items.filter(task => task.status === 'in-progress').length;
    const todoTasks = items.filter(task => task.status === 'todo').length;

    const now = new Date();
    const overdueTasks = items.filter(task => {
        const dueDate = parseISO(task.dueDate);
        return isBefore(dueDate, now) && task.status !== 'completed';
    }).length;

    const upcomingDeadlines = items.filter(task => {
        const dueDate = parseISO(task.dueDate);
        const daysLeft = differenceInDays(dueDate, now);
        return daysLeft >= 0 && daysLeft <= 3 && task.status !== 'completed';
    }).length;

    // Calculate average estimation hours
    const totalEstimatedHours = items.reduce((sum, task) => sum + task.estimatedHours, 0);
    const avgEstimatedHours = totalTasks > 0 ? Math.round((totalEstimatedHours / totalTasks) * 10) / 10 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                    <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {completedTasks} out of {totalTasks} tasks completed
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
                    <ListTodoIcon className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <div className="w-16 text-xs">To Do:</div>
                            <div className="w-12 text-xl font-bold">{todoTasks}</div>
                            <div className="text-xs text-muted-foreground">tasks</div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-16 text-xs">In Progress:</div>
                            <div className="w-12 text-xl font-bold">{inProgressTasks}</div>
                            <div className="text-xs text-muted-foreground">tasks</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
                    <ClockIcon className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <div className="w-16 text-xs">Overdue:</div>
                            <div className={`w-12 text-xl font-bold ${overdueTasks > 0 ? 'text-red-500' : ''}`}>
                                {overdueTasks}
                            </div>
                            <div className="text-xs text-muted-foreground">tasks</div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-16 text-xs">Upcoming:</div>
                            <div className={`w-12 text-xl font-bold ${upcomingDeadlines > 0 ? 'text-yellow-500' : ''}`}>
                                {upcomingDeadlines}
                            </div>
                            <div className="text-xs text-muted-foreground">tasks</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estimation</CardTitle>
                    <AlertCircleIcon className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgEstimatedHours} hours</div>
                    <p className="text-xs text-muted-foreground">
                        Average estimated time per task
                    </p>
                    <div className="mt-4 text-xs flex items-center justify-between">
                        <div>Total estimation:</div>
                        <div>{totalEstimatedHours} hours</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}