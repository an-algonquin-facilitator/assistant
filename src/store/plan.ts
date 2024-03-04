import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DateOffset } from "./template";

export interface PlanState {
  value?: ICoursePlan;
}

const initialState: PlanState = {};

export interface IAssignmentPlan {
  id: string;
  name: string;
  start: number;
  due: number;
  end: number;

  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface IQuizPlan {
  id: string;
  name: string;
  start: number;
  due: number;
  end: number;

  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface ICoursePlan {
  id: string;
  name: string;
  assignments: IAssignmentPlan[];
  quizzes: IQuizPlan[];
}

export const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlan: (state, action: PayloadAction<ICoursePlan>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPlan } = planSlice.actions;

export const planReducer = planSlice.reducer;
