import { ApiService } from "../../service/api";
import { updateAuthReducerAction } from "./auth.reducer";

export const requestRegisterAction = (token: string, name: string) => ({
    type: "REQUEST",
    method: ApiService.getApi().post,
    route: "/auth",
    resultReducerAction: updateAuthReducerAction,
    payload: {
      token,
      name
    },
  });
  