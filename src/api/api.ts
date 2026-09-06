// https://docs.valence.desire2learn.com/http-routingtable.html

const lpVersion = "1.9";
const leVersion = "1.74";

const host = `https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com`;
const lpBase = `/d2l/api/lp/${lpVersion}`;
export const lpBaseURL = host + lpBase;

const leBase = `/d2l/api/le/${leVersion}`;
export const leBaseURL = host + leBase;

// Discussion topics only expose a DueDate starting with LE API 1.90, so the
// discussions routes use a newer LE version than the rest of the app.
// https://docs.valence.desire2learn.com/res/discuss.html
const leDiscussionVersion = "1.90";
const leDiscussionBase = `/d2l/api/le/${leDiscussionVersion}`;
export const leDiscussionBaseURL = host + leDiscussionBase;

export interface Paginated<T> {
  Objects: T[];
}

// https://docs.valence.desire2learn.com/basic/conventions.html
// D2L does not guarantee both forms: a value may come back with only the
// Text version (Html null), only the Html version, or both.
export interface RichText {
  Text: string;
  Html: string | null;
}

export interface RichTextInput {
  Type: "Html" | "Text";
  Content: string;
}

export const StatusOK = 200;
export const StatusBadRequest = 400;
