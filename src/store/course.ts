import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Course, Folder, News, Quiz } from "../api/api";
import { useAppSelector } from "./hooks";

export interface CurrentCourseState {
  course: APIRequest<Course>;
  folders: APIRequest<Folder[]>;
  quizzes: APIRequest<Quiz[]>;
  news: APIRequest<News[]>;
}

export interface APIRequest<T> {
  data?: T;
  loading: boolean;
  error?: any;
}

const initialState: CurrentCourseState = {
  course: {
    loading: false,
  },
  folders: {
    loading: false,
  },
  quizzes: {
    loading: false,
  },
  news: {
    loading: false,
  },
};

export const CurrentCourseSlice = createSlice({
  name: "currentCourse",
  initialState,
  reducers: {
    resetCourse(state) {
      Object.assign(state, initialState);
    },
    setCourse(state, action: PayloadAction<APIRequest<Course>>) {
      state.course = action.payload;
    },
    setFolders(state, action: PayloadAction<APIRequest<Folder[]>>) {
      state.folders = action.payload;
    },
    setQuizzes(state, action: PayloadAction<APIRequest<Quiz[]>>) {
      state.quizzes = action.payload;
    },
    setNews(state, action: PayloadAction<APIRequest<News[]>>) {
      state.news = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCourse, setFolders, setQuizzes, setNews, resetCourse } =
  CurrentCourseSlice.actions;

export const useCourse = () => useAppSelector((s) => s.currentCourse.course);

export const useCourseId = () =>
  useAppSelector((s) => s.currentCourse.course.data?.Identifier ?? "");

export const useCourseName = () =>
  useAppSelector((s) => s.currentCourse.course.data?.Name ?? "");

export const useIsCourseLoading = () =>
  useAppSelector((s) => {
    const c = s.currentCourse;
    return c.folders.loading || c.quizzes.loading || c.news.loading;
  });

export const useCourseError = () =>
  useAppSelector((s) => {
    const c = s.currentCourse;
    return c.folders.error ?? c.quizzes.error ?? c.news.error ?? undefined;
  });

export const useIsCourseReady = () =>
  useAppSelector((s) => {
    const c = s.currentCourse;
    return (
      c.course?.data?.Identifier !== "" &&
      !c.folders.loading &&
      !c.folders.error &&
      !c.quizzes.loading &&
      !c.quizzes.error &&
      !c.news.loading &&
      !c.news.error
    );
  });

export const useFolderCount = () =>
  useAppSelector((s) => s.currentCourse.folders.data?.length ?? 0);
export const useQuizCount = () =>
  useAppSelector((s) => s.currentCourse.quizzes.data?.length ?? 0);
export const useNewsCount = () =>
  useAppSelector((s) => s.currentCourse.news.data?.length ?? 0);

export const useFolders = () =>
  useAppSelector((s) => s.currentCourse.folders.data ?? []);
export const useQuizzes = () =>
  useAppSelector((s) => s.currentCourse.quizzes.data ?? []);
export const useNews = () =>
  useAppSelector((s) => s.currentCourse.news.data ?? []);

export const currentCourseReducer = CurrentCourseSlice.reducer;
