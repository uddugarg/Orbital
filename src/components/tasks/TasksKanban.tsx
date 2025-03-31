'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setSelectedTask, updateTaskStatus } from '@/store/features/tasksSlice';
import { setTaskDrawer } from '@/store/features/uiSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Loader2, MessageSquare } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { formatDate, getStatusColor, getPriorityColor, getDueDateStatus } from '@/lib/utils';

type KanbanColumn = {
    id: TaskStatus;
    title: string;
};

const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'completed', title: 'Completed' },
];

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

const DraggableTaskCard = ({ task, onClick }: TaskCardProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const { color: dueDateColor } = getDueDateStatus(task.dueDate);

    return (
        <div
            ref={drag}
            className={`${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={() => onClick(task)}
        >
            <Card className="mb-3 cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                        {task.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1 pb-0">
                    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-xs">
                            <CalendarDays className="h-3 w-3" />
                            <span className={dueDateColor}>{formatDate(task.dueDate)}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <MessageSquare className="h-3 w-3" />
                            <span>{task.comments.length}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-2">
                    <div className="flex items-center justify-between w-full">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-muted-foreground">
                            #{task.id.split('-')[1]}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

const KanbanColumn = ({ column, tasks, onTaskClick, onTaskDrop }: {
    column: KanbanColumn;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: { id: string }) => {
            onTaskDrop(item.id, column.id);
            return { status: column.id };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`flex flex-col h-full min-h-[70vh] rounded-md p-2 ${isOver ? 'bg-accent/70' : 'bg-muted/30'
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className={`mr-2 ${getStatusColor(column.id)}`}>
                        {tasks.length}
                    </Badge>
                    {column.title}
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
                {tasks.map((task) => (
                    <DraggableTaskCard
                        key={task.id}
                        task={task}
                        onClick={onTaskClick}
                    />
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground italic border-2 border-dashed rounded-md">
                        Drag tasks here
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TasksKanban() {
    const dispatch = useDispatch<AppDispatch>();
    const { filteredItems, loading } = useSelector((state: RootState) => state.tasks);

    // Group tasks by status
    const tasksByStatus: Record<TaskStatus, Task[]> = {
        'todo': [],
        'in-progress': [],
        'review': [],
        'completed': [],
    };

    filteredItems.forEach((task) => {
        tasksByStatus[task.status].push(task);
    });

    const handleTaskClick = (task: Task) => {
        dispatch(setSelectedTask(task));
        dispatch(setTaskDrawer(true));
    };

    const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
        dispatch(updateTaskStatus({ taskId, status: newStatus }));
    };

    if (loading && filteredItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={tasksByStatus[column.id]}
                        onTaskClick={handleTaskClick}
                        onTaskDrop={handleTaskDrop}
                    />
                ))}
            </div>
        </DndProvider>
    );
}
