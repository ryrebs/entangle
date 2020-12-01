import { createAction } from "@reduxjs/toolkit";
import { call, put, all, retry, takeLatest } from "redux-saga/effects";
import { ApiService } from "../../../service/api";
import {
  getTargetsReducerAction,
  getTargetsStartedReducerAction,
} from "./reducer";

const DELAY_BEFORE_RETRY = 5000;
const TARGET_ROUTE = "/location/fetch";
const TRACKER_ROUTE = "/location/update";
const START_FETCH_TARGETS = "START_FETCH_TARGETS";
const UPDATE_TRACKER_COORDS = "UPDATE_TRACKER_COORDS";

export const startFetchTargetUpdates = createAction(START_FETCH_TARGETS);
export const updateTrackerCoordsAction: (action: any) => any = createAction(
  UPDATE_TRACKER_COORDS
);

function* getTargetsHandler() {
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
    let res = null;
    if (response) res = response;
    yield put(
      getTargetsReducerAction({
        loading: false,
        response: null,
        error: true,
        errorMsg: error.message || "",
      })
    );
  }
}

/** Get targets once */
function* getTargets() {
  yield takeLatest(START_FETCH_TARGETS, getTargetsHandler);
}

function* updateTrackerCoordsHandler(action: any) {
  const { coords } = action.payload;
  const method = ApiService.getApi().post;
  const count = 2;
  if (coords !== null) {
    const { latitude, longitude } = coords;
    const pyl = {
      lat: latitude,
      lng: longitude,
    };
    yield retry(count, DELAY_BEFORE_RETRY, method, TRACKER_ROUTE, pyl);
  }
}

/** Updates the location of the user/tracker on database */
function* updateTrackerCoords() {
  yield takeLatest(UPDATE_TRACKER_COORDS, updateTrackerCoordsHandler);
}
export default function* () {
  yield all([call(getTargets), call(updateTrackerCoords)]);
}
