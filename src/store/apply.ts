import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export interface Task {
  name: string;
  type: TaskType;
  loading: boolean;
  error?: APIError;
}

export enum TaskType {
  ASSIGNMENT = "ASSIGNMENT",
  QUIZ = "QUIZ",
  NEWS = "NEWS",
}

export interface APIError {
  title: string;
  detail: string;
}

interface ApplyState {
  tasks: Task[];
}

const initialState: ApplyState = {
  tasks: [],
};

interface TaskIDPayload {
  name: string;
  type: TaskType;
}

interface TaskFailedPayload {
  name: string;
  type: TaskType;
  error: APIError;
}

const applySlice = createSlice({
  name: "apply",
  initialState,
  reducers: {
    startTask: (state, action: PayloadAction<TaskIDPayload>) => {
      state.tasks.push({
        name: action.payload.name,
        type: action.payload.type,
        loading: true,
      });
    },
    taskFailed: (state, action: PayloadAction<TaskFailedPayload>) => {
      const i = state.tasks.findIndex(
        (t) => t.name === action.payload.name && t.type === action.payload.type,
      );
      if (i === -1) return;
      state.tasks[i].error = action.payload.error;
    },
    taskSuccess: (state, action: PayloadAction<TaskIDPayload>) => {
      const i = state.tasks.findIndex(
        (t) => t.name === action.payload.name && t.type === action.payload.type,
      );
      if (i === -1) return;
      state.tasks[i].loading = false;
    },
    resetTasks: (state) => {
      state.tasks = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { startTask, taskFailed, taskSuccess, resetTasks } =
  applySlice.actions;

export const useApplyStarted = (): boolean =>
  useAppSelector((s) => s.apply.tasks.length > 0);
export const useApplyCompleted = (): boolean =>
  useAppSelector((s) => s.apply.tasks.every((t) => !t.loading));
export const useTasks = (): Task[] => useAppSelector((s) => s.apply.tasks);

export const useToken = (): string => useAppSelector((s) => s.token.value);

export const useIsTokenSet = (): boolean =>
  useAppSelector((s) => s.token.value !== "");

export const useHasTaskN = (n: number): boolean =>
  useAppSelector((s) => s.apply.tasks.length > n);

export const useTask = (i: number): Task =>
  useAppSelector((s) => s.apply.tasks[i]);

export const applyReducer = applySlice.reducer;
