import * as service from '../services/service';
import { setLoading, setEvents, setError } from './eventsSlice';

export const fetchAllEvents = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await service.fetchEvents();
        dispatch(setEvents(data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};
