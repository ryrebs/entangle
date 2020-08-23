import React, {
  useReducer,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { updateAuthAction } from "../store/auth/auth.saga";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../store/auth/auth.reducer";

export const AuthContext: any = createContext({});

interface authState {
  fetching: Boolean;
  isAuthenticated: Boolean;
  token: string;
  id: string;
  error: string;
}

interface authProps {
  children: any;
}

const initialState: authState = {
  fetching: true,
  isAuthenticated: false,
  token: "",
  id: "",
  error: "",
};

const authReducer = (state: authState, action: any) => {
  switch (action.type) {
    case "authenticated":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        fetching: action.payload.fetching,
        token: action.payload.token,
        id: action.payload.id,
        error: null,
      };
    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        error: null,
        token: "",
        id: "",
        fetching: false,
      };
    case "error":
      return {
        ...state,
        error: action.payload.error,
        isAuthenticated: false,
        token: "",
        id: "",
        fetching: false,
      };
    default:
      throw new Error();
  }
};

const AuthContextProvider: React.FC<authProps> = (props) => {
  // hooks
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [propsState, setProps] = useState<any | null>(null);
  const dispatchMain = useDispatch();
  const { authenticated, id, token } = useSelector(authSelector);

  // Helpers functions for dispatch
  const authDispatchLogin = useCallback(
    (params: authState) => {
      dispatch({ type: "authenticated", payload: { ...params } });
      dispatchMain(updateAuthAction({ ...params }));
    },
    [dispatch, dispatchMain]
  );
  const authDispatchLogout = useCallback(
    (params: authState) => {
      dispatch({ type: "logout", payload: { ...params } });
      dispatchMain(
        updateAuthAction({ isAuthenticated: false, token: null, id: null })
      );
    },
    [dispatch, dispatchMain]
  );
  const authDispatchError = useCallback(
    (params: authState) => {
      dispatch({ type: "error", payload: { ...params } });
    },
    [dispatch]
  );

  // Login automatically if authenticated
  useEffect(() => {
    dispatch({
      type: "authenticated",
      payload: {
        isAuthenticated: authenticated,
        token,
        id,
        loading: false,
        error: null,
      },
    });
  }, [authenticated, id, token]);

  useEffect(() => {
    setProps(props.children);
  }, [props.children]);

  // states
  const { isAuthenticated, error, fetching } = state;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authDispatchLogin,
        authDispatchLogout,
        authDispatchError,
        error,
        fetching,
        id,
      }}
    >
      {propsState}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
