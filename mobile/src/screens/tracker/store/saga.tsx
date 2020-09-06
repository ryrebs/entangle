import { createAction } from "@reduxjs/toolkit";
import {
  take,
  delay,
  call,
  put,
  all,
  fork,
  cancel,
  takeEvery,
} from "redux-saga/effects";
import { ApiService } from "../../../service/api";
import {
  getTargetsReducerAction,
  getTargetsStartedReducerAction,
} from "./reducer";

const DELAY = 20000;
const TARGET_ROUTE = "/location/fetch";
const START_FETCH_TARGETS = "START_FETCH_TARGETS";
const STOP_FETCH_TARGETS = "CANCEL_FETCH_TARGETS";
const UPDATE_TRACKER_COORDS = "UPDATE_TRACKER_COORDS";
const STOP_UPDATE_TRACKER_COORDS = "STOP_UPDATE_TRACKER_COORDS";

export const startUpdates = createAction(START_FETCH_TARGETS);
export const stopUpdates = createAction(STOP_FETCH_TARGETS);
export const updateTrackerCoordsAction = createAction(UPDATE_TRACKER_COORDS);
export const stopUpdateTrackerCoords = createAction(STOP_UPDATE_TRACKER_COORDS);

function* getTargetsTask() {
  while (true) {
    try {
      yield put(getTargetsStartedReducerAction());
      const res = yield call(ApiService.getApi().get, TARGET_ROUTE);
      const { response } = res;
      yield put(
        getTargetsReducerAction({
          response,
          loading: false,
          error: false,
          errorMsg: null,
        })
      );
    } catch (error) {
      const { response } = error;
      let res;
      if (response) res = response;
      else res = null;
      yield put(
        getTargetsReducerAction({
          loading: false,
          response: null,
          error: true,
          errorMsg: error.message || "",
        })
      );
    }
    yield delay(DELAY);
  }
}

function* getTargets() {
  yield take(START_FETCH_TARGETS);
  const task = yield fork(getTargetsTask);
  yield take(STOP_FETCH_TARGETS);
  yield cancel(task);
}

// TODO: Implement: Connect to api
function* updateTrackerCoords() {
  while (true) {
    const action = yield take(UPDATE_TRACKER_COORDS);
    console.log("::ACTION::", action);
  }
}
export default function* () {
  yield all([call(getTargets), call(updateTrackerCoords)]);
}
