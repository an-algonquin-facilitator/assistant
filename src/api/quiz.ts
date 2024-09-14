import type { Paginated, RichText, RichTextInput } from "./api";
import { leBaseURL } from "./api";
import { makeFetch, makeQuery } from "./utils";

export interface Quiz {
  QuizId: number;
  Name: string;
  IsActive: boolean;
  SortOrder: number;
  AutoExportToGrades: boolean;
  GradeItemId: number;
  IsAutoSetGraded: boolean;
  Instructions: {
    Text: RichText;
    IsDisplayed: boolean;
  };
  Description: {
    Text: RichText;
    IsDisplayed: boolean;
  };
  StartDate: string;
  EndDate: string;
  DueDate: string;
  AttemptsAllowed: {
    IsUnlimited: boolean;
    NumberOfAttemptsAllowed: number;
  };
  LateSubmissionInfo: {
    LateSubmissionOption: number;
    LateLimitMinutes: unknown;
  };
  SubmissionTimeLimit: {
    IsEnforced: boolean;
    ShowClock: boolean;
    TimeLimitValue: number;
  };
  SubmissionGracePeriod: number;
  Password: unknown;
  Header: {
    Text: RichText;
    IsDisplayed: boolean;
  };
  Footer: {
    Text: RichText;
    IsDisplayed: boolean;
  };
  AllowHints: boolean;
  DisableRightClick: boolean;
  DisablePagerAndAlerts: boolean;
  NotificationEmail: unknown;
  DisplayInCalendar: boolean;
  CalcTypeId: number;
  RestrictIPAddressRange: unknown;
  CategoryId: unknown;
  PreventMovingBackwards: boolean;
  Shuffle: boolean;
  ActivityId: string;
  AllowOnlyUsersWithSpecialAccess: boolean;
  IsRetakeIncorrectOnly: boolean;
  PagingTypeId: unknown;
  IsSynchronous: boolean;
  DeductionPercentage: unknown;
}

export const useQuizzesQuery = makeQuery<Paginated<Quiz>, string>(
  leBaseURL,
  (course: string) => `/${course}/quizzes/`,
);

export const fetchQuizzes = makeFetch<Paginated<Quiz>, string>(
  leBaseURL,
  (course: string) => `/${course}/quizzes/`,
);

export const fetchQuiz = makeFetch<Quiz, [string, string]>(
  leBaseURL,
  ([course, quiz]: [string, string]) => `/${course}/quizzes/${quiz}`,
);

export interface InputQuiz {
  Name: string;
  IsActive: boolean;
  SortOrder: number;
  AutoExportToGrades: boolean;
  GradeItemId: number;
  IsAutoSetGraded: boolean;
  Instructions: {
    Text: RichTextInput;
    IsDisplayed: boolean;
  };
  Description: {
    Text: RichTextInput;
    IsDisplayed: boolean;
  };
  StartDate: string;
  EndDate: string;
  DueDate: string;
  DisplayInCalendar: boolean;
  NumberOfAttemptsAllowed: number | null;
  LateSubmissionInfo: {
    LateSubmissionOption: number;
    LateLimitMinutes: unknown;
  };
  SubmissionTimeLimit: {
    IsEnforced: boolean;
    ShowClock: boolean;
    TimeLimitValue: number;
  };
  SubmissionGracePeriod: number;
  Password: unknown;
  Header: {
    Text: RichTextInput;
    IsDisplayed: boolean;
  };
  Footer: {
    Text: RichTextInput;
    IsDisplayed: boolean;
  };
  AllowHints: boolean;
  DisableRightClick: boolean;
  DisablePagerAndAlerts: boolean;
  NotificationEmail: unknown;
  CalcTypeId: number;
  RestrictIPAddressRange: unknown;
  CategoryId: unknown;
  PreventMovingBackwards: boolean;
  Shuffle: boolean;
  AllowOnlyUsersWithSpecialAccess: boolean;
  IsRetakeIncorrectOnly: boolean;
  PagingTypeId: unknown;
  IsSynchronous: boolean;
  DeductionPercentage: unknown;
}

export const updateQuiz = async (
  token: string,
  course: string,
  quizId: string,
  quiz: InputQuiz,
): Promise<Response> => {
  return fetch(`${leBaseURL}/${course}/quizzes/${quizId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quiz),
  });
};
