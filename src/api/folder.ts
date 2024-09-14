import { leBaseURL } from "./api";
import type { RichText, RichTextInput } from "./api";
import { makeFetch, makeQuery } from "./utils";

interface FolderAttachment {
  FileId: number;
  FileName: string;
  Size: number;
}

interface FolderAvailability {
  StartDate: string;
  EndDate: string;
  StartDateAvailabilityType?: number;
  EndDateAvailabilityType?: number;
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
  Attachments: FolderAttachment[];
  Availability?: FolderAvailability;
  Assessment: unknown;
}

export interface InputFolder {
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
  CustomInstructions: RichTextInput;
  Attachments: FolderAttachment[];
  Availability: FolderAvailability;
  Assessment: unknown;
}

export const useFoldersQuery = makeQuery<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`,
);

export const fetchFolders = makeFetch<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`,
);

export const fetchFolder = makeFetch<Folder, [string, string]>(
  leBaseURL,
  ([course, folder]: [string, string]) =>
    `/${course}/dropbox/folders/${folder}`,
);

export const updateFolder = async (
  token: string,
  course: string,
  folderId: string,
  folder: InputFolder,
): Promise<Response> => {
  return fetch(`${leBaseURL}/${course}/dropbox/folders/${folderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(folder),
  });
};
