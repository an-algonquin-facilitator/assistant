import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
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

export const defaultStartDate = (() => {
  return "2024-09-11";
  // Takes taken from https://www7.algonquincollege.com/ro/academic%20calendar2024-2025.pdf
  // Yes all the dates in the code are 1 day after to make dayjs align properly.
  const dates2024_2025 = [
    "2024-09-11",
    "2024-10-02",
    "2024-11-02",
    "2024-12-03",
    "2025-01-15",
    "2025-02-04",
    "2025-03-04",
    "2025-04-02",
    "2025-05-14",
    "2025-06-03",
    "2025-07-03",
  ];
  const today = dayjs(new Date());
  return (
    dates2024_2025.find((d) => dayjs(d).isAfter(today)) ?? dates2024_2025[0]
  );
})();

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
    resetStartDate(state) {
      state.startDateUnixMS = new Date(defaultStartDate).getTime();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTemplate, setStartDateUnixMS, resetStartDate } =
  templateSlice.actions;

export const templateReducer = templateSlice.reducer;
export const useStartDateUnixMS = () =>
  useAppSelector((s) => s.template.startDateUnixMS);
export const useTemplate = () => useAppSelector((s) => s.template.data);
