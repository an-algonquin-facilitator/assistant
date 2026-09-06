import dayjs from "dayjs";
import type {
  AssignmentTemplate,
  DateOffset,
  NewsTemplate as TNews,
  QuizTemplate as TQuiz,
  DiscussionTemplate as TDiscussion,
  AgentTemplate as TAgent,
  AgentScheduleTemplate,
  AgentScheduleType,
  AgentDropboxConditionType,
  AgentQuizConditionType,
  AgentConditionTemplate,
  CourseTemplate,
  SelectedCourse,
} from "../../store/template";
import { parseTime } from "../../store/templateValidation";
import type { AgentData, ScheduleData } from "../../api/agent";
import {
  AccessConditionType,
  ActionRepeatType,
  EnrollmentType,
  LoginConditionType,
  ScheduleType,
} from "../../api/agent";
import type {
  ConditionsData,
  ReleaseConditionData,
} from "../../api/releaseConditions";
import { isHoliday } from "../../holidays";
import type {
  AgentPlan,
  AssignmentPlan,
  CoursePlan,
  DiscussionPlan,
  NewsPlan,
  QuizPlan,
} from "../../store/plan";
import type { Quiz as BQuiz } from "../../api/quiz";
import type { Folder } from "../../api/folder";
import type { Topic } from "../../api/discussion";
import { isDefined } from "../Introduction/utils";
import Mustache from "mustache";

const dayLastHour = 23;
const dayLastMinute = 59;
const msPerSecond = 1000;
const msPerDay = 86400000;

const calculateDate = (
  start: number,
  offset: DateOffset,
  startOfDay: boolean,
): number => {
  let d = dayjs(start);
  if (offset.weeks != null) d = d.add(offset.weeks, "week");
  if (offset.days != null) d = d.add(offset.days, "day");
  if (startOfDay) d = d.startOf("day").add(1, "minute");
  else
    d = d.startOf("day").add(dayLastHour, "hour").add(dayLastMinute, "minute");
  return d.unix() * msPerSecond;
};

enum TargetDateType {
  START = "START",
  END = "END",
}

