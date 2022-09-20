import authSlice from "@redux/auth/authSlice";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const reduxStore = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(reduxStore.dispatch);

export type AppDispatch = typeof reduxStore.dispatch;
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default reduxStore;
