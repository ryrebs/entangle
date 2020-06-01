import { combineReducers } from 'redux';
import trackerReducer from '../screens/tracker/store/reducer'
export default () => {
  const reducers = {
    'tracker': trackerReducer
  };
  return combineReducers(reducers);
};
