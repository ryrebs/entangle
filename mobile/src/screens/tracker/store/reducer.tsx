import { createSelector } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface targetState {
    tracker: any
}

/** Creating selectors */
const targetResponseSelector = createSelector(
    (state: targetState) => state.tracker,
    tracker => tracker['tracker/getTargets'].response
);


const trackerIDSelector = createSelector(
    (state: targetState) => state.tracker,
    tracker => tracker['tracker/id'].id
);

 // TODO: decode request token containing id
const getIDFromTokenClaims = (token: string): string => { return ""}

const initialState = {
    'tracker/id': {
        id: "1234567",
    },
    'tracker/token': {
        token: null,
        loading: false,
        error: false,
        errorMsg: '',
    },
    'tracker/getTargets': {
        loading: false,
        error: false,
        response: null,
        errorMsg: '',
    },
    'tracker/coords': { location: null }
};

const trackerSlice = createSlice({
    name: 'trackerSlice',
    initialState,
    reducers: {
        registerReducerAction: (state, action) => {
            const stateKeyToken = "tracker/token"
            const stateKeyID = "tracker/id"
            const { data } = action.payload.response
            state[stateKeyToken].token = data
            state[stateKeyToken].loading = action.payload.loading;
            state[stateKeyToken].error = action.payload.error;
            state[stateKeyToken].errorMsg = action.payload.errorMsg;
            state[stateKeyID].id = getIDFromTokenClaims(data)
        },
        getTargetsReducerAction: (state, action) => {
            const stateKey = "tracker/getTargets"
            state[stateKey].loading = action.payload.loading;
            state[stateKey].error = action.payload.error;
            state[stateKey].errorMsg = action.payload.errorMsg;
            state[stateKey].response = action.payload.response;
        },
        updateCoordsReducerAction: (state, action) => {
            const stateKey = 'tracker/coords'
            state[stateKey].location = { ...action.payload.location }
        },
    }
})

const { actions, reducer } = trackerSlice;

const { getTargetsReducerAction, updateCoordsReducerAction, registerReducerAction } = actions;

export { trackerIDSelector, targetResponseSelector, getTargetsReducerAction, updateCoordsReducerAction, registerReducerAction }

export default reducer