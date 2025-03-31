# Orbital - High Level Design (HLD)

## 1. System Overview

Orbital is a modern task management application built with Next.js, offering a comprehensive solution for organizing and tracking tasks, projects, and workflow analytics. The application aims to provide a seamless user experience with a focus on both functionality and aesthetics.

<div align="center">
  <img src="hld-diagram.svg" alt="High Level Architecture Diagram" width="100%" />
  <p><i>Figure 1: Orbital Task Management Application - High Level Architecture</i></p>
</div>

## 2. Architecture

### 2.1 Front-End Architecture

The application follows a component-based architecture built upon the React ecosystem, with the following key characteristics:

#### Client-Side Rendering with Next.js

- Uses Next.js 14 with the App Router for optimized client-side rendering
- Implements server components where appropriate for improved performance
- Features route-based code splitting for optimized bundle sizes

#### State Management

- **Global State**: Redux Toolkit for app-wide state management
  - Tasks data
  - UI preferences (theme, layout options)
  - Filter/sort options
- **Local State**: React hooks for component-specific state
- **Form State**: React Hook Form for form handling

#### Data Flow

```
User Interaction → Action Dispatched → Redux Middleware → State Update → UI Update
```

### 2.2 Component Architecture

The application follows a hierarchical component structure:

```
Layout (Root)
├── Sidebar
├── Navbar
│   ├── SearchBar (Global Search)
│   ├── ThemeToggle
│   └── AddTaskButton
└── Main Content
    ├── Dashboard Page
    │   ├── Statistics Cards
    │   ├── Charts (Recharts)
    │   └── Task Reminders
    └── Tasks Page
        ├── Filter/Sort Controls
        ├── View Toggle (Table/Kanban)
        ├── TasksTable (with infinite scroll)
        ├── TasksKanban
        └── TaskDetailDrawer
```

## 3. Key Subsystems

### 3.1 Task Management System

**Core Entities:**

- **Task**: The primary data model representing work items
- **Status**: Tracks a task's current state (todo, in-progress, review, completed)
- **Priority**: Indicates task importance (low, medium, high, urgent)
- **Assignee**: User responsible for the task
- **Comments**: Discussions related to tasks

**Features:**

- Task creation, viewing, editing, deletion
- Status transitions with visual indicators
- Priority management with color-coding
- Due date tracking with reminders
- Comment system for collaboration
- Tagging and categorization

### 3.2 Data Visualization System

**Components:**

- **Dashboard Cards**: Key metrics for quick insights
- **Line Charts**: Task completion and due date trends
- **Pie Charts**: Task distribution by various metrics
- **Kanban Board**: Visual workflow representation

**Key Metrics:**

- Completion rates
- Upcoming deadlines
- Estimation accuracy
- Task distribution

### 3.3 User Interface System

**Design System:**

- Built on shadcn/ui components
- Consistent spacing, typography, and color schemes
- Responsive design for all screen sizes
- Dark/light theme support
- Accessibility compliance

**Interactive Elements:**

- Drag and drop for task reordering and status updates
- Infinite scroll for efficient data loading
- Search with keyboard shortcuts (⌘+K)
- Custom scrollable containers

## 4. Data Models

### 4.1 Task Model

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus; // 'todo' | 'in-progress' | 'review' | 'completed'
  priority: TaskPriority; // 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string; // ISO date string
  assignee: User;
  tags: string[];
  createdAt: string; // ISO date string
  estimatedHours: number;
  completedAt: string | null; // ISO date string
  comments: Comment[];
}

interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string; // ISO date string
}

interface User {
  id: string;
  name: string;
  avatar: string;
}
```

### 4.2 Redux Store Structure

```typescript
interface RootState {
  tasks: TasksState;
  ui: UIState;
}

interface TasksState {
  items: Task[];
  filteredItems: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  filterStatus: TaskStatus | "all";
  filterPriority: TaskPriority | "all";
  sortField: keyof Task | null;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  view: "table" | "kanban";
}

