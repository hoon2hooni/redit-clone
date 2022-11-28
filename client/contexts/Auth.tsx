import React, { createContext, ReactNode, Dispatch, useContext } from "react";
import { User, UserAction } from "../types";

interface State {
  authenticate?: boolean;
  user?: User;
  loading: boolean;
}

export const StateContext = createContext<State>({
  authenticate: false,
  loading: true,
});

export const DispatchContext = createContext<Dispatch<UserAction> | null>(null);

const reducer = (state: State, action: UserAction): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticate: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticate: false,
        user: undefined,
        loading: false,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action`);
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userState, dispatch] = React.useReducer(reducer, {
    loading: false,
  });
  return (
    <StateContext.Provider value={userState}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAuthState = () => {
  return useContext(StateContext);
};

export const useAuthDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) {
    throw new Error("useAuthDispatch Must be in AuthProvider");
  }
  return dispatch;
};

export default AuthProvider;
