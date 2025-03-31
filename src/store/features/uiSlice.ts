import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ColumnVisibility {
    key: string;
    visible: boolean;
    order: number;
}

interface UiState {
    sidebarOpen: boolean;
    taskDrawerOpen: boolean;
    darkMode: boolean;
    tableColumns: string[];

    columnSettings: ColumnVisibility[];
}

const defaultColumns: ColumnVisibility[] = [
    { key: 'title', visible: true, order: 0 },
    { key: 'status', visible: true, order: 1 },
    { key: 'priority', visible: true, order: 2 },
    { key: 'assignee', visible: true, order: 3 },
    { key: 'dueDate', visible: true, order: 4 },
    { key: 'estimatedHours', visible: true, order: 5 },
    { key: 'tags', visible: false, order: 6 },
    { key: 'actions', visible: true, order: 7 }
];

const initialState: UiState = {
    sidebarOpen: true,
    taskDrawerOpen: false,
    darkMode: true,
    tableColumns: ['title', 'status', 'priority', 'assignee', 'dueDate', 'estimatedHours', 'actions'],
    columnSettings: defaultColumns
};

// Load column settings from localStorage if available
const savedColumnSettings = typeof window !== 'undefined'
    ? localStorage.getItem('columnSettings')
    : null;

if (savedColumnSettings) {
    try {
        initialState.columnSettings = JSON.parse(savedColumnSettings);
        initialState.tableColumns = initialState.columnSettings
            .filter(col => col.visible)
            .sort((a, b) => a.order - b.order)
            .map(col => col.key);
    } catch (e) {
        console.error('Failed to parse saved column settings', e);
    }
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Existing reducers
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        toggleTaskDrawer: (state) => {
            state.taskDrawerOpen = !state.taskDrawerOpen;
        },
        setTaskDrawer: (state, action: PayloadAction<boolean>) => {
            state.taskDrawerOpen = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },

        updateColumnVisibility: (state, action: PayloadAction<{ key: string, visible: boolean }>) => {
            const { key, visible } = action.payload;
            const columnIndex = state.columnSettings.findIndex(col => col.key === key);

            if (columnIndex >= 0) {
                state.columnSettings[columnIndex].visible = visible;

                state.tableColumns = state.columnSettings
                    .filter(col => col.visible)
                    .sort((a, b) => a.order - b.order)
                    .map(col => col.key);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('columnSettings', JSON.stringify(state.columnSettings));
                }
            }
        },

        updateColumnOrder: (state, action: PayloadAction<ColumnVisibility[]>) => {
            state.columnSettings = action.payload;

            state.tableColumns = state.columnSettings
                .filter(col => col.visible)
                .sort((a, b) => a.order - b.order)
                .map(col => col.key);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('columnSettings', JSON.stringify(state.columnSettings));
            }
        },

        resetColumnSettings: (state) => {
            state.columnSettings = defaultColumns;
            state.tableColumns = defaultColumns
                .filter(col => col.visible)
                .sort((a, b) => a.order - b.order)
                .map(col => col.key);

            if (typeof window !== 'undefined') {
                localStorage.setItem('columnSettings', JSON.stringify(state.columnSettings));
            }
        }
    },
});

export const {
    toggleSidebar,
    toggleTaskDrawer,
    setTaskDrawer,
    toggleDarkMode,
    updateColumnVisibility,
    updateColumnOrder,
    resetColumnSettings
} = uiSlice.actions;

export default uiSlice.reducer;