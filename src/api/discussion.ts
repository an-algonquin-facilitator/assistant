// https://docs.valence.desire2learn.com/res/discuss.html
import { leDiscussionBaseURL } from "./api";
import type { RichText, RichTextInput } from "./api";
import { makeFetch } from "./utils";

export interface Forum {
  ForumId: number;
  StartDate: string | null;
  EndDate: string | null;
  PostStartDate: string | null;
  PostEndDate: string | null;
  Name: string;
  Description: RichText;
  ShowDescriptionInTopics: boolean | null;
  AllowAnonymous: boolean;
  IsLocked: boolean;
  IsHidden: boolean;
  RequiresApproval: boolean;
  DisplayInCalendar: boolean;
  DisplayPostDatesInCalendar: boolean;
  StartDateAvailabilityType: number | null;
  EndDateAvailabilityType: number | null;
}

// Discussions.Topic
export interface Topic {
  ForumId: number;
  TopicId: number;
  Name: string;
  Description: RichText;
  StartDate: string | null;
  EndDate: string | null;
  // UnlockStartDate, UnlockEndDate and IsLocked are no longer used since
  // LE API 1.56, they are always null/false and ignored on input.
  UnlockStartDate: string | null;
  UnlockEndDate: string | null;
  IsLocked: boolean;
  AllowAnonymousPosts: boolean;
  RequiresApproval: boolean;
  UnApprovedPostCount: number;
  PinnedPostCount: number;
  ScoringType: unknown;
  IsAutoScore: boolean;
  ScoreOutOf: number | null;
  IncludeNonScoredValues: boolean;
  ScoredCount: number;
  RatingsSum: number;
  RatingsCount: number;
  IsHidden: boolean;
  MustPostToParticipate: boolean;
  RatingType: unknown;
  ActivityId: string | null;
  GroupTypeId: number | null;
  StartDateAvailabilityType: number | null;
  EndDateAvailabilityType: number | null;
  // Added with LE API v1.90
  DueDate: string | null;
}

// Discussions.CreateTopicData, used for both creating and updating a topic.
// The PUT replaces the whole topic so every property has to be sent back.
export interface InputTopic {
  Name: string;
  Description: RichTextInput;
  AllowAnonymousPosts: boolean;
  StartDate: string | null;
  EndDate: string | null;
  IsHidden: boolean;
  UnlockStartDate: string | null;
  UnlockEndDate: string | null;
  RequiresApproval: boolean;
  ScoreOutOf: number | null;
  IsAutoScore: boolean;
  IncludeNonScoredValues: boolean;
  ScoringType: unknown;
  IsLocked: boolean;
  MustPostToParticipate: boolean;
  RatingType: unknown;
  DisplayInCalendar: boolean | null;
  DisplayUnlockDatesInCalendar: boolean | null;
  GroupTypeId: number | null;
  StartDateAvailabilityType: number | null;
  EndDateAvailabilityType: number | null;
  // Must be after StartDate and before or equal to EndDate.
  DueDate: string | null;
}

export const fetchForums = makeFetch<Forum[], string>(
  leDiscussionBaseURL,
  (course: string) => `/${course}/discussions/forums/`,
);

export const fetchTopics = makeFetch<Topic[], [string, string]>(
  leDiscussionBaseURL,
  ([course, forum]: [string, string]) =>
    `/${course}/discussions/forums/${forum}/topics/`,
);

export const fetchTopic = makeFetch<Topic, [string, string, string]>(
  leDiscussionBaseURL,
  ([course, forum, topic]: [string, string, string]) =>
    `/${course}/discussions/forums/${forum}/topics/${topic}`,
);

// Topics live inside forums and there is no route listing every topic of a
// course, so list the forums first and then the topics of each forum.
export const fetchAllTopics = async (
  token: string,
  course: string,
): Promise<Topic[]> => {
  const forums = await fetchForums(token, course);
  if (!Array.isArray(forums)) {
    throw new Error(
      `Unexpected discussion forums response: ${JSON.stringify(forums)}`,
    );
  }
  const topics = await Promise.all(
    forums.map(async (f) => fetchTopics(token, [course, f.ForumId + ""])),
  );
  return topics.flat();
};

export const updateTopic = async (
  token: string,
  course: string,
  forumId: string,
  topicId: string,
  topic: InputTopic,
): Promise<Response> => {
  return fetch(
    `${leDiscussionBaseURL}/${course}/discussions/forums/${forumId}/topics/${topicId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(topic),
    },
  );
};
