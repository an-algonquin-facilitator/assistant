import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DateOffset } from "./template";
import { useAppSelector } from "./hooks";

interface PlanState {
  assignments: AssignmentPlan[];
  quizzes: QuizPlan[];
  news: NewsPlan[];
}

const initialState: PlanState = {
  assignments: [],
  quizzes: [],
  news: [],
};

export interface AssignmentPlan {
  id: string;
  templateId?: string;
  name: string;
  start: number;
  due: number;
  end: number;

  holidayOffset: number;
  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface QuizPlan {
  id: string;
  templateId?: string;
  name: string;
  start: number;
  due: number;
  end: number;

  holidayOffset: number;
  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface NewsPlan {
  name: string;
  content: string;
  open: number;
  openOffset: DateOffset;
  dismiss: number;
  dismissOffset: DateOffset;
}

export interface CoursePlan {
  assignments: AssignmentPlan[];
  quizzes: QuizPlan[];
  news: NewsPlan[];
}

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    addAssignmentPlan(state, action: PayloadAction<AssignmentPlan>) {
      if (state.assignments.some((a) => a.id === action.payload.id)) return;
      state.assignments.push(action.payload);
    },
    removeAssignmentPlan(state, action: PayloadAction<AssignmentPlan>) {
      const i = state.assignments.findIndex((a) => a.id === action.payload.id);
      if (i === -1) return;
      state.assignments.splice(i, 1);
    },
    addQuizPlan(state, action: PayloadAction<QuizPlan>) {
      if (state.quizzes.some((a) => a.id === action.payload.id)) return;
      state.quizzes.push(action.payload);
    },
    removeQuizPlan(state, action: PayloadAction<QuizPlan>) {
      const i = state.quizzes.findIndex((a) => a.id === action.payload.id);
      if (i === -1) return;
      state.quizzes.splice(i, 1);
    },

    addNewsPlan(state, action: PayloadAction<NewsPlan>) {
      if (state.news.some((a) => a.name === action.payload.name)) return;
      state.news.push(action.payload);
    },
    removeNewsPlan(state, action: PayloadAction<NewsPlan>) {
      const i = state.news.findIndex((a) => a.name === action.payload.name);
      if (i === -1) return;
      state.news.splice(i, 1);
    },
    resetPlan(state) {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addAssignmentPlan,
  removeAssignmentPlan,
  addQuizPlan,
  removeQuizPlan,
  addNewsPlan,
  removeNewsPlan,
  resetPlan,
} = planSlice.actions;

export const useIsAssignmentPlanned = (id: string): boolean =>
  useAppSelector((s) => s.plan.assignments.some((a) => a.id === id));

export const useIsQuizPlanned = (id: string): boolean =>
  useAppSelector((s) => s.plan.quizzes.some((a) => a.id === id));

export const useIsNewsPlanned = (name: string): boolean =>
  useAppSelector((s) => s.plan.news.some((a) => a.name === name));

export const useIsAllAssignmentPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.assignments.length === s.template.value.assignments.length,
  );

export const usePlanedAssignmentCount = (): number =>
  useAppSelector((s) => s.plan.assignments.length);

export const useIsAllQuizPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.quizzes.length === s.template.value.quizzes.length,
  );

export const useIsAllNewsPlanned = (): boolean =>
  useAppSelector((s) => s.plan.news.length === s.template.value.news.length);

export const usePlanedQuizCount = (): number =>
  useAppSelector((s) => s.plan.quizzes.length);

export const usePlanedNewsCount = (): number =>
  useAppSelector((s) => s.plan.news.length);

export const useIsAnythingPlanned = (): boolean =>
  useAppSelector(
    (s) =>
      s.plan.assignments.length > 0 ||
      s.plan.quizzes.length > 0 ||
      s.plan.news.length > 0,
  );

export const usePlannedAssignments = (): AssignmentPlan[] =>
  useAppSelector((s) => s.plan.assignments);
export const usePlannedQuizzes = (): QuizPlan[] =>
  useAppSelector((s) => s.plan.quizzes);
export const usePlannedNews = (): NewsPlan[] =>
  useAppSelector((s) => s.plan.news);

export const planReducer = planSlice.reducer;
