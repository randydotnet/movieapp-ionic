import { createSelector } from 'reselect';

import * as movie from './../actions/movie';
import { Movie } from './../models';

export interface State {
    ids: string[],
    entities: { [id: string]: Movie },
    loading: boolean,
}

export const initialState: State = {
    ids: [],
    entities: {},
    loading: false,
};

export function reducer(state = initialState, action: movie.Actions): State {
    console.log('movie_reducer', state, action);
    switch (action.type) {
        case movie.ActionTypes.LOAD: {
            return Object.assign({}, state, {
                loading: true,
            });
        }
        case movie.ActionTypes.LOAD_SUCCESS: {
            const movies = (<movie.LoadSuccessAction>action).payload;
            const newMovies = movies.filter(m => !state.entities[m.id]);

            const newMoviesIds = newMovies.map(m => m.id);
            const newMoviesEntities = newMovies.reduce((entities: { [id: string]: Movie }, movie: Movie) => {
                return Object.assign(entities, {
                    [movie.id]: movie
                })
            }, {});

            return Object.assign({}, state, {
                ids: state.ids.concat(newMoviesIds),
                entities: Object.assign({}, state.entities, newMoviesEntities),
                loading: false,
            });
        }
        case movie.ActionTypes.LOAD_FAIL: {
            return Object.assign({}, state, {
                loading: false,
            });
        }

        default:
            return state;
    }
}

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getLoading = (state: State) => state.loading;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
    return ids.map(id => entities[id]);
});

export const getCurrent = createSelector(getAll, (movies) => {
    return movies.filter(m => !m.soon);
});

export const getFuture = createSelector(getAll, (movies) => {
    return movies.filter(m => m.soon);
});