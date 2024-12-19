import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export interface DateOffset {
  weeks?: number;
  days?: number;
}

export interface AssignmentTemplate {
  id?: string;
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface QuizTemplate {
  id?: string;
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface NewsTemplate {
  name: string;
  content: string;
  start?: DateOffset;
  end?: DateOffset;
}

export interface CourseTemplate {
  courseCode: string;
  assignments?: AssignmentTemplate[];
  quizzes?: QuizTemplate[];
  news?: NewsTemplate[];
}

interface CourseTemplateState {
  value: Required<CourseTemplate>;
}

const initialState: CourseTemplateState = {
  value: {
    courseCode: "",
    assignments: [],
    quizzes: [],
    news: [],
  },
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate(state, action: PayloadAction<Required<CourseTemplate>>) {
      state.value = action.payload;
    },
    resetTemplate(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setTemplate, resetTemplate } = templateSlice.actions;

export const templateReducer = templateSlice.reducer;

export const useTemplate = (): Required<CourseTemplate> =>
  useAppSelector((s) => s.template.value);

export const useTemplateAssignmentCount = (): number =>
  useAppSelector((s) => s.template.value.assignments.length);

export const useTemplateQuizzesCount = (): number =>
  useAppSelector((s) => s.template.value.quizzes.length);

export const useTemplateNewsCount = (): number =>
  useAppSelector((s) => s.template.value.news.length);
