import { createSlice } from "@reduxjs/toolkit";
import type { Draft, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import type { Response } from "../api/utils";
import type { TemplateValidationResult } from "./templateValidation";
import { validateTemplate } from "./templateValidation";
import type { News } from "../api/news";
import type { Quiz } from "../api/quiz";
import type { Course } from "../api/course";
import type { Folder } from "../api/folder";

export interface SelectedCourse {
  course: Course;
  folders: Folder[];
  quizzes: Quiz[];
  news: News[];
}

export interface TemplateFile {
  filename: string;
  template: CourseTemplate;
}

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
  file: TemplateFile;
  courseRequest: Response<SelectedCourse>;

  validationResult: TemplateValidationResult;
  value: Required<CourseTemplate>;
  course: SelectedCourse;
}

const initialState: CourseTemplateState = {
  courseRequest: { loading: false },
  file: {
    filename: "",
    template: {
      courseCode: "",
    },
  },
  validationResult: { isTemplateValid: false },
  value: {
    courseCode: "",
    assignments: [],
    quizzes: [],
    news: [],
  },
  course: {
    course: {
      Identifier: "",
      Name: "",
      Code: "",
      IsActive: false,
      CanSelfRegister: false,
      Description: {
        Text: "",
        Html: "",
      },
      Path: "",
      StartDate: "",
      EndDate: "",
      CourseTemplate: {
        Identifier: "",
        Name: "",
        Code: "",
      },
      Semester: {
        Identifier: "",
        Name: "",
        Code: "",
      },
      Department: {
        Identifier: "",
        Name: "",
        Code: "",
      },
    },
    folders: [],
    quizzes: [],
    news: [],
  },
};

const updateTemplateValidationResult = (
  state: Draft<CourseTemplateState>,
): void => {
  state.validationResult = validateTemplate(state.file, state.course);
  if (state.validationResult.isTemplateValid) {
    state.value = {
      courseCode: state.file.template.courseCode,
      assignments: state.validationResult.validAssignments,
      quizzes: state.validationResult.validQuizzes,
      news: state.validationResult.validNews,
    };
  }
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    uploadTemplate(state, action: PayloadAction<TemplateFile>) {
      state.file = action.payload;
      updateTemplateValidationResult(state);
    },
    uploadInvalidTemplate(state) {
      state.file = initialState.file;
      state.validationResult = { isTemplateValid: false };
      state.course = initialState.course;
    },
    courseRequestStarted(state) {
      state.courseRequest = { loading: true };
      state.validationResult = { isTemplateValid: false };
      state.course = initialState.course;
    },
    courseRequestSuccess(state, action: PayloadAction<SelectedCourse>) {
      if (!state.courseRequest.loading) return;
      state.courseRequest = { loading: false, data: action.payload };
      state.course = action.payload;
      updateTemplateValidationResult(state);
    },
    courseRequestError(state, action: PayloadAction<string>) {
      if (!state.courseRequest.loading) return;
      state.courseRequest = { loading: false, error: action.payload };
      state.validationResult = { isTemplateValid: false };
    },
    setTemplate(state, action: PayloadAction<Required<CourseTemplate>>) {
      state.value = action.payload;
    },
    setCourse(state, action: PayloadAction<SelectedCourse>) {
      state.course = action.payload;
    },
    resetTemplate(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCourse,
  setTemplate,
  resetTemplate,
  uploadTemplate,
  uploadInvalidTemplate,
  courseRequestStarted,
  courseRequestSuccess,
  courseRequestError,
} = templateSlice.actions;

export const templateReducer = templateSlice.reducer;

export const useTemplate = (): Required<CourseTemplate> =>
  useAppSelector((s) => s.template.value);

export const useTemplateAssignmentCount = (): number =>
  useAppSelector((s) => s.template.value.assignments.length);

export const useTemplateQuizzesCount = (): number =>
  useAppSelector((s) => s.template.value.quizzes.length);

export const useTemplateNewsCount = (): number =>
  useAppSelector((s) => s.template.value.news.length);

export const useTemplateFile = (): TemplateFile =>
  useAppSelector((s) => s.template.file);

export const useTemplateFileName = (): string =>
  useAppSelector((s) => s.template.file.filename);

export const useCourse = (): SelectedCourse =>
  useAppSelector((s) => s.template.course);

export const useTemplateValidationResult = (): TemplateValidationResult =>
  useAppSelector((s) => s.template.validationResult);

export const useIsTemplateValid = (): boolean =>
  useAppSelector((s) => s.template.validationResult.isTemplateValid);

export const useIsCourseLoading = (): boolean =>
  useAppSelector((s) => s.template.courseRequest.loading);