const calculateDateWithHoliday = (
  start: number,
  offset: DateOffset,
  targetDateType: TargetDateType,
): [number, number] => {
  let d = dayjs(start);
  if (offset.weeks != null) d = d.add(offset.weeks, "week");
  if (offset.days != null) d = d.add(offset.days, "day");
  let holidayOffset = 0;
  while (isHoliday(d.format("YYYY-MM-DD"))) {
    holidayOffset++;
    d = d.add(1, "day");
  }
  if (targetDateType === TargetDateType.START)
    d = d.startOf("day").add(1, "minute");
  else
    d = d.startOf("day").add(dayLastHour, "hour").add(dayLastMinute, "minute");
  return [d.unix() * msPerSecond, holidayOffset];
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const createMustacheView = (
  assignments: AssignmentPlan[],
  quizzes: QuizPlan[],
  discussions: DiscussionPlan[],
): MustacheView => {
  const createDateObject = (date: number): MustacheDate => {
    const d = new Date(date);
    const shortLength = 3;
    return {
      monthDate: d.getDate(),
      month: months[d.getMonth()],
      monthShort: months[d.getMonth()].slice(0, shortLength),
      weekDays: weekDays[d.getDay()],
      weekDaysShort: weekDays[d.getDay()].slice(0, shortLength),
      year: d.getFullYear(),
      iso8601: d.toISOString(),
      date: d.toDateString(),
    };
  };

  const createMustacheEvent = (
    e: AssignmentPlan | QuizPlan | DiscussionPlan,
  ): MustacheEvent => {
    return {
      name: e.name,
      start: createDateObject(e.start),
      due: createDateObject(e.due),
      end: createDateObject(e.end),
    };
  };

  const assignmentEntries = assignments
    .filter((a) => a.templateId)
    .map((a): [string, MustacheEvent] => [
      a.templateId ?? "BUG",
      createMustacheEvent(a),
    ]);

  const quizEntries = quizzes
    .filter((q) => q.templateId)
    .map((q): [string, MustacheEvent] => [
      q.templateId ?? "BUG",
      createMustacheEvent(q),
    ]);

  const discussionEntries = discussions
    .filter((d) => d.templateId)
    .map((d): [string, MustacheEvent] => [
      d.templateId ?? "BUG",
      createMustacheEvent(d),
    ]);

  return {
    assignments: Object.fromEntries(assignmentEntries),
    quizzes: Object.fromEntries(quizEntries),
    discussions: Object.fromEntries(discussionEntries),
  };
};

const assignmentTemplateToPlan = (
  startDateUnixMS: number,
  folders: Folder[],
  assignment: AssignmentTemplate,
): AssignmentPlan | undefined => {
  const a = assignment;
  const f = folders.find((fo) => fo.Name === a.name);
  if (!f) return undefined;
  const defaultEndOffset = {
    days: a.due.days ?? 0,
    weeks: (a.due.weeks ?? 0) + 1,
  };
  const due = calculateDateWithHoliday(
    startDateUnixMS,
    a.due,
    TargetDateType.END,
  );

  return {
    id: f.Id + "",
    templateId: a.id,
    name: f.Name,
    start: calculateDate(startDateUnixMS, a.start ?? {}, true),
    due: due[0],
    end:
      calculateDate(startDateUnixMS, a.end ?? defaultEndOffset, false) +
      due[1] * msPerDay,

    holidayOffset: due[1],
    startOffset: a.start ?? {},
    dueOffset: a.due,
    endOffset: a.end ?? defaultEndOffset,
  };
};

const quizTemplateToPlan = (
  startDateUnixMS: number,
  quizzes: BQuiz[],
  quiz: TQuiz,
): QuizPlan | undefined => {
  const q = quiz;
  const bQ = quizzes.find((b) => b.Name === q.name);
  if (!bQ) return undefined;
  const defaultEndOffset = {
    days: q.due.days ?? 0,
    weeks: (q.due.weeks ?? 0) + 1,
  };
  const due = calculateDateWithHoliday(
    startDateUnixMS,
    q.due,
    TargetDateType.END,
  );
  return {
    id: bQ.QuizId + "",
    templateId: q.id,
    name: bQ.Name,
    start: calculateDate(startDateUnixMS, q.start ?? {}, true),
    due: due[0],
    end:
      calculateDate(startDateUnixMS, q.end ?? defaultEndOffset, false) +
      due[1] * msPerDay,

    holidayOffset: due[1],
    startOffset: q.start ?? {},
    dueOffset: q.due,
    endOffset: q.end ?? defaultEndOffset,
  };
};

const discussionTemplateToPlan = (
  startDateUnixMS: number,
  topics: Topic[],
  discussion: TDiscussion,
): DiscussionPlan | undefined => {
  const d = discussion;
  const topic = topics.find((t) => t.Name === d.name);
  if (!topic) return undefined;
  const defaultEndOffset = {
    days: d.due.days ?? 0,
    weeks: (d.due.weeks ?? 0) + 1,
  };
  const due = calculateDateWithHoliday(
    startDateUnixMS,
    d.due,
    TargetDateType.END,
  );
  return {
    id: topic.TopicId + "",
    forumId: topic.ForumId + "",
    templateId: d.id,
    name: topic.Name,
    start: calculateDate(startDateUnixMS, d.start ?? {}, true),
    due: due[0],
    end:
      calculateDate(startDateUnixMS, d.end ?? defaultEndOffset, false) +
      due[1] * msPerDay,

    holidayOffset: due[1],
    startOffset: d.start ?? {},
    dueOffset: d.due,
    endOffset: d.end ?? defaultEndOffset,
  };
};

interface MustacheView {
  assignments: Record<string, MustacheEvent>;
  quizzes: Record<string, MustacheEvent>;
  discussions: Record<string, MustacheEvent>;
}

interface MustacheDate {
  year: number;
  monthDate: number;
  month: string;
  monthShort: string;
  weekDays: string;
  weekDaysShort: string;
  iso8601: string;
  date: string;
}

interface MustacheEvent {
  name: string;
  start: MustacheDate;
  due: MustacheDate;
  end: MustacheDate;
}

const newsTemplateToPlan = (
  startDateUnixMS: number,
  news: TNews,
  view: MustacheView,
): NewsPlan => {
  const n = news;
  const defaultOpenOffset = {
    days: n.start?.days ?? 0,
    weeks: n.start?.weeks ?? 0,
  };

  const defaultWeekOffset = 2;
  const defaultDismissOffset = {
    days: n.start?.days ?? 0,
    weeks: (n.start?.weeks ?? 0) + defaultWeekOffset,
  };
  return {
    name: n.name,
    content: Mustache.render(n.content, view),
    open: calculateDate(startDateUnixMS, n.start ?? defaultOpenOffset, true),
    openOffset: defaultOpenOffset,
    dismiss: calculateDate(
      startDateUnixMS,
      n.end ?? defaultDismissOffset,
      false,
    ),
    dismissOffset: n.end ?? defaultDismissOffset,
  };
};

const defaultAgentTime = { hour: 9, minute: 0 };

const scheduleTypeMap: Record<AgentScheduleType, ScheduleType> = {
  once: ScheduleType.OneTime,
  daily: ScheduleType.Daily,
  weekly: ScheduleType.Weekly,
  monthly: ScheduleType.Monthly,
};

interface BuiltSchedule {
  data: ScheduleData | null;
  summary: string;
  start?: number;
  end?: number;
}

const buildAgentSchedule = (
  startDateUnixMS: number,
  schedule: AgentScheduleTemplate | undefined,
): BuiltSchedule => {
  if (!schedule) return { data: null, summary: "No schedule (run manually)" };
  const time =
    (schedule.time === undefined ? undefined : parseTime(schedule.time)) ??
    defaultAgentTime;
  const start =
    dayjs(calculateDate(startDateUnixMS, schedule.start, true))
      .startOf("day")
      .add(time.hour, "hour")
      .add(time.minute, "minute")
      .unix() * msPerSecond;
  const once = schedule.type === "once";
  const end =
    !once && schedule.end
      ? calculateDate(startDateUnixMS, schedule.end, false)
      : undefined;
  const every = schedule.every ?? 1;
  const summary = once
    ? "Once"
    : `${schedule.type} (every ${every})${end === undefined ? "" : " until " + new Date(end).toDateString()}`;
  return {
    start,
    end,
    summary,
    data: {
      IsEnabled: true,
      Type: scheduleTypeMap[schedule.type],
      StartDate: new Date(start).toISOString(),
      EndDate: end === undefined ? null : new Date(end).toISOString(),
      RepeatsEvery: once ? null : every,
      RepeatsOnDay: null,
      RepeatsOnDays: schedule.onDays ?? null,
      RepeatsOnMonth: null,
      ScheduledTimeHour: time.hour,
      ScheduledTimeMinute: time.minute,
    },
  };
};

const dropboxConditionType: Record<AgentDropboxConditionType, string> = {
  submittedToDropbox: "SubmitsToDropbox",
  notSubmittedToDropbox: "NotSubmittedToDropbox",
  receivesFeedback: "ReceivesFeedback",
};

const dropboxConditionText: Record<AgentDropboxConditionType, string> = {
  submittedToDropbox: "Has submitted to folder",
  notSubmittedToDropbox: "Has not submitted to folder",
  receivesFeedback: "Has received feedback on folder",
};

const quizConditionType: Record<AgentQuizConditionType, string> = {
  submitsQuizAttempt: "SubmitsQuizAttempt",
  notSubmittedQuizAttempt: "NotSubmittedQuizAttempt",
};

const quizConditionText: Record<AgentQuizConditionType, string> = {
  submitsQuizAttempt: "Has submitted an attempt on quiz",
  notSubmittedQuizAttempt: "Has not submitted an attempt on quiz",
};

interface BuiltCondition {
  operand: ReleaseConditionData;
  summary: string;
}

const buildAgentCondition = (
  template: CourseTemplate,
  course: SelectedCourse,
  item: AgentConditionTemplate,
): BuiltCondition | undefined => {
  if ("assignment" in item) {
    const a = template.assignments?.find((x) => x.id === item.assignment);
    const folder = course.folders.find((f) => f.Name === a?.name);
    if (!folder) return undefined;
    const type = dropboxConditionType[item.type];
    return {
      operand: {
        Type: type,
        State: null,
        [`${type}Params`]: { FolderId: folder.Id },
      },
      summary: `${dropboxConditionText[item.type]} "${folder.Name}" (${folder.Id})`,
    };
  }
  if ("quiz" in item) {
    const q = template.quizzes?.find((x) => x.id === item.quiz);
    const quiz = course.quizzes.find((b) => b.Name === q?.name);
    if (!quiz) return undefined;
    const type = quizConditionType[item.type];
    const params =
      item.type === "submitsQuizAttempt"
        ? { QuizId: quiz.QuizId, NumberOfAttempts: item.attempts ?? 1 }
        : { QuizId: quiz.QuizId };
    return {
      operand: { Type: type, State: null, [`${type}Params`]: params },
      summary: `${quizConditionText[item.type]} "${quiz.Name}" (${quiz.QuizId})`,
    };
  }
  const { Type: rawType } = item.raw;
  if (typeof rawType !== "string") return undefined;
  return {
    operand: { ...item.raw, Type: rawType, State: null },
    summary: `Raw condition "${rawType}"`,
  };
};

// Mustache escapes HTML by default which would turn "/" in an assignment name
// into "&#x2F;", fine in an HTML body but wrong in a plain text subject.
const renderPlain = (template: string, view: MustacheView): string =>
  Mustache.render(template, view, {}, { escape: (v: unknown) => String(v) });

const agentTemplateToPlan = (
  startDateUnixMS: number,
  template: CourseTemplate,
  course: SelectedCourse,
  agent: TAgent,
  view: MustacheView,
): AgentPlan | undefined => {
  const existing = course.agents.find((a) => a.Name === agent.name);

  const roleIds: number[] = [...(agent.roleIds ?? [])];
  const roleSummaries: string[] = roleIds.map((id) => `role id ${id}`);
  for (const name of agent.roles ?? []) {
    const role = course.roles.find((r) => r.name === name);
    if (!role) return undefined;
    roleIds.push(role.id);
    roleSummaries.push(`${role.name} (${role.id})`);
  }

  const built: BuiltCondition[] = [];
  for (const item of agent.conditions?.items ?? []) {
    const b = buildAgentCondition(template, course, item);
    if (!b) return undefined;
    built.push(b);
  }
  const conditions: ConditionsData | undefined =
    agent.conditions === undefined
      ? undefined
      : {
          Expression: {
            Type: "Expression",
            State: null,
            ExpressionParams: {
              Operator: agent.conditions.operator === "any" ? "Any" : "All",
              Operands: built.map((b) => b.operand),
            },
          },
        };

  const schedule = buildAgentSchedule(startDateUnixMS, agent.schedule);
  const email = agent.action?.email;
  const enrollment = agent.action?.enrollment;
  const { criteria } = agent;

  const agentData: AgentData = {
    AgentId: existing?.AgentId ?? null,
    Name: agent.name,
    Description: agent.description ?? "",
    IsEnabled: agent.enabled ?? true,
    Schedule: schedule.data,
    Action: {
      RepeatType:
        agent.action?.repeat === "everyTime"
          ? ActionRepeatType.EveryTime
          : ActionRepeatType.FirstTimeOnly,
      EmailAction: email
        ? {
            IsEnabled: true,
            To: email.to,
            Cc: email.cc ?? null,
            Bcc: email.bcc ?? null,
            Subject: renderPlain(email.subject, view),
            Message: Mustache.render(email.message, view),
            IsHtml: true,
          }
        : null,
      EnrollmentAction: enrollment
        ? {
            IsEnabled: true,
            EnrollmentType:
              enrollment.type === "enroll"
                ? EnrollmentType.Enroll
                : EnrollmentType.Unenroll,
            OrgUnitId: enrollment.orgUnitId,
            RoleId: enrollment.roleId,
          }
        : null,
    },
    Condition: {
      LoginActivity: criteria?.loginActivity
        ? {
            Type:
              criteria.loginActivity.type === "loggedIn"
                ? LoginConditionType.HasLoggedIn
                : LoginConditionType.HasNotLoggedIn,
            Days: criteria.loginActivity.days,
          }
        : null,
      CourseActivity: criteria?.courseActivity
        ? {
            Type:
              criteria.courseActivity.type === "accessed"
                ? AccessConditionType.HasAccessed
                : AccessConditionType.HasNotAccessed,
            Days: criteria.courseActivity.days,
          }
        : null,
      ReleaseCondition: existing?.Condition?.ReleaseCondition ?? null,
      RoleIds: roleIds.length > 0 ? roleIds : null,
    },
    LastRunDate: null,
    NextRunDate: null,
    CategoryId: existing?.CategoryId ?? null,
  };

  return {
    name: agent.name,
    existingId: existing?.AgentId == null ? undefined : existing.AgentId + "",
    agentData,
    conditions,
    conditionSummaries: built.map((b) => b.summary),
    roleSummaries,
    scheduleSummary: schedule.summary,
    scheduleStart: schedule.start,
    scheduleStartOffset: agent.schedule?.start,
    scheduleEnd: schedule.end,
    scheduleEndOffset: agent.schedule?.end,
  };
};

export const processTemplate = (
  template: CourseTemplate,
  selectedCourse: SelectedCourse,
): CoursePlan => {
  const { course, folders, quizzes, topics } = selectedCourse;
  const startDateUnixMS = dayjs(course.StartDate).unix() * msPerSecond;
  const ass = template.assignments ?? [];
  const qu = template.quizzes ?? [];
  const di = template.discussions ?? [];
  const ag = template.agents ?? [];
  const ne = template.news ?? [];

  const plannedQuizzes = qu
    .map((q) => quizTemplateToPlan(startDateUnixMS, quizzes, q))
    .filter(isDefined);

  const plannedAssignments = ass
    .map((a) => assignmentTemplateToPlan(startDateUnixMS, folders, a))
    .filter(isDefined);

  const plannedDiscussions = di
    .map((d) => discussionTemplateToPlan(startDateUnixMS, topics, d))
    .filter(isDefined);

  const mustacheView = createMustacheView(
    plannedAssignments,
    plannedQuizzes,
    plannedDiscussions,
  );

  const plannedNews = ne.map((n) =>
    newsTemplateToPlan(startDateUnixMS, n, mustacheView),
  );

  const plannedAgents = ag
    .map((a) =>
      agentTemplateToPlan(
        startDateUnixMS,
        template,
        selectedCourse,
        a,
        mustacheView,
      ),
    )
    .filter(isDefined);

  return {
    news: plannedNews,
    quizzes: plannedQuizzes,
    discussions: plannedDiscussions,
    agents: plannedAgents,
    assignments: plannedAssignments,
  };
};
