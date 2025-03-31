'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setSelectedTask } from '@/store/features/tasksSlice';
import { setTaskDrawer } from '@/store/features/uiSlice';
import { useRouter } from 'next/navigation';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Task[]>([]);

    // Direct selector for tasks items to avoid any potential issues with object references
    const items = useSelector((state: RootState) => state.tasks.items);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                handleOpenChange(!open);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    useEffect(() => {
        if (!Array.isArray(items)) {
            return;
        }

        if (open && !searchQuery.trim()) {
            setSearchResults(items.slice(0, 10));
            return;
        }

        if (!searchQuery.trim() && !open) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = items.filter((task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.name.toLowerCase().includes(query) ||
            (Array.isArray(task.tags) && task.tags.some((tag) => tag.toLowerCase().includes(query)))
        );

        console.log("Filtered results:", results);
        setSearchResults(results.slice(0, 10));
    }, [searchQuery, items, open]);

    const handleSelectTask = (task: Task) => {
        console.log("Task selected:", task);
        dispatch(setSelectedTask(task));
        dispatch(setTaskDrawer(true));
        handleOpenChange(false);
        setSearchQuery('');

        router.push('/tasks');
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen && !searchQuery.trim() && Array.isArray(items)) {
            console.log("Setting initial search results");
            setSearchResults(items.slice(0, 10));
        }
    };

    return (
        <>
            <div
                className="min-w-[65%] flex items-center h-10 px-3 border rounded-md bg-background text-muted-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleOpenChange(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Search tasks...</span>
                <kbd className="ml-auto hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <CommandDialog open={open} onOpenChange={handleOpenChange}>
                <DialogTitle className="sr-only">Search Tasks</DialogTitle>

                <CommandInput
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Tasks">
                        {searchResults.length > 0 ? searchResults.map((task) => (
                            <CommandItem
                                key={task.id}
                                onSelect={() => handleSelectTask(task)}
                                className="flex items-center justify-between py-2"
                            >
                                <div className="flex flex-col">
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                        {task.description}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </Badge>
                                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(task.dueDate, 'MMM d')}</span>
                                        </div>
                                    </div>
                                </div>

                                <Avatar className="h-8 w-8 ml-4">
                                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                    <AvatarFallback>
                                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </CommandItem>
                        )) : (
                            <CommandItem disabled>No tasks found</CommandItem>
                        )}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}