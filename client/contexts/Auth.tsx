import axios from "axios";
import React, {
  createContext,
  ReactNode,
  Dispatch,
  useContext,
  useEffect,
} from "react";
import { User, UserAction } from "../types";

interface State {
  authenticated?: boolean;
  user?: User;
  loading: boolean;
}

export const StateContext = createContext<State>({
  authenticated: false,
  loading: true,
});

export const DispatchContext = createContext<Dispatch<UserAction> | null>(null);

const reducer = (state: State, action: UserAction): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
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
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios("/auth/me");
        const { user } = await res.data;
        dispatch({ type: "LOGIN", payload: user });
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "STOP_LOADING" });
      }
    }
    loadUser();
  }, []);
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
