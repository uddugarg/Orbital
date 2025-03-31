'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setSelectedTask } from '@/store/features/tasksSlice';
import { setTaskDrawer } from '@/store/features/uiSlice';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, getDueDateStatus, getPriorityColor } from '@/lib/utils';

export default function TaskReminders() {
    const { items } = useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Get upcoming tasks (due in the next 7 days, not completed)
    const today = new Date();
    const upcomingTasks = items
        .filter(task => {
            const dueDate = parseISO(task.dueDate);
            const daysLeft = differenceInDays(dueDate, today);
            return daysLeft >= -1 && daysLeft <= 7 && task.status !== 'completed';
        })
        .sort((a, b) => {
            return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
        });

    const handleViewTask = (task: Task) => {
        dispatch(setSelectedTask(task));
        dispatch(setTaskDrawer(true));
        router.push('/tasks');
    };

    if (upcomingTasks.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="text-xl mb-2">🎉</div>
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                    No upcoming deadlines for the next 7 days.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {upcomingTasks.map((task) => {
                const { color: dueDateColor, label: dueDateLabel } = getDueDateStatus(task.dueDate);

                return (
                    <div
                        key={task.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{task.title}</div>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                            </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3 line-clamp-1">
                            {task.description}
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.avatar} />
                                    <AvatarFallback>
                                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xs">
                                    <div className={dueDateColor}>
                                        {dueDateLabel}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {formatDate(task.dueDate)}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => handleViewTask(task)}
                            >
                                View
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}