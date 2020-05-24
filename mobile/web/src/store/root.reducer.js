import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import searchReducer from '../containers/search/store/reducer';

export default (history) => {
  const reducers = {
    search: searchReducer,
    router: connectRouter(history),
  };
  return combineReducers(reducers);
};
