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
  courseCode: string;
  assignments?: Assignment[];
  quizzes?: Quiz[];
  news?: News[];
}

export interface TemplateState {
  value: Required<Template>;
}

const initialState: TemplateState = {
  value: {
    courseCode: "",
    assignments: [],
    quizzes: [],
    news: [],
  },
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate(state, action: PayloadAction<Required<Template>>) {
      state.value = action.payload;
    },
    resetTemplate(state) {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTemplate, resetTemplate } = templateSlice.actions;

export const templateReducer = templateSlice.reducer;

export const useTemplate = (): Required<Template> =>
  useAppSelector((s) => s.template.value);

export const useTemplateAssignmentCount = (): number =>
  useAppSelector((s) => s.template.value.assignments.length);

export const useTemplateQuizCount = (): number =>
  useAppSelector((s) => s.template.value.quizzes.length);

export const useTemplateNewsCount = (): number =>
  useAppSelector((s) => s.template.value.news.length);
