import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, differenceInDays } from "date-fns";
import { Task, TaskPriority, TaskStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, formatStr: string = "MMM d, yyyy") {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    return "Invalid date";
  }
}

export function getStatusColor(status: TaskStatus) {
  switch (status) {
    case "todo":
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "high":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "urgent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export function getDueDateStatus(dueDateStr: string) {
  const dueDate = parseISO(dueDateStr);
  const today = new Date();
  const daysLeft = differenceInDays(dueDate, today);

  if (daysLeft < 0) {
    return {
      color: "text-red-500 dark:text-red-400",
      label: "Overdue",
    };
  }

  if (daysLeft === 0) {
    return {
      color: "text-orange-500 dark:text-orange-400",
      label: "Due today",
    };
  }

  if (daysLeft <= 3) {
    return {
      color: "text-yellow-500 dark:text-yellow-400",
      label: `Due in ${daysLeft} days`,
    };
  }

  return {
    color: "text-green-500 dark:text-green-400",
    label: `Due in ${daysLeft} days`,
  };
}

export function getEstimatedHoursCategory(hours: number) {
  if (hours < 4) return "Short";
  if (hours < 8) return "Medium";
  if (hours < 16) return "Long";
  return "Extended";
}

export function groupTasksByStatus(tasks: Task[]) {
  const grouped: Record<TaskStatus, Task[]> = {
    'todo': [],
    'in-progress': [],
    'review': [],
    'completed': []
  };

  tasks.forEach(task => {
    grouped[task.status].push(task);
  });

  return grouped;
}

export function groupTasksByDueDate(tasks: Task[]) {
  const result: Record<string, number> = {};

  tasks.forEach(task => {
    const date = formatDate(task.dueDate, "yyyy-MM-dd");
    if (result[date]) {
      result[date]++;
    } else {
      result[date] = 1;
    }
  });

  return result;
}

export function groupTasksByCompletionDate(tasks: Task[]) {
  const result: Record<string, number> = {};

  tasks
    .filter(task => task.completedAt)
    .forEach(task => {
      const date = formatDate(task.completedAt!, "yyyy-MM-dd");
      if (result[date]) {
        result[date]++;
      } else {
        result[date] = 1;
      }
    });

  return result;
}

export function groupTasksByEstimatedHours(tasks: Task[]) {
  const categories = {
    'Short (0-4h)': 0,
    'Medium (4-8h)': 0,
    'Long (8-16h)': 0,
    'Extended (16h+)': 0
  };

  tasks.forEach(task => {
    const hours = task.estimatedHours;

    if (hours < 4) {
      categories['Short (0-4h)']++;
    } else if (hours < 8) {
      categories['Medium (4-8h)']++;
    } else if (hours < 16) {
      categories['Long (8-16h)']++;
    } else {
      categories['Extended (16h+)']++;
    }
  });

  return categories;
}

export function generateRandomColorClass() {
  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// Mock API functions for server operations
export async function fetchTasksApi(page: number, perPage: number) {
  // This would be an actual API call in a real app
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        tasks: Array(perPage).fill(0).map((_, i) => ({
          id: `task-${(page - 1) * perPage + i + 1}`,
          title: `Task ${(page - 1) * perPage + i + 1}`,
          // ... other fields
        })),
        total: 100
      });
    }, 500);
  });
}

export function renderCellValue(task: Task, key: keyof Task): React.ReactNode {
  const value = task[key];

  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'object') {
    if (key === 'assignee' && 'name' in value) {
      return value.name as string;
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return JSON.stringify(value);
  }

  // Return primitive values directly
  return value as React.ReactNode;
}