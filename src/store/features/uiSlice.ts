import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    sidebarOpen: boolean;
    taskDrawerOpen: boolean;
    darkMode: boolean;
    tableColumns: string[];
}

const initialState: UiState = {
    sidebarOpen: true,
    taskDrawerOpen: false,
    darkMode: true,
    tableColumns: ['title', 'status', 'priority', 'assignee', 'dueDate', 'estimatedHours', 'actions']
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
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
        updateTableColumns: (state, action: PayloadAction<string[]>) => {
            state.tableColumns = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    toggleTaskDrawer,
    setTaskDrawer,
    toggleDarkMode,
    updateTableColumns,
} = uiSlice.actions;

export default uiSlice.reducer;