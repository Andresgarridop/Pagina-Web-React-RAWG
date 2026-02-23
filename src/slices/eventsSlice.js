import { createSlice } from '@reduxjs/toolkit';

const loadMyEvents = () => {
    try {
        const serialized = localStorage.getItem('myEvents');
        return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
        return [];
    }
};

export const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        list: [],
        myEvents: loadMyEvents(),
        isLoading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setEvents: (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        toggleEventParticipation: (state, action) => {
            const event = action.payload;
            const index = state.myEvents.findIndex((e) => e.id === event.id);
            if (index >= 0) {
                state.myEvents.splice(index, 1);
            } else {
                state.myEvents.push(event);
            }
            localStorage.setItem('myEvents', JSON.stringify(state.myEvents));
        },
    },
});

export const { setLoading, setEvents, setError, toggleEventParticipation } = eventsSlice.actions;
