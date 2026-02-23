import { configureStore } from '@reduxjs/toolkit';
import { gamesSlice } from './slices/gamesSlice';
import { eventsSlice } from './slices/eventsSlice';

export const store = configureStore({
    reducer: {
        games: gamesSlice.reducer,
        events: eventsSlice.reducer,
    },
});
