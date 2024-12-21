import { configureStore } from "@reduxjs/toolkit";
import { tokenReducer } from "./token";
import { templateReducer } from "./template";
import { planReducer } from "./plan";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    template: templateReducer,
    plan: planReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
