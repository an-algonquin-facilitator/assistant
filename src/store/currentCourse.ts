import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CurrentCourseState {
  value: string;
}

const initialState: CurrentCourseState = {
  value: "",
};

export const CurrentCourseSlice = createSlice({
  name: "currentCourse",
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentCourse } = CurrentCourseSlice.actions;

export const currentCourseReducer = CurrentCourseSlice.reducer;
