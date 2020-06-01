import React, { useReducer, createContext, useEffect, useState, useCallback } from 'react';

export const AuthContext = createContext({});

interface authState {
  fetching: Boolean,
  isAuthenticated: Boolean,
  token: string,
  id: string,
  error: string,
}

interface authProps {
  children: any
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
    case 'authenticated':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        fetching: action.payload.fetching,
        token: action.payload.token,
        id: action.payload.id,
        error: '',
      };
    case 'logout':
      return {
        ...state,
        isAuthenticated: false,
        error: "",
        token: "",
        id: "",
        fetching: false,
      };
    case 'error':
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

  // Helpers functions for dispatch
  const authDispatchLogin = useCallback((params: authState) => {
    dispatch({ type: "authenticated", payload: { ...params } })
  }, [dispatch])
  const authDispatchLogout = useCallback((params: authState) => {
    dispatch({ type: "logout", payload: { ...params } })
  }, [dispatch])
  const authDispatchError = useCallback((params: authState) => {
    dispatch({ type: "error", payload: { ...params } })
  }, [dispatch])
  useEffect(() => {
    setProps(props.children);
  }, [props.children]);

  // states
  const { isAuthenticated, error, fetching } = state;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authDispatchLogin, authDispatchLogout, authDispatchError, error, fetching }}
    >
      {propsState}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
