import * as service from '../services/service';
import {
    setLoading,
    setGamesList,
    setPopularGames,
    setMetacriticGames,
    setGameDetails,
    setGenres,
    setPlatforms,
    setError,
} from './gamesSlice';

export const fetchPopularGames = (params) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await service.getPopularGames(params);
        dispatch(setPopularGames(data.results));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchTopMetacriticGames = (params) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await service.getTopMetacriticGames(params);
        dispatch(setMetacriticGames(data.results));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchGamesList = (params) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await service.getGamesList(params);
        dispatch(setGamesList(data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchGameDetails = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await service.getGameDetails(id);
        dispatch(setGameDetails(data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchFilterData = () => async (dispatch) => {
    try {
        const [genresData, platformsData] = await Promise.all([
            service.getGenres(),
            service.getPlatforms(),
        ]);
        dispatch(setGenres(genresData.results));
        dispatch(setPlatforms(platformsData.results));
    } catch (error) {
        console.error("Error fetching filters", error);
    }
};
