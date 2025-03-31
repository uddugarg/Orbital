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
    getDueDateStatus,
    renderCellValue
} from '@/lib/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

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

    // Row height for virtualization
    const ROW_HEIGHT = 72;

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

    // Load more data when approaching the end of the list
    const loadMoreItems = useCallback(() => {
        if (!loading && !loadingMore && filteredItems.length < totalCount) {
            dispatch(loadMoreTasks(10));
        }
    }, [dispatch, filteredItems.length, loading, loadingMore, totalCount]);

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
                ref={(node) => {
                    // Explicitly type 'node' as HTMLElement or null
                    const element = node as HTMLElement | null;
                    // Apply both refs
                    drag(element);
                    drop(element);
                }}
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

    const VirtualRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const task = filteredItems[index];
        if (!task) return null;

        return (
            <div style={style} className="flex border-b">
                {columns.map((column, colIndex) => (
                    <div
                        key={`${task.id}-${column.key}`}
                        className="py-4 px-4 flex items-center"
                        style={{
                            flex: column.key === 'title' ? '2' : '1',
                            minWidth: column.key === 'title' ? '300px' : '150px',
                            overflow: 'hidden'
                        }}
                        onClick={() => handleViewTask(task)}
                    >
                        {column.render
                            ? column.render(task)
                            : renderCellValue(task, column.key as keyof Task)}
                    </div>
                ))}
            </div>
        );
    };

    const onItemsRendered = ({ visibleStopIndex }: { visibleStopIndex: number }) => {
        if (visibleStopIndex >= filteredItems.length - 10) {
            loadMoreItems();
        }
    };

    if (loading && filteredItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 border rounded-md">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading tasks...</span>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="border rounded-md">
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

                {/* Virtualized table body */}
                <div className="h-[70vh] w-full">
                    {filteredItems.length === 0 ? (
                        <div className="h-full flex justify-center items-center">
                            No tasks found.
                        </div>
                    ) : (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={filteredItems.length}
                                    itemSize={ROW_HEIGHT}
                                    onItemsRendered={onItemsRendered}
                                >
                                    {VirtualRow}
                                </List>
                            )}
                        </AutoSizer>
                    )}
                </div>

                {loadingMore && (
                    <div className="p-4 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">
                            Loading more tasks...
                        </p>
                    </div>
                )}
            </div>
        </DndProvider>
    );
}