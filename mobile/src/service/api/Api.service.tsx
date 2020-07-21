const api = (() => {
  // eslint-disable-next-line no-underscore-dangle
  let _api;
  return {
    initialize: (apiInst) => {
      if (_api === undefined) _api = apiInst;
    },
    getApi: () => {
      if (_api !== null) return _api;
      throw Error("Initialize api first.");
    },
  };
})();

export default api;
