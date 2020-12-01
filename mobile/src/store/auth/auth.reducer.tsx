import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { setBearerToken } from "../../service/api";

const authSelector = createSelector(
  (state: any) => state.auth,
  (auth) => ({
    authenticated: auth["auth/authenticated"],
    token: auth["auth/token"],
    id: auth["auth/id"],
    name: auth["auth/name"],
    loading: auth["auth/loading"],
    error: auth["auth/error"],
    errorMsg: auth["auth/errorMsg"],
  })
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    "auth/authenticated": false,
    "auth/token": null,
    "auth/id": null,
    "auth/name": null,
    "auth/loading": false,
    "auth/error": null,
    "auth/errorMsg": null,
  },
  reducers: {
    tokenExpiredReducerAction: (state, action) => {
      state["auth/error"] = action.payload.error;
      state["auth/errorMsg"] = action.payload.errorMsg;
    },
    refreshTokenAuthReducerAction: (state, action) => {
      if (action.payload.response !== null) {
        const { data } = action.payload.response;
        if (data !== null) {
          state["auth/token"] = data;
          if (!action.payload.error && action.payload.httpStatusCode === 201)
            state["auth/authenticated"] = true;
        }
      } else state["auth/errorMsg"] = action.payload.errorMsg;

      state["auth/error"] = action.payload.error;
      state["auth/loading"] = action.payload.loading;
    },
    updateAuthReducerAction: (state, action) => {
      if (action.payload.response !== null) {
        const { data, message } = action.payload.response;
        if (data !== null) {
          const { token, id, name } = data;
          state["auth/token"] = token;
          state["auth/id"] = id;
          state["auth/name"] = name;
          state["auth/authenticated"] = true;
        }
      } else state["auth/errorMsg"] = action.payload.errorMsg;

      state["auth/error"] = action.payload.error;
      state["auth/loading"] = action.payload.loading;
    },
    logoutAuthReducerAction: (state, action) => {
      if (action.payload.response !== null && !action.payload.error) {
        state["auth/token"] = null;
        state["auth/id"] = null;
        state["auth/name"] = null;
        state["auth/error"] = null;
        state["auth/errorMsg"] = null;
        state["auth/loading"] = false;
        state["auth/authenticated"] = false;
      }
    },
  },
});

const { actions, reducer } = authSlice;
const {
  updateAuthReducerAction,
  logoutAuthReducerAction,
  refreshTokenAuthReducerAction,
  tokenExpiredReducerAction,
} = actions;

export {
  reducer,
  tokenExpiredReducerAction,
  logoutAuthReducerAction,
  updateAuthReducerAction,
  refreshTokenAuthReducerAction,
  authSelector,
};
