import { createAction } from "@reduxjs/toolkit";
import { take, put, takeLeading } from "redux-saga/effects";
import { updateAuthReducerAction } from "./auth.reducer";

const UPDATE_AUTH_ACTION = "auth/update";
export const updateAuthAction = createAction(UPDATE_AUTH_ACTION);

function* updateAuth(action: any) {
  const { payload } = action;
  yield put(updateAuthReducerAction({ ...payload }));
}

function* root() {
  yield takeLeading(UPDATE_AUTH_ACTION, updateAuth);
}

export default root;
