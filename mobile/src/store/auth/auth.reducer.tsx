import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const authSelector = createSelector(
  (state: any) => state.auth,
  (auth) => ({
    authenticated: auth["auth/authenticated"],
    token: auth["auth/token"],
    id: auth["auth/id"],
  })
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    "auth/authenticated": false,
    "auth/token": null,
    "auth/id": null,
  },
  reducers: {
    updateAuthReducerAction: (state, action) => {
      state["auth/authenticated"] = action.payload.isAuthenticated;
      state["auth/token"] = action.payload.token;
      state["auth/id"] = action.payload.id;
    },
  },
});

const { actions, reducer } = authSlice;
const { updateAuthReducerAction } = actions;

export { updateAuthReducerAction, reducer, authSelector };
