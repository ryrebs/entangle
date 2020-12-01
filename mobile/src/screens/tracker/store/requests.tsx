import { ApiService } from "../../../service/api";
import { logoutAuthReducerAction } from "../../../store/auth/auth.reducer";
import { trackUntrackTargetsReducerAction } from "./reducer";

export const logoutRequestAction = () => ({
  type: "REQUEST",
  method: ApiService.getApi().delete,
  route: "/location/deletetracker",
  resultReducerAction: logoutAuthReducerAction,
  payload: {},
});

export const trackTargetsRequestAction = (payload: Object) => ({
  type: "REQUEST",
  method: ApiService.getApi().post,
  route: "/location/addtarget",
  resultReducerAction: trackUntrackTargetsReducerAction,
  payload,
});

export const unTrackTargetsRequestAction = (payload: Object) => ({
  type: "REQUEST",
  method: ApiService.getApi().post,
  route: "location/deletetarget",
  resultReducerAction: trackUntrackTargetsReducerAction,
  payload,
});
