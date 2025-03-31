'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
    setSelectedTask,
    setSortField,
    fetchTasks,
    loadMoreTasks
} from '@/store/features/tasksSlice';
import { setTaskDrawer } from '@/store/features/uiSlice';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/global/CustomTable/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, ArrowUpDown, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types';
import {
    formatDate,
    getStatusColor,
    getPriorityColor,
    getDueDateStatus
} from '@/lib/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';

type ColumnType = {
    key: keyof Task | 'actions';
    label: string;
    sortable?: boolean;
    render?: (task: Task) => React.ReactNode;
};

export default function TasksTable() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        filteredItems,
        loading,
        loadingMore,
        totalCount,
        sortField,
        sortDirection,
        isInitialized
    } = useSelector((state: RootState) => state.tasks);

    const tableColumns = useSelector((state: RootState) => state.ui.tableColumns);
    const [columns, setColumns] = useState<ColumnType[]>([]);

    const tableContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(fetchTasks(200));
        }
    }, [dispatch, isInitialized]);

    useEffect(() => {
        const availableColumns: Record<string, ColumnType> = {
            title: {
                key: 'title',
                label: 'Task',
                sortable: true,
                render: (task: Task) => (
                    <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate max-w-[300px]">{task.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {task.description.length > 60
                                    ? task.description.substring(0, 60) + '...'
                                    : task.description}
                            </div>
                        </div>
                    </div>
                ),
            },
            status: {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (task: Task) => (
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status === 'in-progress' ? 'In Progress' :
                            task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                ),
            },
            priority: {
                key: 'priority',
                label: 'Priority',
                sortable: true,
                render: (task: Task) => (
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                ),
            },
            assignee: {
                key: 'assignee',
                label: 'Assignee',
                render: (task: Task) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.name}</span>
                    </div>
                ),
            },
            dueDate: {
                key: 'dueDate',
                label: 'Due Date',
                sortable: true,
                render: (task: Task) => {
                    const { color, label } = getDueDateStatus(task.dueDate);
                    return (
                        <div>
                            <div>{formatDate(task.dueDate)}</div>
                            <div className={`text-xs ${color}`}>{label}</div>
                        </div>
                    );
                },
            },
            estimatedHours: {
                key: 'estimatedHours',
                label: 'Est. Hours',
                sortable: true,
                render: (task: Task) => (
                    <div className="text-center">{task.estimatedHours}h</div>
                ),
            },
            tags: {
                key: 'tags',
                label: 'Tags',
                render: (task: Task) => (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                ),
            },
            actions: {
                key: 'actions',
                label: 'Actions',
                render: (task: Task) => (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewTask(task);
                                    }}
                                >
                                    View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    Edit task
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    Delete task
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        };

        setColumns(
            tableColumns.map((key) => availableColumns[key] || availableColumns.title)
        );
    }, [tableColumns]);

    const handleScroll = useCallback(() => {
        if (!tableContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;

        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

        const shouldLoadMore = isNearBottom &&
            !loading &&
            !loadingMore &&
            filteredItems.length < totalCount;

        if (shouldLoadMore) {
            // Load 10 more tasks
            dispatch(loadMoreTasks(10));
        }
    }, [dispatch, filteredItems.length, loading, loadingMore, totalCount]);

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const handleViewTask = (task: Task) => {
        dispatch(setSelectedTask(task));
        dispatch(setTaskDrawer(true));
    };

    const handleSort = (field: keyof Task) => {
        const direction =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        dispatch(setSortField({ field, direction }));
    };

    const moveColumn = (fromIndex: number, toIndex: number) => {
        const newColumns = [...tableColumns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);

        // Update Redux state
        // dispatch(updateTableColumns(newColumns));
    };

    const ColumnHeader = ({ column, index }: { column: ColumnType, index: number }) => {
        const [{ isDragging }, drag] = useDrag({
            type: 'COLUMN',
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [{ isOver }, drop] = useDrop({
            accept: 'COLUMN',
            drop: (item: { index: number }) => {
                if (item.index !== index) {
                    moveColumn(item.index, index);
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        });

        return (
            <TableHead
                ref={(node) => drag(drop(node))}
                className={`${isOver ? 'bg-accent' : ''}`}
                style={{ opacity: isDragging ? 0.5 : 1 }}
            >
                {column.sortable ? (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key as keyof Task)}
                        className="h-8 p-0 font-medium"
                    >
                        {column.label}
                        {sortField === column.key ? (
                            sortDirection === 'asc' ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                    </Button>
                ) : (
                    <span className="font-medium">{column.label}</span>
                )}
            </TableHead>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative border rounded-md">
                {/* Fixed header */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => (
                                <ColumnHeader
                                    key={`column-${column.key}`}
                                    column={column}
                                    index={index}
                                />
                            ))}
                        </TableRow>
                    </TableHeader>
                </Table>

                {/* Scrollable body */}
                <div
                    ref={tableContainerRef}
                    className="overflow-y-auto max-h-[70vh] overflow-x-auto"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <Table>
                        <TableBody>
                            {filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {loading ? (
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                <span>Loading tasks...</span>
                                            </div>
                                        ) : (
                                            "No tasks found."
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        onClick={() => handleViewTask(task)}
                                        className="cursor-pointer hover:bg-accent/50"
                                    >
                                        {columns.map((column) => (
                                            <TableCell key={`${task.id}-${column.key}`}>
                                                {column.render
                                                    ? column.render(task)
                                                    : task[column.key as keyof Task]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Loading indicator at the bottom */}
                    {loadingMore && (
                        <div className="p-4 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Loading more tasks...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
}