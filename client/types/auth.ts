export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type UserAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };
