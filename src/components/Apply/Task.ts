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
  DELETE = "DELETE",
}

export interface APIError {
  title: string;
  detail: string;
}
