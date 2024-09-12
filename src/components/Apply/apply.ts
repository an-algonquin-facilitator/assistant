import { Dispatch, SetStateAction } from "react";
import { APIError, Task, TaskType } from "./Task";

import { store } from "../../store/store";
import {
  CreateNews,
  News,
  RichText,
  RichTextInput,
  createNews,
  fetchFolder,
  fetchNews,
  fetchQuiz,
  updateFolder,
  updateNews,
  updateQuiz,
} from "../../api/api";
import { IAssignmentPlan, INewsPlan, IQuizPlan } from "../../store/plan";

const toRichTextInput = (rt: RichText): RichTextInput => {
  return {
    Type: "Html",
    Content: rt.Html,
  };
};

const applyAssignmentPlan = async (
  token: string,
  courseId: string,
  assignment: IAssignmentPlan
): Promise<APIError | undefined> => {
  const folder = await fetchFolder(token, [courseId, assignment.id]);
  if (!folder.Availability) {
    folder.Availability = {
      StartDate: "",
      EndDate: "",
    };
  }
  folder.Availability.StartDate = new Date(assignment.start).toISOString();
  folder.DueDate = new Date(assignment.due).toISOString();
  folder.Availability.EndDate = new Date(assignment.end).toISOString();
  folder.IsHidden = false;
  folder.DisplayInCalendar = false;
  // We have to convert to RichTextInput for the API to not delete the assignment description.
  (folder as any).CustomInstructions = toRichTextInput(
    folder.CustomInstructions
  );
  const prom = await updateFolder(token, courseId, assignment.id, folder);
  const resp = await prom.json();
  const error =
    resp.status === 400
      ? { title: resp.title, detail: resp.detail }
      : undefined;
  return error;
};

const applyQuizPlan = async (
  token: string,
  courseId: string,
  qu: IQuizPlan
): Promise<APIError | undefined> => {
  const quiz = await fetchQuiz(token, [courseId, qu.id]);

  quiz.StartDate = new Date(qu.start).toISOString();
  quiz.DueDate = new Date(qu.due).toISOString();
  quiz.EndDate = new Date(qu.end).toISOString();
  quiz.IsActive = true;
  quiz.DisplayInCalendar = false;
  {
    // The body for a PUT request is a little different. Seems like a bug tbh.
    const attempts = quiz.AttemptsAllowed.NumberOfAttemptsAllowed;
    const aQuiz = quiz as any;
    delete aQuiz.QuizId;
    delete aQuiz.AttemptsAllowed;
    delete aQuiz.ActivityId;
    aQuiz.NumberOfAttemptsAllowed = attempts;
    aQuiz.Instructions.Text = toRichTextInput(quiz.Instructions.Text);
    aQuiz.Description.Text = toRichTextInput(quiz.Description.Text);
    aQuiz.Header.Text = toRichTextInput(quiz.Header.Text);
    aQuiz.Footer.Text = toRichTextInput(quiz.Footer.Text);
  }

  const prom = await updateQuiz(token, courseId, qu.id, quiz);
  const resp = await prom.json();
  const error =
    resp.status === 400
      ? { title: resp.title, detail: resp.detail }
      : undefined;
  return error;
};

const applyCreateNewsPlan = async (
  token: string,
  courseId: string,
  ne: INewsPlan
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
  const resp = await prom.json();
  const error =
    resp.status === 400
      ? { title: resp.title, detail: resp.detail }
      : undefined;
  return error;
};

const applyUpdateNewsPlan = async (
  token: string,
  courseId: string,
  existing: News,
  ne: INewsPlan
): Promise<APIError | undefined> => {
  const bNews = await fetchNews(token, [courseId, existing.Id + ""]);
  {
    const aNews = bNews as any;
    aNews.Body = { Text: "", Html: ne.content };
    delete aNews.Id;
    delete aNews.IsHidden;
    delete aNews.Attachments;
    delete aNews.CreatedBy;
    delete aNews.CreatedDate;
    delete aNews.LastModifiedBy;
    delete aNews.LastModifiedDate;
    delete aNews.IsStartDateShown;
    delete aNews.SortOrder;
  }
  bNews.IsPublished = true;
  bNews.IsAuthorInfoShown = false;
  bNews.StartDate = new Date(ne.open).toISOString();
  bNews.EndDate = new Date(ne.dismiss).toISOString();
  await updateNews(token, courseId, existing.Id + "", bNews);
  // this is not a mistake, the API doesn't return anything.
  return undefined;
};

const applyNewsPlan = async (
  token: string,
  courseId: string,
  allNews: News[],
  ne: INewsPlan
): Promise<APIError | undefined> => {
  const existing = allNews.find((n) => n.Title === ne.name);
  if (!existing) return applyCreateNewsPlan(token, courseId, ne);
  else return applyUpdateNewsPlan(token, courseId, existing, ne);
};

interface ApplyArguments {
  setStarted(b: boolean): void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setComplete: Dispatch<SetStateAction<boolean>>;
}

export const apply = async ({
  setStarted,
  setTasks,
  setComplete,
}: ApplyArguments) => {
  const state = store.getState();
  const courseId = state.currentCourse.course.data?.Identifier;
  if (courseId === undefined) return;
  const token = state.token.value;
  const plan = state.plan;
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
