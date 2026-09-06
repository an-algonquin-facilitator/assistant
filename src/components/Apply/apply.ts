import { store } from "../../store/store";
import type { RichText, RichTextInput } from "../../api/api";
import { StatusOK } from "../../api/api";
import type { InputFolder } from "../../api/folder";
import { updateFolder } from "../../api/folder";
import { fetchFolder } from "../../api/folder";
import type {
  AgentPlan,
  AssignmentPlan,
  DiscussionPlan,
  NewsPlan,
  QuizPlan,
} from "../../store/plan";
import type { AgentData } from "../../api/agent";
import { createAgent, updateAgent } from "../../api/agent";
import type { ConditionsData } from "../../api/releaseConditions";
import {
  fetchConditions,
  intelligentAgentsTarget,
  putConditions,
} from "../../api/releaseConditions";
import type { InputQuiz } from "../../api/quiz";
import { fetchQuiz, updateQuiz } from "../../api/quiz";
import type { InputTopic } from "../../api/discussion";
import { fetchTopic, updateTopic } from "../../api/discussion";
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

// Converts a RichText we received into the RichTextInput the API expects on
// PUT. Prefer the Html form, but fall back to the Text form when D2L only
// returned plain text so we never send back an empty description.
const toRichTextInput = (rt: RichText): RichTextInput => {
  if (rt.Html !== null && rt.Html !== "") {
    return {
      Type: "Html",
      Content: rt.Html,
    };
  }
  return {
    Type: "Text",
    Content: rt.Text,
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

const applyDiscussionPlan = async (
  token: string,
  courseId: string,
  di: DiscussionPlan,
): Promise<APIError | undefined> => {
  const topic = await fetchTopic(token, [courseId, di.forumId, di.id]);
  // The PUT replaces the whole topic, so send back everything we fetched and
  // only override the dates. Availability types are kept as they are so the
  // topic keeps behaving the same way outside of its availability window.
  const inputTopic: InputTopic = {
    ...topic,
    StartDate: new Date(di.start).toISOString(),
    DueDate: new Date(di.due).toISOString(),
    EndDate: new Date(di.end).toISOString(),
    IsHidden: false,
    DisplayInCalendar: false,
    DisplayUnlockDatesInCalendar: false,
    // We have to convert to RichTextInput for the API to not delete the topic description.
    Description: toRichTextInput(topic.Description),
  };

  const prom = await updateTopic(
    token,
    courseId,
    di.forumId,
    di.id,
    inputTopic,
  );
  if (prom.status !== StatusOK) {
    const text = await prom.text();
    return {
      title: prom.statusText,
      detail: text,
    };
  }
  return undefined;
};

const responseError = async (
  resp: Response,
  prefix = "",
): Promise<APIError> => ({
  title: prefix + resp.statusText,
  detail: await resp.text(),
});

// Creates the agent (or updates the one with the same name), then replaces
// its release conditions. Two calls because conditions are a separate
// resource keyed on the agent id.
const applyAgentPlan = async (
  token: string,
  courseId: string,
  ag: AgentPlan,
): Promise<APIError | undefined> => {
  const resp =
    ag.existingId === undefined
      ? await createAgent(token, courseId, ag.agentData)
      : await updateAgent(token, courseId, ag.existingId, ag.agentData);
  if (!resp.ok) return responseError(resp);

  const text = await resp.text();
  let agentId = ag.existingId;
  try {
    const data = JSON.parse(text) as Partial<AgentData>;
    if (data.AgentId !== null && data.AgentId !== undefined) {
      agentId = data.AgentId + "";
    }
  } catch {
    // The body is not JSON, fall back on the existing id below.
  }
  if (agentId === undefined) {
    return {
      title: "Agent saved but Brightspace did not return its id",
      detail: text,
    };
  }
  if (!ag.conditions) return undefined;

  // Echo the opaque State of the current expression when there is one.
  let state: string | null = null;
  try {
    const current = (await fetchConditions(token, [
      courseId,
      intelligentAgentsTarget,
      agentId,
    ])) as Partial<ConditionsData>;
    state = current.Expression?.State ?? null;
  } catch {
    state = null;
  }
  const body: ConditionsData = {
    Expression: { ...ag.conditions.Expression, State: state },
  };
  const cResp = await putConditions(
    token,
    courseId,
    intelligentAgentsTarget,
    agentId,
    body,
  );
  if (!cResp.ok) {
    return responseError(cResp, "Agent saved but release conditions failed: ");
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

  for (const di of plan.discussions) {
    const task = { name: di.name, type: TaskType.DISCUSSION };
    dispatch(startTask(task));
    const error = await applyDiscussionPlan(token, courseId, di);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }

  for (const ag of plan.agents) {
    const task = { name: ag.name, type: TaskType.AGENT };
    dispatch(startTask(task));
    const error = await applyAgentPlan(token, courseId, ag);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }

  for (const ne of plan.news) {
    const task = { name: ne.name, type: TaskType.NEWS };
    dispatch(startTask(task));
    const error = await applyNewsPlan(token, courseId, news, ne);
    if (error) {
      dispatch(taskFailed({ ...task, error }));
    } else {
      dispatch(taskSuccess(task));
    }
  }
};
