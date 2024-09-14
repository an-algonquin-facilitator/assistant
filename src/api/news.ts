import type { RichText } from "./api";
import { leBaseURL } from "./api";
import { makeFetch, makeQuery } from "./utils";

export interface News {
  Id: number;
  IsHidden: boolean;
  Attachments: [];
  CreatedBy: number;
  CreatedDate: string;
  LastModifiedBy: null;
  LastModifiedDate: string;
  Title: string;
  Body: RichText;
  StartDate: string;
  EndDate: string;
  IsGlobal: boolean;
  IsPublished: boolean;
  ShowOnlyInCourseOfferings: boolean;
  IsAuthorInfoShown: boolean;
  IsStartDateShown: boolean;
  IsPinned: boolean;
}

export interface CreateNews {
  Title: string;
  Body: RichText;
  StartDate: string;
  EndDate: string | null;
  IsGlobal: boolean;
  IsPublished: boolean;
  ShowOnlyInCourseOfferings: boolean;
  IsAuthorInfoShown: boolean;
  IsPinned: boolean;
}
export const useNewsQuery = makeQuery<News[], string>(
  leBaseURL,
  (course: string) => `/${course}/news/`,
);
export const fetchAllNews = makeFetch<News[], string>(
  leBaseURL,
  (course: string) => `/${course}/news/`,
);
export const fetchNews = makeFetch<News, [string, string]>(
  leBaseURL,
  ([course, news]: [string, string]) => `/${course}/news/${news}`,
);
export const updateNews = async (
  token: string,
  course: string,
  newsId: string,
  news: CreateNews,
): Promise<Response> => {
  return fetch(`${leBaseURL}/${course}/news/${newsId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
};
export const createNews = async (
  token: string,
  course: string,
  news: CreateNews,
): Promise<Response> => {
  return fetch(`${leBaseURL}/${course}/news/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
};
