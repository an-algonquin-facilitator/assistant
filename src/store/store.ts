import { configureStore } from "@reduxjs/toolkit";
import { tokenReducer } from "./token";
import { currentCourseReducer } from "./course";
import { templateReducer } from "./template";
import { planReducer } from "./plan";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    currentCourse: currentCourseReducer,
    template: templateReducer,
    plan: planReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
