import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { News } from "../api/news";
import type { Quiz } from "../api/quiz";
import type { Course } from "../api/course";
import type { Folder } from "../api/folder";
import { useAppSelector } from "./hooks";

export interface SelectedCourse {
  course: Course;
  folders: Folder[];
  quizzes: Quiz[];
  news: News[];
}

interface CurrentCourseState {
  selected: SelectedCourse;
}

const initialState: CurrentCourseState = {
  selected: {
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

const currentCourseSlice = createSlice({
  name: "currentCourse",
  initialState,
  reducers: {
    setCourse(state, action: PayloadAction<SelectedCourse>) {
      state.selected = action.payload;
    },
    resetCourse(state) {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCourse, resetCourse } = currentCourseSlice.actions;

export const useCourse = (): SelectedCourse =>
  useAppSelector((s) => s.currentCourse.selected);

export const currentCourseReducer = currentCourseSlice.reducer;
