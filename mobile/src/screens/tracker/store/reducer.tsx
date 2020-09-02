import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface targetState {
  tracker: any;
}

/** Creating selectors */
const targetResponseSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => tracker["tracker/getTargets"].response
);

const trackerCoordsSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => {
    if (tracker["tracker/coords"].location != null) {
      const { coords } = tracker["tracker/coords"].location;
      return coords;
    }
    return null;
  }
);

const targetsCoordsSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => tracker["tracker/getTargets"].response
);

const registrationSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => {
    const { loading, token, error, id } = tracker["tracker/token"];
    return {
      loading,
      token,
      error,
      id,
    };
  }
);

const initialState = {
  "tracker/token": {
    token: null,
    id: null,
    loading: false,
    error: false,
    errorMsg: "",
  },
  "tracker/getTargets": {
    loading: false,
    error: false,
    response: [
      {
        latitude: 8.754795,
        longitude: 105.228689,
        name: "a1",
        lastUpdate: "1592183700",
      },
      {
        latitude: 19.311143,
        longitude: 75.325924,
        name: "a2",
        lastUpdate: "1592183700",
      },
      {
        latitude: 15.961329,
        longitude: 51.403711,
        name: "a3",
        lastUpdate: "1592183700",
      },
      {
        latitude: 1.406109,
        longitude: 39.794402,
        name: "a4",
        lastUpdate: "1592183700",
      },
      {
        latitude: 45.336702,
        longitude: -65.041175,
        name: "a5",
        lastUpdate: "1592101800",
      },
      {
        latitude: 8.754795,
        longitude: 105.228689,
        name: "a1",
        lastUpdate: "1592101800",
      },
      {
        latitude: 19.311143,
        longitude: 75.325924,
        name: "a2",
        lastUpdate: "1592101800",
      },
      {
        latitude: 15.961329,
        longitude: 51.403711,
        name: "a3",
        lastUpdate: "1592101800",
      },
      {
        latitude: 1.406109,
        longitude: 39.794402,
        name: "a4",
        lastUpdate: "1592101800",
      },
      {
        latitude: 45.336702,
        longitude: -65.041175,
        name: "a5",
        lastUpdate: "1592101800",
      },
    ],
    errorMsg: "",
  },
  "tracker/coords": { location: null },
};

const trackerSlice = createSlice({
  name: "trackerSlice",
  initialState,
  reducers: {
    registerReducerAction: (state, action) => {
      const stateKeyToken = "tracker/token";
      if (action.payload.response !== null) {
        const { data, message } = action.payload.response;
        if (data !== null) {
          const { token, id } = data;
          state[stateKeyToken].token = token;
          state[stateKeyToken].id = id;
        }
        state[stateKeyToken].errorMsg = message;
      } else {
        state[stateKeyToken].error = action.payload.error;
        state[stateKeyToken].errorMsg = action.payload.errorMsg;
      }
      state[stateKeyToken].loading = action.payload.loading;
    },
    getTargetsReducerAction: (state, action) => {
      const stateKey = "tracker/getTargets";
      state[stateKey].loading = action.payload.loading;
      state[stateKey].error = action.payload.error;
      state[stateKey].errorMsg = action.payload.errorMsg;
      if (
        action.payload.response != null &&
        action.payload.response.hasOwnProperty("data")
      ) {
        state[stateKey].response = action.payload.response.data;
      } else {
        state[stateKey].response = [];
      }
    },
    updateCoordsReducerAction: (state, action) => {
      const stateKey = "tracker/coords";
      state[stateKey].location = { ...action.payload.location };
    },
  },
});

const { actions, reducer } = trackerSlice;

const {
  getTargetsReducerAction,
  updateCoordsReducerAction,
  registerReducerAction,
} = actions;

export {
  registrationSelector,
  targetsCoordsSelector,
  trackerCoordsSelector,
  targetResponseSelector,
  getTargetsReducerAction,
  updateCoordsReducerAction,
  registerReducerAction,
};

export default reducer;
