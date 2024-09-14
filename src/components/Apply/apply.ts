import type { Dispatch, SetStateAction } from "react";
import type { APIError, Task } from "./Task";
import { TaskType } from "./Task";

import { store } from "../../store/store";
import type { RichText, RichTextInput } from "../../api/api";
import { StatusOK } from "../../api/api";
import type { InputFolder } from "../../api/folder";
import { updateFolder } from "../../api/folder";
import { fetchFolder } from "../../api/folder";
import type { IAssignmentPlan, INewsPlan, IQuizPlan } from "../../store/plan";
import type { InputQuiz } from "../../api/quiz";
import { fetchQuiz, updateQuiz } from "../../api/quiz";
import type { CreateNews, News } from "../../api/news";
import { createNews, updateNews } from "../../api/news";

const toRichTextInput = (rt: RichText): RichTextInput => {
  return {
    Type: "Html",
    Content: rt.Html,
  };
};

const applyAssignmentPlan = async (
  token: string,
  courseId: string,
  assignment: IAssignmentPlan,
): Promise<APIError | undefined> => {
  const folder = await fetchFolder(token, [courseId, assignment.id]);
  const inputFolder: InputFolder = {
    ...folder,
    Availability: {
      StartDate: new Date(assignment.start).toISOString(),
      EndDate: new Date(assignment.end).toISOString(),
    },
    DueDate: new Date(assignment.due).toISOString(),
    IsHidden: false,
    DisplayInCalendar: false,
    CustomInstructions: toRichTextInput(folder.CustomInstructions),
  };
  // We have to convert to RichTextInput for the API to not delete the assignment description.
  const prom = await updateFolder(token, courseId, assignment.id, inputFolder);
  if (prom.status !== StatusOK) {
    const text = await prom.text();
    return {
      title: prom.statusText,
      detail: text,
    };
  }
  return undefined;
};

const applyQuizPlan = async (
  token: string,
  courseId: string,
  qu: IQuizPlan,
): Promise<APIError | undefined> => {
  const quiz = await fetchQuiz(token, [courseId, qu.id]);
  const attempts = quiz.AttemptsAllowed.NumberOfAttemptsAllowed;
  const inputQuiz: InputQuiz = {
    ...quiz,
    StartDate: new Date(qu.start).toISOString(),
    DueDate: new Date(qu.due).toISOString(),
    EndDate: new Date(qu.end).toISOString(),
    IsActive: true,
    DisplayInCalendar: false,
    NumberOfAttemptsAllowed: attempts,
    Instructions: {
      Text: toRichTextInput(quiz.Instructions.Text),
      IsDisplayed: quiz.Instructions.IsDisplayed,
    },
    Description: {
      Text: toRichTextInput(quiz.Description.Text),
      IsDisplayed: quiz.Description.IsDisplayed,
    },

    Header: {
      Text: toRichTextInput(quiz.Header.Text),
      IsDisplayed: quiz.Header.IsDisplayed,
    },

    Footer: {
      Text: toRichTextInput(quiz.Footer.Text),
      IsDisplayed: quiz.Footer.IsDisplayed,
    },
  };

  const prom = await updateQuiz(token, courseId, qu.id, inputQuiz);
  if (prom.status !== StatusOK) {
    const text = await prom.text();
    return {
      title: prom.statusText,
      detail: text,
    };
  }
  return undefined;
};

const applyCreateNewsPlan = async (
  token: string,
  courseId: string,
  ne: INewsPlan,
): Promise<APIError | undefined> => {
  const createNewsPayload: CreateNews = {
    Body: {
      Text: "",
      Html: ne.content,
    },
    StartDate: new Date(ne.open).toISOString(),
    EndDate: new Date(ne.dismiss).toISOString(),
    Title: ne.name,
    IsPublished: true,
    IsAuthorInfoShown: false,
    IsGlobal: false,
    ShowOnlyInCourseOfferings: false,
    IsPinned: false,
  };
  const prom = await createNews(token, courseId, createNewsPayload);
  if (prom.status !== StatusOK) {
    const text = await prom.text();
    return {
      title: prom.statusText,
      detail: text,
    };
  }
  return undefined;
};

const applyUpdateNewsPlan = async (
  token: string,
  courseId: string,
  existing: News,
  ne: INewsPlan,
): Promise<APIError | undefined> => {
  const updateNewsPayload: CreateNews = {
    Body: {
      Text: "",
      Html: ne.content,
    },
    StartDate: new Date(ne.open).toISOString(),
    EndDate: new Date(ne.dismiss).toISOString(),
    Title: ne.name,
    IsPublished: true,
    IsAuthorInfoShown: false,
    IsGlobal: false,
    ShowOnlyInCourseOfferings: false,
    IsPinned: false,
  };
  await updateNews(token, courseId, existing.Id + "", updateNewsPayload);
  // this is not a mistake, the API doesn't return anything.
  return undefined;
};

const applyNewsPlan = async (
  token: string,
  courseId: string,
  allNews: News[],
  ne: INewsPlan,
): Promise<APIError | undefined> => {
  const existing = allNews.find((n) => n.Title === ne.name);
  if (!existing) return applyCreateNewsPlan(token, courseId, ne);
  else return applyUpdateNewsPlan(token, courseId, existing, ne);
};

interface ApplyArguments {
  setStarted: (b: boolean) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setComplete: Dispatch<SetStateAction<boolean>>;
}

export const apply = async ({
  setStarted,
  setTasks,
  setComplete,
}: ApplyArguments): Promise<void> => {
  const state = store.getState();
  const courseId = state.currentCourse.course.data?.Identifier;
  if (courseId === undefined) return;
  const token = state.token.value;
  const { plan } = state;
  const news = state.currentCourse.news.data;
  if (!news) return;

  setStarted(true);

  for (const assignment of plan.assignments) {
    setTasks((t) => [
      ...t,
      { name: assignment.name, type: TaskType.ASSIGNMENT, loading: true },
    ]);
    const error = await applyAssignmentPlan(token, courseId, assignment);
    setTasks((t) => [
      ...t.slice(0, t.length - 1),
      { ...t[t.length - 1], loading: false, error },
    ]);
  }

  for (const qu of plan.quizzes) {
    setTasks((t) => [
      ...t,
      { name: qu.name, type: TaskType.QUIZ, loading: true },
    ]);
    const error = await applyQuizPlan(token, courseId, qu);
    setTasks((t) => [
      ...t.slice(0, t.length - 1),
      { ...t[t.length - 1], loading: false, error },
    ]);
  }

  for (const ne of plan.news) {
    setTasks((t) => [
      ...t,
      { name: ne.name, type: TaskType.QUIZ, loading: true },
    ]);
    const error = await applyNewsPlan(token, courseId, news, ne);
    setTasks((t) => [
      ...t.slice(0, t.length - 1),
      { ...t[t.length - 1], loading: false, error },
    ]);
  }
  setComplete(true);
};
