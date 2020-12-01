import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { State } from "react-native-gesture-handler";

interface targetState {
  tracker: any;
  auth?: any;
}

/** Creating selectors */
const targetResponseSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => tracker["tracker/getTargets"].response
);

const trackerCoordsSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => {
    if (tracker["tracker/coords"] != null) {
      return tracker["tracker/coords"];
    }
    return null;
  }
);

const targetsCoordsSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => tracker["tracker/getTargets"].response
);

const trackUntrackTargetsSelector = createSelector(
  (state: targetState) => state.tracker,
  (tracker) => {
    return {
      error: tracker["tracker/addDeleteTargets"].error,
      loading: tracker["tracker/addDeleteTargets"].loading,
    };
  }
);

const initialState = {
  "tracker/getTargets": {
    loading: false,
    error: false,
    response: [],
    errorMsg: "",
  },
  "tracker/coords": null,
  "tracker/addDeleteTargets": {
    loading: false,
    error: false,
  },
};

const trackerSlice = createSlice({
  name: "trackerSlice",
  initialState,
  reducers: {
    trackUntrackTargetsReducerAction: (state, action) => {
      const stateKey = "tracker/addDeleteTargets";
      state[stateKey].loading = action.payload.loading;
      state[stateKey].error = action.payload.error;
    },
    getTargetsStartedReducerAction: (state) => {
      state["tracker/getTargets"].loading = true;
    },
    getTargetsReducerAction: (state, action) => {
      const stateKey = "tracker/getTargets";
      state[stateKey].loading = action.payload.loading;
      state[stateKey].error = action.payload.error;
      state[stateKey].errorMsg = action.payload.errorMsg;
      if (
        action.payload.response != null &&
        action.payload.response.hasOwnProperty("data")
      )
        state[stateKey].response = action.payload.response.data;
    },
    updateCoordsReducerAction: (state, action) => {
      const stateKey = "tracker/coords";
      state[stateKey] = { ...action.payload.coords };
    },
  },
});

const { actions, reducer } = trackerSlice;

const {
  trackUntrackTargetsReducerAction,
  getTargetsStartedReducerAction,
  getTargetsReducerAction,
  updateCoordsReducerAction,
} = actions;

export {
  getTargetsStartedReducerAction,
  targetsCoordsSelector,
  trackerCoordsSelector,
  targetResponseSelector,
  trackUntrackTargetsSelector,
  getTargetsReducerAction,
  updateCoordsReducerAction,
  trackUntrackTargetsReducerAction,
};

export default reducer;
