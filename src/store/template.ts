import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DateOffset {
  weeks?: number;
  days?: number;
}

export interface Assignment {
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface Quiz {
  name: string;
  start?: DateOffset;
  due: DateOffset;
  end?: DateOffset;
}

export interface Template {
  assignments?: Assignment[];
  quizzes?: Quiz[];
}

export interface TemplateState {
  data: Template;
  startDateUnixMS: number;
}

const initialState: TemplateState = {
  data: {},
  startDateUnixMS: Date.now(),
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
