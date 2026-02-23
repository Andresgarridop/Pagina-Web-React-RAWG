import { createSlice } from '@reduxjs/toolkit';

const loadFavorites = () => {
    try {
        const serialized = localStorage.getItem('favorites');
        return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
        return [];
    }
};

export const gamesSlice = createSlice({
    name: 'games',
    initialState: {
        list: [],
        count: 0,
        popular: [],
        metacritic: [],
        details: null,
        genres: [],
        platforms: [],
        isLoading: false,
        error: null,
        favorites: loadFavorites(),
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setGamesList: (state, action) => {
            state.list = action.payload.results;
            state.count = action.payload.count;
            state.isLoading = false;
        },
        setPopularGames: (state, action) => {
            state.popular = action.payload;
            state.isLoading = false;
        },
        setMetacriticGames: (state, action) => {
            state.metacritic = action.payload;
            state.isLoading = false;
        },
        setGameDetails: (state, action) => {
            state.details = action.payload;
            state.isLoading = false;
        },
        setGenres: (state, action) => {
            state.genres = action.payload;
        },
        setPlatforms: (state, action) => {
            state.platforms = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        toggleFavorite: (state, action) => {
            const game = action.payload;
            const index = state.favorites.findIndex((f) => f.id === game.id);
            if (index >= 0) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(game);
            }
            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },
    },
});

export const {
    setLoading,
    setGamesList,
    setPopularGames,
    setMetacriticGames,
    setGameDetails,
    setGenres,
    setPlatforms,
    setError,
    toggleFavorite,
} = gamesSlice.actions;
