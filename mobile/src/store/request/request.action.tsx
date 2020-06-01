export const REQUEST_ACTION = 'REQUEST';

export const SEARCH_REQUEST_ACTION = 'SEARCH_REQUEST';

export const REQUEST_QUEUED_ACTION = 'REQUEST_QUEUE';

export const uploadImageRequestAction = (
  payload,
  apiMethod,
  uploadRoute,
  reducer,
) => {
  return {
    type: 'REQUEST',
    method: apiMethod,
    route: uploadRoute,
    resultReducerAction: reducer, // can be reducer or action reducer
    payload, // TODO: needs testing, if payload is correct.
  };
};

export const searchRequestAction = (apiMethod, apiRoute, reducer) => {
  return {
    type: 'SEARCH_REQUEST',
    method: apiMethod,
    route: apiRoute,
    resultReducerAction: reducer,
  };
};
