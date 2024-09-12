export interface Task {
  name: string;
  type: TaskType;
  loading: boolean;
  error?: APIError;
}

export enum TaskType {
  ASSIGNMENT,
  QUIZ,
  NEWS,
  DELETE,
}

export interface APIError {
  title: string;
  detail: string;
}
