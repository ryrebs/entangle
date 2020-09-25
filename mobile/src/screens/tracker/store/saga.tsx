import { createAction } from "@reduxjs/toolkit";
import {
  take,
  delay,
  call,
  put,
  all,
  fork,
  cancel,
  retry,
} from "redux-saga/effects";
import { ApiService } from "../../../service/api";
import {
  getTargetsReducerAction,
  getTargetsStartedReducerAction,
} from "./reducer";

const DELAY_BEFORE_NEXT_API_REQUEST = 20000;
const DELAY_BEFORE_RETRY = 5000;
const TARGET_ROUTE = "/location/fetch";
const TRACKER_ROUTE = "/location/update";
const START_FETCH_TARGETS = "START_FETCH_TARGETS";
const STOP_FETCH_TARGETS = "CANCEL_FETCH_TARGETS";
const UPDATE_TRACKER_COORDS = "UPDATE_TRACKER_COORDS";
const STOP_UPDATE_TRACKER_COORDS = "STOP_UPDATE_TRACKER_COORDS";

export const startUpdates = createAction(START_FETCH_TARGETS);
export const stopUpdates = createAction(STOP_FETCH_TARGETS);
export const updateTrackerCoordsAction: (action: any) => any = createAction(
  UPDATE_TRACKER_COORDS
);
export const stopUpdateTrackerCoords = createAction(STOP_UPDATE_TRACKER_COORDS);

function* getTargetsHandler() {
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
    yield delay(DELAY_BEFORE_NEXT_API_REQUEST);
  }
}

function* getTargets() {
  yield take(START_FETCH_TARGETS);
  const task = yield fork(getTargetsHandler);
  yield take(STOP_FETCH_TARGETS);
  yield cancel(task);
}

function* updateTrackerCoordsHandler(action: any) {
  const { payload } = action;
  const method = ApiService.getApi().post;
  const count = 2;
  while (true) {
      yield retry(count, DELAY_BEFORE_RETRY, method, TRACKER_ROUTE, payload);
      yield delay(DELAY_BEFORE_NEXT_API_REQUEST)
  }
}

function* updateTrackerCoords() {
  const action = yield take(UPDATE_TRACKER_COORDS);
  const task = yield fork(updateTrackerCoordsHandler, action);
  yield take(STOP_UPDATE_TRACKER_COORDS);
  yield cancel(task);
}
export default function* () {
  yield all([call(getTargets), call(updateTrackerCoords)]);
}
