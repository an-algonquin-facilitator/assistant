import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { News } from "../api/news";
import type { Quiz } from "../api/quiz";
import type { Course } from "../api/course";
import type { Folder } from "../api/folder";
import { useAppSelector } from "./hooks";

export interface CurrentCourseState {
  course: Course;
  folders: Folder[];
  quizzes: Quiz[];
  news: News[];
}

export interface APIRequest<T> {
  data?: T;
  loading: boolean;
  error?: Error;
}

const initialState: CurrentCourseState = {
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
};

export const CurrentCourseSlice = createSlice({
  name: "currentCourse",
  initialState,
  reducers: {
    resetCourse(state) {
      Object.assign(state, initialState);
    },
    setCourse(state, action: PayloadAction<Course>) {
      state.course = action.payload;
    },
    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },
    setNews(state, action: PayloadAction<News[]>) {
      state.news = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCourse, setFolders, setQuizzes, setNews, resetCourse } =
  CurrentCourseSlice.actions;

export const useCourse = (): Course =>
  useAppSelector((s) => s.currentCourse.course);

export const useCourseId = (): string =>
  useAppSelector((s) => s.currentCourse.course.Identifier);

export const useCourseName = (): string =>
  useAppSelector((s) => s.currentCourse.course.Name);

export const useFolderCount = (): number =>
  useAppSelector((s) => s.currentCourse.folders.length);
export const useQuizCount = (): number =>
  useAppSelector((s) => s.currentCourse.quizzes.length);
export const useNewsCount = (): number =>
  useAppSelector((s) => s.currentCourse.news.length);

export const useFolders = (): Folder[] =>
  useAppSelector((s) => s.currentCourse.folders);
export const useQuizzes = (): Quiz[] =>
  useAppSelector((s) => s.currentCourse.quizzes);
export const useNews = (): News[] =>
  useAppSelector((s) => s.currentCourse.news);

export const currentCourseReducer = CurrentCourseSlice.reducer;
