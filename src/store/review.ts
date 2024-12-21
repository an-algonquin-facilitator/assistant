import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

interface ReviewState {
  expanded: string;
}

const initialState: ReviewState = {
  expanded: "",
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    changeExpanded: (state, action: PayloadAction<string>) => {
      state.expanded = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeExpanded } = reviewSlice.actions;

export const useIsExpanded = (i: string): boolean =>
  useAppSelector((s) => s.review.expanded === i);

export const reviewReducer = reviewSlice.reducer;
