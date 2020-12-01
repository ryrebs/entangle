import { createAction } from "@reduxjs/toolkit";
import { call, put, all, takeLatest } from "redux-saga/effects";
import { ApiService } from "../../../service/api";
import {
  getTargetsReducerAction,
  getTargetsStartedReducerAction,
} from "./reducer";
import { refreshTokenAuthReducerAction } from "../../../store/auth/auth.reducer";
import {
  checkTokenExpiration,
  retry,
} from "../../../store/request/request.saga";

const DELAY_BEFORE_RETRY = 5000;
const TARGET_ROUTE = "/location/fetch";
const TRACKER_ROUTE = "/location/update";
const REFRESH_ROUTE = "/auth/refresh";
const START_FETCH_TARGETS = "START_FETCH_TARGETS";
const UPDATE_TRACKER_COORDS = "UPDATE_TRACKER_COORDS";
const REFRESH_TOKEN = "REFRESH_TOKEN";

export const startFetchTargetUpdates = createAction(START_FETCH_TARGETS);
export const updateTrackerCoordsAction: (action: any) => any = createAction(
  UPDATE_TRACKER_COORDS
);
export const refreshTokenAction: (action: any) => any = createAction(
  REFRESH_TOKEN
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
    yield call(checkTokenExpiration, response);
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

function* refreshToken() {
  yield takeLatest(REFRESH_TOKEN, function* (action: any) {
    try {
      const token = action.payload;
      const res = yield call(ApiService.getApi().post, REFRESH_ROUTE, {
        token,
      });
      const { response } = res;
      yield put(
        refreshTokenAuthReducerAction({
          response,
          loading: false,
          error: false,
          errorMsg: null,
        })
      );
      // Fetch targets after token refresh
      yield put(startFetchTargetUpdates());
    } catch (error) {
      const { response } = error;
      yield put(
        getTargetsReducerAction({
          loading: false,
          response,
          error: true,
          errorMsg: error.message || "",
        })
      );
    }
  });
}

export default function* () {
  yield all([call(getTargets), call(updateTrackerCoords), call(refreshToken)]);
}
