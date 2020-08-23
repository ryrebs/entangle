import { combineReducers } from "redux";
import trackerReducer from "../screens/tracker/store/reducer";
import { reducer as authReducer } from "./auth/auth.reducer";

export default () => {
  const reducers = {
    tracker: trackerReducer,
    auth: authReducer,
  };
  return combineReducers(reducers);
};
