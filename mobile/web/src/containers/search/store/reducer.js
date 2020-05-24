
import { createSlice, createAction } from '@reduxjs/toolkit';

export const GET_JOBS_ACTION = "GET_JOBS_ACTION"
export const getJobsAction = createAction(GET_JOBS_ACTION)

const initialState = {
    'jobs/get': {
        loading: false,
        error: false,
        response: null,
        errorMsg: null
    },
    'jobs/insert': [],
    'jobs/client': ""
}

const mapResponseToState = (
    stateKey,
    state,
    action,
) => {
    state[stateKey].loading = action.payload.loading;
    state[stateKey].error = action.payload.error;
    state[stateKey].errorMsg = action.payload.errorMsg;
    state[stateKey].response = action.payload.response;
};

const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        storeClientAction: (state, action) => {
            state['jobs/client'] = action.payload.client
        },
        searchReducerAction: (state, action) =>
            mapResponseToState('jobs/get', state, action),
        searchJobInsertAction: (state, action) => {
            if (action.payload.hasOwnProperty('jobs') && action.payload.jobs.length > 0) {
                const { jobs } = action.payload
                state['jobs/insert'] = state['jobs/insert'].concat(jobs)
            }
        }
    },
});


const { actions, reducer } = searchSlice
const { searchReducerAction, searchJobInsertAction, storeClientAction } = actions

export { searchReducerAction, searchJobInsertAction, storeClientAction }
export default reducer