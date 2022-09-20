import { createSlice } from "@reduxjs/toolkit";
import { User } from "@shared/types";

export interface AuthState {
  user: User | null;
  token: string | null;
  authenticating: boolean;
}

const name = "auth";
const initialState: AuthState = {
  token: null,
  user: null,
  authenticating: true,
};

const authSlice = createSlice({
  name,
  initialState,

  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAuthenticating: (state, action) => {
      state.authenticating = action.payload;
    },
    setState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      } as AuthState;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export default authSlice;
