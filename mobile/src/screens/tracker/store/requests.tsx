import { ApiService } from "../../../service/api";
import { logoutAuthReducerAction } from "../../../store/auth/auth.reducer";

export const logoutRequestAction = () => ({
  type: "REQUEST",
  method: ApiService.getApi().delete,
  route: "/location/deletetracker",
  resultReducerAction: logoutAuthReducerAction,
  payload: {},
})