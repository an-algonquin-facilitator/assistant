import { makeFetch, makeQuery } from "./utils";

// https://docs.valence.desire2learn.com/http-routingtable.html

export interface WhoAmI {
  Identifier: string;
  FirstName: string;
  LastName: string;
  UniqueName: string;
  ProfileIdentifier: string;
}

const lpVersion = "1.9";
const leVersion = "1.74";

const host = `https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com`;
const lpBase = `/d2l/api/lp/${lpVersion}`;
const lpBaseURL = host + lpBase;

const leBase = `/d2l/api/le/${leVersion}`;
const leBaseURL = host + leBase;

export const useWhoAmIQuery = makeQuery<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`
);

export const fetchWhoAmI = makeFetch<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`
);

export interface RichText {
  Text: string;
  Html: string;
}

export interface Folder {
  Id: number;
  CategoryId: unknown;
  Name: string;
  TotalFiles: number;
  UnreadFiles: number;
  FlaggedFiles: number;
  TotalUsers: number;
  TotalUsersWithSubmissions: number;
  TotalUsersWithFeedback: number;
  IsHidden: boolean;
  AllowTextSubmission: boolean;
  DropboxType: number;
  GroupTypeId: unknown;
  DueDate: string;
  DisplayInCalendar: boolean;
  NotificationEmail: unknown;
  LinkAttachments: unknown[];
  ActivityId: string;
  IsAnonymous: boolean;
  SubmissionType: number;
  CompletionType: number;
  AllowableFileType: number;
  CustomAllowableFileTypes: unknown;
  GradeItemId: number;
  AllowOnlyUsersWithSpecialAccess: boolean;
  CustomInstructions: RichText;
  Attachments: {
    FileId: number;
    FileName: string;
    Size: number;
  }[];
  Availability: {
    StartDate: string;
    EndDate: string;
    StartDateAvailabilityType: number;
    EndDateAvailabilityType: number;
  };
  Assessment: unknown;
}

export const useFoldersQuery = makeQuery<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`
);

export const fetchFolders = makeFetch<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`
);

export interface Course {
  Identifier: string;
  Name: string;
  Code: string;
  IsActive: boolean;
  CanSelfRegister: boolean;
  Description: RichText;
  Path: string;
  StartDate: string;
  EndDate: string;
  CourseTemplate: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Semester: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Department: {
    Identifier: string;
    Name: string;
    Code: string;
  };
}

export const useCourseQuery = makeQuery<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`
);

export const fetchCourse = makeFetch<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`
);

export interface MyEnrollments {
  PagingInfo: {
    Bookmark: string;
    HasMoreItems: boolean;
  };
  Items: {
    OrgUnit: {
      Id: number;
      Type: {
        Id: number;
        Code: string;
        Name: string;
      };
      Name: string;
      Code: string;
    };
    Access: {
      IsActive: true;
      StartDate: string;
      EndDate: string;
      CanAccess: boolean;
      ClasslistRoleName: string;
      LISRoles: string[];
      LastAccessed: string;
    };
  }[];
}

export const useEnrollmentsQuery = makeQuery<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`
);

export const fetchEnrollments = makeFetch<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`
);

export const fetchFolder = makeFetch<Folder, [string, string]>(
  leBaseURL,
  ([course, folder]: [string, string]) => `/${course}/dropbox/folders/${folder}`
);

export const updateFolder = (
  token: string,
  course: string,
  folderId: string,
  folder: Folder
) => {
  return fetch(`${leBaseURL}/${course}/dropbox/folders/${folderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(folder),
  });
};

export const updateQuiz = (
  token: string,
  course: string,
  quizId: string,
  quiz: Quiz
) => {
  return fetch(`${leBaseURL}/${course}/quizzes/${quizId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quiz),
  });
};

interface Quiz {
  QuizId: number;
  Name: string;
  AutoExportToGrades: boolean;
  IsActive: boolean;
  GradeItemId: number;
  IsAutoSetGraded: boolean;
  Instructions: {
    Text: { Text: string; Html: string };
    IsDisplayed: boolean;
  };
  Description: {
    Text: {
      Text: string;
      Html: string;
    };
    IsDisplayed: boolean;
  };
  Header: { Text: { Text: string; Html: string }; IsDisplayed: boolean };
  Footer: { Text: { Text: string; Html: string }; IsDisplayed: boolean };
  StartDate: string;
  EndDate: string;
  DueDate: string;
  DisplayInCalendar: boolean;
  SortOrder: number;
  SubmissionTimeLimit: {
    IsEnforced: boolean;
    ShowClock: boolean;
    TimeLimitValue: number;
  };
  SubmissionGracePeriod: number;
  LateSubmissionInfo: {
    LateSubmissionOption: number;
    LateLimitMinutes: unknown;
  };
  AttemptsAllowed: { IsUnlimited: boolean; NumberOfAttemptsAllowed: number };
  Password: unknown;
  AllowHints: boolean;
  DisableRightClick: boolean;
  DisablePagerAndAlerts: boolean;
  RestrictIPAddressRange: unknown[];
  NotificationEmail: unknown;
  CalcTypeId: number;
  CategoryId: unknown;
  PreventMovingBackwards: boolean;
  Shuffle: boolean;
  ActivityId: string;
  AllowOnlyUsersWithSpecialAccess: boolean;
  IsRetakeIncorrectOnly: boolean;
  IsSynchronous: boolean;
  DeductionPercentage: unknown;
}

interface Paginated<T> {
  Objects: T[];
}

export const useQuizzesQuery = makeQuery<Paginated<Quiz>, string>(
  leBaseURL,
  (course: string) => `/${course}/quizzes/`
);

export const fetchQuiz = makeFetch<Quiz, [string, string]>(
  leBaseURL,
  ([course, quiz]: [string, string]) => `/${course}/quizzes/${quiz}`
);
