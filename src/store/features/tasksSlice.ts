import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, Comment, TaskPriority } from '@/types';
import { RootState } from '..';

// Dummy API functions
const fetchTasksFromApi = async (limit: number = 10) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // This would be replaced with actual API call
    return {
        tasks: generateDummyTasks(limit),
        totalCount: 200, // Total tasks available
    };
};

// Add this new async thunk action
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: {
        title: string;
        description: string;
        status: TaskStatus;
        priority: TaskPriority;
        dueDate: Date;
        estimatedHours: number;
    }) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real app, you would make an API call to create the task
        // and the server would return the created task with an ID

        // For now, generate a random ID
        const id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create a new task object
        const newTask: Task = {
            id,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate.toISOString(),
            estimatedHours: taskData.estimatedHours,
            createdAt: new Date().toISOString(),
            completedAt: null,
            assignee: {
                // Placeholder assignee (in a real app, this would be the current user or assigned user)
                id: 'current-user',
                name: 'Current User',
                avatar: '/avatars/avatar-1.png',
            },
            tags: [], // Empty tags for now
            comments: [], // No comments initially
        };

        return newTask;
    }
);

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (limit: number = 10, { getState }) => {
        const state = getState() as RootState;

        if (state.tasks.isInitialized && state.tasks.items.length > 0) {
            return {
                tasks: state.tasks.items,
                totalCount: state.tasks.totalCount
            };
        }

        return {
            tasks: generateDummyTasks(limit),
            totalCount: 200
        };
    }
);

export const loadMoreTasks = createAsyncThunk(
    'tasks/loadMoreTasks',
    async (count: number = 10, { getState }) => {
        const state = getState() as RootState;

        const currentCount = state.tasks.items.length;

        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            tasks: generateAdditionalTasks(currentCount, count),
        };
    }
);

export const addComment = createAsyncThunk(
    'tasks/addComment',
    async ({ taskId, comment }: { taskId: string, comment: Comment }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { taskId, comment };
    }
);

export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ taskId, status }: { taskId: string, status: TaskStatus }) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        return { taskId, status };
    }
);

interface TasksState {
    items: Task[];
    filteredItems: Task[];
    selectedTask: Task | null;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    totalCount: number;
    filterStatus: TaskStatus | 'all';
    filterPriority: TaskPriority | 'all';
    sortField: keyof Task | null;
    sortDirection: 'asc' | 'desc';
    searchQuery: string;
    view: 'table' | 'kanban';
    isInitialized: boolean
}

const initialState: TasksState = {
    items: [],
    filteredItems: [],
    selectedTask: null,
    loading: false,
    loadingMore: false,
    error: null,
    totalCount: 0,
    filterStatus: 'all',
    filterPriority: 'all',
    sortField: null,
    sortDirection: 'asc',
    searchQuery: '',
    view: 'table',
    isInitialized: false
};

