import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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

export interface Announcement {
  name: string;
  content: string;
  start?: DateOffset;
  end?: DateOffset;
}

export interface Template {
  assignments?: Assignment[];
  quizzes?: Quiz[];
  news?: Announcement[];
}

export interface TemplateState {
  data: Template;
  startDateUnixMS: number;
}

export const defaultStartDate = "2024-09-11";

const initialState: TemplateState = {
  data: {},
  startDateUnixMS: new Date(defaultStartDate).getTime(),
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate(state, action: PayloadAction<Template>) {
      state.data = action.payload;
    },
    setStartDateUnixMS(state, action: PayloadAction<number>) {
      state.startDateUnixMS = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTemplate, setStartDateUnixMS } = templateSlice.actions;

export const templateReducer = templateSlice.reducer;