interface UIState {
  sidebarOpen: boolean;
  taskDrawerOpen: boolean;
  darkMode: boolean;
  tableColumns: string[];
}
```

## 5. Technical Implementation

### 5.1 Infinite Scrolling

The TasksTable component implements efficient infinite scrolling with the following approach:

1. **Mounting**: Initially displays the first 10 items
2. **Scroll Detection**: Monitors scroll position via scroll event listeners
3. **Threshold Detection**: Triggers data loading when approaching bottom of container
4. **Incremental Loading**: Adds 10 more items at a time to the visible set
5. **Loading State**: Displays loading indicator during data fetch
6. **Optimization**: Maintains only necessary re-renders through careful dependency management

```typescript
// Simplified Pseudocode
useEffect(() => {
  const handleScroll = () => {
    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      !loading &&
      hasMoreItems
    ) {
      loadMoreItems();
    }
  };

  containerRef.current.addEventListener("scroll", handleScroll);
  return () => containerRef.current.removeEventListener("scroll", handleScroll);
}, [loading, hasMoreItems]);
```

### 5.2 Drag and Drop

Implemented using React DnD with the following components:

1. **Kanban Board**: Allows dragging tasks between status columns
2. **Table Columns**: Supports reordering columns via drag and drop
3. **DragSources**: Task cards and column headers act as drag sources
4. **DropTargets**: Status columns and column positions act as drop targets
5. **State Updates**: Trigger Redux actions on successful drop events

### 5.3 Sorting and Filtering

Implemented in Redux with the following approach:

1. **Filter Actions**: Dispatch actions to update filter criteria in state
2. **Filter Application**: Apply filters to the complete items list to create filteredItems
3. **Memoization**: Use selector memoization to prevent unnecessary recalculations
4. **Composable Filters**: Chain multiple filter conditions (status, priority, search)
5. **Sorting Logic**: Sort results based on user-selected field and direction

## 6. Performance Considerations

### 6.1 Optimizations

1. **Virtual Scrolling**: Only render visible items in the viewport
2. **Memoization**: Use React.memo and useMemo to prevent unnecessary re-renders
3. **Code Splitting**: Route-based and component-based splitting
4. **Lazy Loading**: Defer loading of non-critical components
5. **Debouncing**: Implement for search queries and scroll handlers
6. **Image Optimization**: Next.js Image component for optimized images

### 6.2 Rendering Strategy

1. **Initial Load**: Server-side rendering for first meaningful paint
2. **Data Fetching**: Client-side data fetching with loading states
3. **State Updates**: Optimized Redux updates to minimize re-renders
4. **Transition Animations**: CSS transitions for smooth UI changes

## 7. Testing Strategy

### 7.1 Testing Levels

1. **Unit Tests**: Testing individual components and functions

   - Redux store and reducers
   - UI components
   - Utility functions
   - Custom hooks

2. **Integration Tests**: Testing component interactions

   - Page-level integration
   - Feature flows (search → task detail)
   - State management integration

3. **End-to-End Tests**: Testing complete user journeys
   - Task creation to completion
   - Dashboard analytics accuracy
   - Filter and sort operations

### 7.2 Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **Mock Service Worker**: API mocking
- **jest-dom**: DOM testing utilities
- **Coverage Reports**: Track test coverage metrics

## 8. Future Enhancements

1. **Authentication System**: User accounts, roles, and permissions
2. **Real-time Updates**: WebSocket integration for live updates
3. **Offline Support**: Service workers for offline functionality
4. **File Attachments**: Document upload and preview
5. **Advanced Analytics**: Custom reporting and dashboard widgets
6. **Team Collaboration**: Sharing and assignment features
7. **Integrations**: Calendar, email, and third-party services
8. **Mobile Application**: Native mobile apps using React Native

## 9. Security Considerations

1. **API Authentication**: Token-based authentication
2. **Data Validation**: Client and server-side validation
3. **CSRF Protection**: Implementation of anti-CSRF tokens
4. **Content Security Policy**: Strict CSP implementation
5. **Secure Storage**: Secure handling of sensitive information
6. **Rate Limiting**: Prevention of brute force attacks

---

<div align="center">
  <p>Document Version: 1.0 | Last Updated: March 31, 2025</p>
</div>
