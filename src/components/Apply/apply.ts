import { store } from "../../store/store";
import type { RichText, RichTextInput } from "../../api/api";
import { StatusOK } from "../../api/api";
import type { InputFolder } from "../../api/folder";
import { updateFolder } from "../../api/folder";
import { fetchFolder } from "../../api/folder";
import type { AssignmentPlan, NewsPlan, QuizPlan } from "../../store/plan";
import type { InputQuiz } from "../../api/quiz";
import { fetchQuiz, updateQuiz } from "../../api/quiz";
import type { CreateNews, News } from "../../api/news";
import { createNews, updateNews } from "../../api/news";
import {
  startTask,
  taskFailed,
  taskSuccess,
  TaskType,
  type APIError,
} from "../../store/apply";
import type { useAppDispatch } from "../../store/hooks";

const toRichTextInput = (rt: RichText): RichTextInput => {
  return {
    Type: "Html",
    Content: rt.Html,
  };
};

const applyAssignmentPlan = async (
  token: string,
  courseId: string,
  assignment: AssignmentPlan,
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
  qu: QuizPlan,
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
  ne: NewsPlan,
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
  ne: NewsPlan,
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
  ne: NewsPlan,
): Promise<APIError | undefined> => {
  const existing = allNews.find((n) => n.Title === ne.name);
  if (!existing) return applyCreateNewsPlan(token, courseId, ne);
  else return applyUpdateNewsPlan(token, courseId, existing, ne);
};

export const apply = async (
  dispatch: ReturnType<typeof useAppDispatch>,
): Promise<void> => {
  const state = store.getState();
  const courseId = state.template.course.course.Identifier;
  const token = state.token.value;
  const { plan } = state;
  const { news } = state.template.course;

  for (const assignment of plan.assignments) {
    const task = { name: assignment.name, type: TaskType.ASSIGNMENT };
    dispatch(startTask(task));
    const error = await applyAssignmentPlan(token, courseId, assignment);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }

  for (const qu of plan.quizzes) {
    const task = { name: qu.name, type: TaskType.QUIZ };
    dispatch(startTask(task));
    const error = await applyQuizPlan(token, courseId, qu);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }

  for (const ne of plan.news) {
    const task = { name: ne.name, type: TaskType.QUIZ };
    dispatch(startTask(task));
    const error = await applyNewsPlan(token, courseId, news, ne);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }
};
