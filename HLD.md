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
  - UI preferences (theme, layout options, column settings)
  - Filter/sort options
- **Local State**: React hooks for component-specific state
- **Form State**: React Hook Form for form handling
- **Persistence**: LocalStorage for user preferences and column settings

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
│   ├── SettingsDialog
│   │   └── ColumnSettings
│   └── AddTaskButton
└── Main Content
    ├── Dashboard Page
    │   ├── DashboardFilters
    │   ├── Statistics Cards
    │   ├── Charts (Recharts)
    │   └── Task Reminders
    └── Tasks Page
        ├── Filter/Sort Controls
        ├── View Toggle (Table/Kanban)
        ├── TasksTable (with virtualization)
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

**Dashboard Filtering:**

- Synchronized filters between dashboard and tasks view
- Filter controls affecting all charts simultaneously
- Filter state maintained in Redux

### 3.3 User Interface System

**Design System:**

- Built on shadcn/ui components
- Consistent spacing, typography, and color schemes
- Responsive design for all screen sizes
- Dark/light theme support
- Accessibility compliance

**Interactive Elements:**

- Drag and drop for task reordering and status updates
- Virtualized scrolling for efficient data rendering
- Search with keyboard shortcuts (⌘+K)
- Custom scrollable containers
- Column management via Settings panel

### 3.4 Column Management System

**Features:**

- Show/hide individual columns
- Reorder columns via drag-and-drop
- Persist settings in localStorage
- Reset to default configuration

**Implementation:**

- Redux state for managing column visibility and order
- DnD integration for reordering
- Settings dialog with dedicated column management UI
- Automatic state persistence between sessions

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
  loadingMore: boolean;
  error: string | null;
  totalCount: number;
  filterStatus: TaskStatus | "all";
  filterPriority: TaskPriority | "all";
  sortField: keyof Task | null;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  view: "table" | "kanban";
  isInitialized: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  taskDrawerOpen: boolean;
  darkMode: boolean;
  tableColumns: string[];
  columnSettings: ColumnVisibility[];
}

interface ColumnVisibility {
  key: string;
  visible: boolean;
  order: number;
}
```

## 5. Technical Implementation

### 5.1 Table Virtualization

The TasksTable component implements virtualization for optimal performance with large datasets:

1. **Implementation**: Uses `react-window` and `react-window-infinite-loader` libraries
2. **Benefits**:
   - Only renders visible rows, reducing DOM nodes
   - Maintains consistent performance with any data size
   - Smooth scrolling experience
   - Reduced memory usage

```typescript
// Simplified implementation
<InfiniteLoader
  isItemLoaded={(index) => index < items.length}
  itemCount={hasMore ? items.length + 1 : items.length}
  loadMoreItems={loadMoreItems}
>
  {({ onItemsRendered, ref }) => (
    <List
      height={height}
      width="100%"
      itemCount={itemCount}
      itemSize={rowHeight}
      onItemsRendered={onItemsRendered}
      ref={ref}
    >
      {Row}
    </List>
  )}
</InfiniteLoader>
```

### 5.2 Column Management

The column management system allows users to customize their table view:

1. **State Management**: Redux stores column visibility and order
2. **Persistence**: LocalStorage maintains user preferences
3. **UI Implementation**: Settings dialog with drag-and-drop reordering
4. **Integration**: Dynamic table column rendering based on saved preferences

```typescript
// Column management in Redux
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateColumnVisibility: (state, action) => {
      const { key, visible } = action.payload;
      const columnIndex = state.columnSettings.findIndex(
        (col) => col.key === key
      );

      if (columnIndex >= 0) {
        state.columnSettings[columnIndex].visible = visible;

        // Regenerate tableColumns array
        state.tableColumns = state.columnSettings
          .filter((col) => col.visible)
          .sort((a, b) => a.order - b.order)
          .map((col) => col.key);

        // Save to localStorage
        localStorage.setItem(
          "columnSettings",
          JSON.stringify(state.columnSettings)
        );
      }
    },
    // Additional reducers...
  },
});
```

### 5.3 Dashboard Filtering

The dashboard implements synchronized filtering with the table view:

1. **Shared Filter State**: Redux maintains filter criteria used by both views
2. **Filter Components**: Reusable filter components in both dashboard and table
3. **Data Transformation**: Filtered data processed before rendering charts
4. **Real-time Updates**: Charts update immediately when filters change

```typescript
// Dashboard filter implementation
useEffect(() => {
  // Apply filters to chart data
  const filteredData = applyFilters(
    rawData,
    filterStatus,
    filterPriority,
    searchQuery
  );

  setChartData(transformForChart(filteredData));
}, [rawData, filterStatus, filterPriority, searchQuery]);
```

### 5.4 Drag and Drop

Implemented using React DnD for multiple features:

1. **Column Reordering**: Settings panel allows dragging to reorder columns
2. **Kanban Tasks**: Tasks can be dragged between status columns
3. **Table Columns**: Column headers can be dragged to reorder (legacy)

## 6. Performance Considerations

### 6.1 Optimizations

1. **Virtualized Rendering**: Only visible table rows are rendered
2. **Memoization**: React.memo and useMemo prevent unnecessary re-renders
3. **Selective Updates**: Redux selectors optimize component updates
4. **Code Splitting**: Route-based and component-based splitting
5. **Lazy Loading**: Incremental data loading with infinite scroll
6. **Persistence**: LocalStorage caching for user preferences

### 6.2 Rendering Strategy

1. **Initial Load**: Server-side rendering for first meaningful paint
2. **Data Fetching**: Efficient client-side data fetching with loading states
3. **Virtualization**: Windowed rendering for large data sets
4. **State Updates**: Optimized Redux updates to minimize re-renders
5. **Transition Animations**: Smooth CSS transitions for UI changes

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
9. **Advanced Filtering**: More sophisticated filter combinations
10. **Bulk Actions**: Multi-select and batch operations

## 9. Security Considerations

1. **API Authentication**: Token-based authentication
2. **Data Validation**: Client and server-side validation
3. **CSRF Protection**: Implementation of anti-CSRF tokens
4. **Content Security Policy**: Strict CSP implementation
5. **Secure Storage**: Secure handling of sensitive information
6. **Rate Limiting**: Prevention of brute force attacks

---

<div align="center">
  <p>Document Version: 1.1 | Last Updated: March 31, 2025</p>
</div>
