import { configureStore } from "@reduxjs/toolkit";
import { tokenReducer } from "./token";
import { currentCourseReducer } from "./currentCourse";
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
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
