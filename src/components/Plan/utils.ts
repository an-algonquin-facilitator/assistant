import dayjs from "dayjs";
import type {
  Assignment,
  DateOffset,
  News as TNews,
  Quiz as TQuiz,
  Template,
} from "../../store/template";
import { Holidays } from "../../holidays";
import type {
  IAssignmentPlan,
  ICoursePlan,
  INewsPlan,
  IQuizPlan,
} from "../../store/plan";
import type { Course, Folder, Quiz as BQuiz } from "../../api/api";
import { isDefined } from "../Introduction/utils";
import Mustache from "mustache";

export const calculateDate = (
  start: number,
  offset: DateOffset,
  startOfDay: boolean,
) => {
  let d = dayjs(start);
  if (offset.weeks) d = d.add(offset.weeks, "week");
  if (offset.days) d = d.add(offset.days, "day");
  if (startOfDay) d = d.startOf("day").add(1, "minute");
  else d = d.startOf("day").add(23, "hour").add(59, "minute");
  return d.unix() * 1000;
};

export enum TargetDateType {
  START,
  END,
}

export const calculateDateWithHoliday = (
  start: number,
  offset: DateOffset,
  targetDateType: TargetDateType,
) => {
  let d = dayjs(start);
  if (offset.weeks) d = d.add(offset.weeks, "week");
  if (offset.days) d = d.add(offset.days, "day");
  let holidayOffset = 0;
  while (Holidays.includes(d.format("YYYY-MM-DD"))) {
    holidayOffset++;
    d = d.add(1, "day");
  }
  if (targetDateType === TargetDateType.START)
    d = d.startOf("day").add(1, "minute");
  else if (targetDateType === TargetDateType.END)
    d = d.startOf("day").add(23, "hour").add(59, "minute");
  return [d.unix() * 1000, holidayOffset];
};

const createMustacheView = (
  assignments: IAssignmentPlan[],
  quizzes: IQuizPlan[],
) => {
  const createDateObject = (date: number) => ({
    iso8601: new Date(date).toISOString(),
    date: new Date(date).toDateString(),
  });
  return {
    assignments: Object.fromEntries(
      assignments
        .filter((a) => a.templateId)
        .map((a) => [
          a.templateId,
          {
            name: a.name,
            start: createDateObject(a.start),
            due: createDateObject(a.due),
            end: createDateObject(a.end),
          },
        ]) || [],
    ),
    quizzes: Object.fromEntries(
      quizzes
        .filter((q) => q.templateId)
        .map((q) => [
          q.templateId,
          {
            name: q.name,
            start: createDateObject(q.start),
            due: createDateObject(q.due),
            end: createDateObject(q.end),
          },
        ]) || [],
    ),
  };
};

const assignmentTemplateToPlan = (
  startDateUnixMS: number,
  folders: Folder[],
  assignment: Assignment,
): IAssignmentPlan | undefined => {
  const a = assignment;
  const f = folders.find((f) => f.Name === a.name);
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
    end: calculateDate(startDateUnixMS, a.end ?? defaultEndOffset, false),

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
): IQuizPlan | undefined => {
  const q = quiz;
  const bQ = quizzes.find((b) => b.Name === q.name);
  if (!bQ) return;
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
    end: calculateDate(startDateUnixMS, q.end ?? defaultEndOffset, false),

    holidayOffset: due[1],
    startOffset: q.start ?? {},
    dueOffset: q.due,
    endOffset: q.end ?? defaultEndOffset,
  };
};

interface MustacheView {
  assignments: any;
  quizzes: any;
}

const newsTemplateToPlan = (
  startDateUnixMS: number,
  news: TNews,
  view: MustacheView,
): INewsPlan => {
  const n = news;
  const defaultOpenOffset = {
    days: n.start?.days ?? 0,
    weeks: n.start?.weeks ?? 0,
  };

  const defaultDismissOffset = {
    days: n.start?.days ?? 0,
    weeks: (n.start?.weeks ?? 0) + 2,
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

export const processTemplate = (
  template: Template,
  course: Course,
  quizzes: BQuiz[],
  folders: Folder[],
): ICoursePlan => {
  const startDateUnixMS = dayjs(course.StartDate).unix() * 1000;
  const ass = template.assignments ?? [];
  const qu = template.quizzes ?? [];
  const ne = template.news ?? [];

  const plannedQuizzes = qu
    .map((q) => quizTemplateToPlan(startDateUnixMS, quizzes, q))
    .filter(isDefined);

  const plannedAssignments = ass
    .map((a) => assignmentTemplateToPlan(startDateUnixMS, folders, a))
    .filter(isDefined);

  const mustacheView = createMustacheView(plannedAssignments, plannedQuizzes);

  const plannedNews = ne.map((n) =>
    newsTemplateToPlan(startDateUnixMS, n, mustacheView),
  );

  return {
    news: plannedNews,
    quizzes: plannedQuizzes,
    assignments: plannedAssignments,
  };
};
