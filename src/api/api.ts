// https://docs.valence.desire2learn.com/http-routingtable.html

const lpVersion = "1.9";
const leVersion = "1.74";

const host = `https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com`;
const lpBase = `/d2l/api/lp/${lpVersion}`;
export const lpBaseURL = host + lpBase;

const leBase = `/d2l/api/le/${leVersion}`;
export const leBaseURL = host + leBase;

export interface Paginated<T> {
  Objects: T[];
}

export interface RichText {
  Text: string;
  Html: string;
}

export interface RichTextInput {
  Type: "Html" | "Text";
  Content: string;
}

export const StatusOK = 200;
export const StatusBadRequest = 400;
