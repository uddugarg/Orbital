import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasksSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;