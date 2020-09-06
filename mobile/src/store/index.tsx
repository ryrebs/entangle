import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createRootReducer from "./root.reducer";
import rootSaga from "./root.saga";
import { persistStore, persistReducer } from "redux-persist";
import createSecureStore from "redux-persist-expo-securestore";

const storage = createSecureStore();

const persistConfig = {
  key: "app", // Change with your correct reducer key
  storage,
  // whitelist/blacklist list of reducer Array<string> where string is the key
  whitelist: ["tracker", "auth"],
};

const persistedRootReducer = persistReducer(persistConfig, createRootReducer());

let store: any;
let persistor: any;

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  // eslint-disable-next-line no-undef
  const middlewares = [sagaMiddleware];
  store = createStore(
    persistedRootReducer,
    // composeWithDevTools(applyMiddleware(...middlewares)),
    applyMiddleware(...middlewares)
  );
  persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);
};

export { store, persistor };
