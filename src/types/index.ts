export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Comment {
    id: string;
    author: User;
    content: string;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignee: User;
    tags: string[];
    createdAt: string;
    estimatedHours: number;
    completedAt: string | null;
    comments: Comment[];
}