function generateDummyTasks(limit: number): Task[] {
    const tasks: Task[] = [];
    const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'completed'];
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

    // Generate dummy tasks
    for (let i = 0; i < limit; i++) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));

        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));

        const estimatedHours = Math.floor(Math.random() * 40) + 1;

        const completedDate = Math.random() > 0.5 ? new Date() : null;
        if (completedDate) {
            completedDate.setDate(completedDate.getDate() - Math.floor(Math.random() * 10));
        }

        tasks.push({
            id: `task-${i + 1}`,
            title: `Task ${i + 1}: ${['Design UI', 'Implement Feature', 'Fix Bug', 'Review PR', 'Write Documentation'][Math.floor(Math.random() * 5)]}`,
            description: `This is the description for task ${i + 1}. It contains details about what needs to be done.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            dueDate: dueDate.toISOString(),
            assignee: {
                id: `user-${Math.floor(Math.random() * 10) + 1}`,
                name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
                avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`,
            },
            tags: [
                ['Frontend', 'Backend', 'UI', 'API', 'Database'][Math.floor(Math.random() * 5)],
                ['Bug', 'Feature', 'Enhancement', 'Documentation', 'Testing'][Math.floor(Math.random() * 5)],
            ].filter((_, idx) => Math.random() > 0.3),
            createdAt: createdAt.toISOString(),
            estimatedHours,
            completedAt: completedDate?.toISOString() || null,
            comments: Array(Math.floor(Math.random() * 5)).fill(0).map((_, i) => ({
                id: `comment-${i}`,
                author: {
                    id: `user-${Math.floor(Math.random() * 10) + 1}`,
                    name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
                    avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`,
                },
                content: `Comment ${i + 1} on this task. Providing feedback or updates.`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            })),
        });
    }

    return tasks;
}

function generateAdditionalTasks(startIndex: number, count: number): Task[] {
    const tasks: Task[] = [];
    const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'completed'];
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

    // Generate additional tasks starting from the given index
    for (let i = 0; i < count; i++) {
        const index = startIndex + i;
        if (index >= 200) break; // Total dummy tasks limit

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));

        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));

        const estimatedHours = Math.floor(Math.random() * 40) + 1;

        const completedDate = Math.random() > 0.5 ? new Date() : null;
        if (completedDate) {
            completedDate.setDate(completedDate.getDate() - Math.floor(Math.random() * 10));
        }

        tasks.push({
            id: `task-${index + 1}`,
            title: `Task ${index + 1}: ${['Design UI', 'Implement Feature', 'Fix Bug', 'Review PR', 'Write Documentation'][Math.floor(Math.random() * 5)]}`,
            description: `This is the description for task ${index + 1}. It contains details about what needs to be done.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            dueDate: dueDate.toISOString(),
            assignee: {
                id: `user-${Math.floor(Math.random() * 10) + 1}`,
                name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
                avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`,
            },
            tags: [
                ['Frontend', 'Backend', 'UI', 'API', 'Database'][Math.floor(Math.random() * 5)],
                ['Bug', 'Feature', 'Enhancement', 'Documentation', 'Testing'][Math.floor(Math.random() * 5)],
            ].filter((_, idx) => Math.random() > 0.3),
            createdAt: createdAt.toISOString(),
            estimatedHours,
            completedAt: completedDate?.toISOString() || null,
            comments: Array(Math.floor(Math.random() * 5)).fill(0).map((_, i) => ({
                id: `comment-${index}-${i}`,
                author: {
                    id: `user-${Math.floor(Math.random() * 10) + 1}`,
                    name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
                    avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`,
                },
                content: `Comment ${i + 1} on this task. Providing feedback or updates.`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            })),
        });
    }

    return tasks;
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSelectedTask: (state, action: PayloadAction<Task | null>) => {
            state.selectedTask = action.payload;
        },
        setFilterStatus: (state, action: PayloadAction<TaskStatus | 'all'>) => {
            state.filterStatus = action.payload;
            applyFiltersAndSort(state);
        },
        setFilterPriority: (state, action: PayloadAction<TaskPriority | 'all'>) => {
            state.filterPriority = action.payload;
            applyFiltersAndSort(state);
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            applyFiltersAndSort(state);
        },
        setSortField: (state, action: PayloadAction<{ field: keyof Task | null, direction: 'asc' | 'desc' }>) => {
            state.sortField = action.payload.field;
            state.sortDirection = action.payload.direction;
            applyFiltersAndSort(state);
        },
        setView: (state, action: PayloadAction<'table' | 'kanban'>) => {
            state.view = action.payload;
        },
        clearFilters: (state) => {
            state.filterStatus = 'all';
            state.filterPriority = 'all';
            state.searchQuery = '';
            state.sortField = null;
            state.sortDirection = 'asc';
            state.filteredItems = state.items;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.tasks;
                state.totalCount = action.payload.totalCount;
                state.isInitialized = true; // Mark as initialized
                applyFiltersAndSort(state);
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(loadMoreTasks.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMoreTasks.fulfilled, (state, action) => {
                state.loadingMore = false;
                // Append new tasks to the existing ones
                state.items = [...state.items, ...action.payload.tasks];
                applyFiltersAndSort(state);
            })
            .addCase(loadMoreTasks.rejected, (state, action) => {
                state.loadingMore = false;
                state.error = action.error.message || 'Failed to load more tasks';
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { taskId, comment } = action.payload;
                const task = state.items.find(task => task.id === taskId);
                if (task) {
                    task.comments.push(comment);
                }
                if (state.selectedTask?.id === taskId) {
                    state.selectedTask.comments.push(comment);
                }
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const { taskId, status } = action.payload;

                // Update in the main items array
                const task = state.items.find(task => task.id === taskId);
                if (task) {
                    task.status = status;
                    if (status === 'completed' && !task.completedAt) {
                        task.completedAt = new Date().toISOString();
                    } else if (status !== 'completed') {
                        task.completedAt = null;
                    }
                }

                // Update in the selected task if it's the same task
                if (state.selectedTask?.id === taskId) {
                    state.selectedTask.status = status;
                    if (status === 'completed' && !state.selectedTask.completedAt) {
                        state.selectedTask.completedAt = new Date().toISOString();
                    } else if (status !== 'completed') {
                        state.selectedTask.completedAt = null;
                    }
                }

                applyFiltersAndSort(state);
            })
            .addCase(createTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                // Re-apply filters and sorting
                applyFiltersAndSort(state);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create task';
            })
    },
});

function applyFiltersAndSort(state: TasksState) {
    let filtered = [...state.items];

    // Apply status filter
    if (state.filterStatus !== 'all') {
        filtered = filtered.filter(task => task.status === state.filterStatus);
    }

    // Apply priority filter
    if (state.filterPriority !== 'all') {
        filtered = filtered.filter(task => task.priority === state.filterPriority);
    }

    // Apply search query
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.name.toLowerCase().includes(query) ||
            task.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Apply sorting
    if (state.sortField) {
        filtered.sort((a, b) => {
            const aValue = a[state.sortField as keyof Task];
            const bValue = b[state.sortField as keyof Task];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return state.sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue instanceof Date && bValue instanceof Date) {
                return state.sortDirection === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            return 0;
        });
    }

    state.filteredItems = filtered;
}

export const {
    setSelectedTask,
    setFilterStatus,
    setFilterPriority,
    setSearchQuery,
    setSortField,
    setView,
    clearFilters
} = tasksSlice.actions;

export default tasksSlice.reducer;