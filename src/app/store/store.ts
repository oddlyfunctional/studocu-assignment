import { configureStore } from "@reduxjs/toolkit";
import qnasReducer, { type State } from "./qnasSlice";

export type RootState = {
  qnas: State;
};

export const makeStore = (preloadedState: RootState) =>
  configureStore({
    reducer: {
      qnas: qnasReducer,
    },
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
