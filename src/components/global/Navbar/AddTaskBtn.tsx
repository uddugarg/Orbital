'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { PlusIcon, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskPriority, TaskStatus } from '@/types';
import { Label } from '@/components/ui/label';
import { createTask } from '@/store/features/tasksSlice';
import { toast } from 'sonner';

export default function AddTaskBtn() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        dueDate: new Date(),
        estimatedHours: 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title || formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.description) {
            newErrors.description = 'Description is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        if (!formData.estimatedHours || formData.estimatedHours < 1) {
            newErrors.estimatedHours = 'Estimated hours must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });

        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: '',
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const resultAction = await dispatch(createTask({
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate,
                estimatedHours: formData.estimatedHours
            }));

            if (createTask.fulfilled.match(resultAction)) {
                // Task created successfully
                toast.success("Task Created", {
                    description: `"${formData.title}" has been created successfully.`,
                });

                setFormData({
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium',
                    dueDate: new Date(),
                    estimatedHours: 1,
                });

                setOpen(false);
            } else {
                toast.error("Failed to create task", {
                    description: 'There was an error creating the task. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error("Failed to create task", {
                description: 'There was an error creating the task. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Task
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Enter task title"
                                className={errors.title ? 'border-red-500' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Enter task description"
                                className={errors.description ? 'border-red-500' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange('status', value)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => handleChange('priority', value)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !formData.dueDate && 'text-muted-foreground',
                                                errors.dueDate ? 'border-red-500' : ''
                                            )}
                                            disabled={isSubmitting}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.dueDate ? (
                                                format(formData.dueDate, 'PPP')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.dueDate}
                                            onSelect={(date) => handleChange('dueDate', date)}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.dueDate && (
                                    <p className="text-xs text-red-500">{errors.dueDate}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                                <Input
                                    id="estimatedHours"
                                    type="number"
                                    min={1}
                                    value={formData.estimatedHours}
                                    onChange={(e) => handleChange('estimatedHours', parseInt(e.target.value) || 0)}
                                    className={errors.estimatedHours ? 'border-red-500' : ''}
                                    disabled={isSubmitting}
                                />
                                {errors.estimatedHours && (
                                    <p className="text-xs text-red-500">{errors.estimatedHours}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Task'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}