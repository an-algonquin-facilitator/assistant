// https://docs.valence.desire2learn.com/http-routingtable.html

const lpVersion = "1.9";
const leVersion = "1.74";

export const host = `https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com`;
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

// Intelligent Agents routes only exist from LE API 1.93 (LMS 20.26.4). The
// classlist (used to resolve role names) is served from the same version.
// https://docs.valence.desire2learn.com/res/intelligentagents.html
const leAgentsVersion = "1.93";
const leAgentsBase = `/d2l/api/le/${leAgentsVersion}`;
export const leAgentsBaseURL = host + leAgentsBase;

// Release conditions live in the LP API and need 1.49+.
// https://docs.valence.desire2learn.com/res/releaseconditions.html
const lpConditionsVersion = "1.49";
const lpConditionsBase = `/d2l/api/lp/${lpConditionsVersion}`;
export const lpConditionsBaseURL = host + lpConditionsBase;

export interface Paginated<T> {
  Objects: T[];
}

// Newer list routes return an "object list page": follow Next until null.
export interface ObjectListPage<T> {
  Next: string | null;
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
