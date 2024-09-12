import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export interface DateOffset {
  weeks?: number;
  days?: number;
}

export interface Assignment {
  id?: string;
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface Quiz {
  id?: string;
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface News {
  name: string;
  content: string;
  start?: DateOffset;
  end?: DateOffset;
}

export interface Template {
  assignments?: Assignment[];
  quizzes?: Quiz[];
  news?: News[];
}

export interface TemplateState {
  loaded: boolean;
  assignments: Assignment[];
  quizzes: Quiz[];
  news: News[];
}

const initialState: TemplateState = {
  loaded: false,
  assignments: [],
  quizzes: [],
  news: [],
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplateAssignments(state, action: PayloadAction<Assignment[]>) {
      state.loaded = true;
      state.assignments = action.payload;
    },
    setTemplateQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.loaded = true;
      state.quizzes = action.payload;
    },
    setTemplateNews(state, action: PayloadAction<News[]>) {
      state.loaded = true;
      state.news = action.payload;
    },
    resetTemplate(state) {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTemplateAssignments,
  setTemplateQuizzes,
  setTemplateNews,
  resetTemplate,
} = templateSlice.actions;

export const templateReducer = templateSlice.reducer;

export const useTemplateAssignments = () =>
  useAppSelector((s) => s.template.assignments);

export const useTemplateQuizzes = () =>
  useAppSelector((s) => s.template.quizzes);

export const useTemplateNews = () => useAppSelector((s) => s.template.news);

export const useTemplateAssignmentCount = () =>
  useAppSelector((s) => s.template.assignments.length);

export const useTemplateQuizCount = () =>
  useAppSelector((s) => s.template.quizzes.length);

export const useTemplateNewsCount = () =>
  useAppSelector((s) => s.template.news.length);

export const useIsValidTemplate = () =>
  useAppSelector(
    (s) =>
      s.template.assignments.length > 0 ||
      s.template.quizzes.length > 0 ||
      s.template.news.length > 0
  );

export const useTemplateLoaded = () => useAppSelector((s) => s.template.loaded);
