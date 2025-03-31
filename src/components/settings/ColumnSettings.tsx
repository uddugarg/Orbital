import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
    updateColumnVisibility,
    updateColumnOrder,
    resetColumnSettings,
    ColumnVisibility
} from '@/store/features/uiSlice';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, RotateCcw } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ColumnItem = ({
    column,
    index,
    onToggle,
    moveItem
}: {
    column: ColumnVisibility;
    index: number;
    onToggle: (key: string, checked: boolean) => void;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN_ITEM',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'COLUMN_ITEM',
        hover: (item: { index: number }, monitor) => {
            if (item.index === index) return;
            moveItem(item.index, index);
            item.index = index;
        },
    });

    const getColumnLabel = (key: string) => {
        switch (key) {
            case 'title': return 'Task Title';
            case 'status': return 'Status';
            case 'priority': return 'Priority';
            case 'assignee': return 'Assignee';
            case 'dueDate': return 'Due Date';
            case 'estimatedHours': return 'Estimated Hours';
            case 'tags': return 'Tags';
            case 'actions': return 'Actions';
            default: return key.charAt(0).toUpperCase() + key.slice(1);
        }
    };

    return (
        <div
            ref={(node) => {
                const element = node as HTMLElement | null;
                drag(element);
                drop(element);
            }}
            className={`flex items-center gap-3 p-3 border rounded-md mb-2 ${isDragging ? 'opacity-50 bg-accent' : 'bg-card'
                }`}
        >
            <div className="cursor-move">
                <GripVertical size={20} className="text-muted-foreground" />
            </div>
            <Checkbox
                id={`column-${column.key}`}
                checked={column.visible}
                onCheckedChange={(checked) => onToggle(column.key, checked === true)}
            />
            <label
                htmlFor={`column-${column.key}`}
                className="flex-1 cursor-pointer"
            >
                {getColumnLabel(column.key)}
            </label>
        </div>
    );
};

export default function ColumnSettings() {
    const dispatch = useDispatch<AppDispatch>();
    const columnSettings = useSelector((state: RootState) => state.ui.columnSettings);

    const [columns, setColumns] = useState<ColumnVisibility[]>([]);

    useEffect(() => {
        setColumns([...columnSettings].sort((a, b) => a.order - b.order));
    }, [columnSettings]);

    const handleToggle = (key: string, checked: boolean) => {
        dispatch(updateColumnVisibility({ key, visible: checked }));
    };

    const moveItem = (dragIndex: number, hoverIndex: number) => {
        const draggedItem = columns[dragIndex];

        // Create new array with reordered items
        const newItems = [...columns];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);

        // Update order values
        const updatedItems = newItems.map((item, idx) => ({
            ...item,
            order: idx
        }));

        setColumns(updatedItems);
        dispatch(updateColumnOrder(updatedItems));
    };

    const handleReset = () => {
        dispatch(resetColumnSettings());
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Table Columns</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Default
                </Button>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
                Drag to reorder columns or toggle visibility
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="space-y-1">
                    {columns.map((column, index) => (
                        <ColumnItem
                            key={column.key}
                            column={column}
                            index={index}
                            onToggle={handleToggle}
                            moveItem={moveItem}
                        />
                    ))}
                </div>
            </DndProvider>
        </div>
    );
}