import dayjs from "dayjs";
import type {
  AssignmentTemplate,
  DateOffset,
  NewsTemplate as TNews,
  QuizTemplate as TQuiz,
  CourseTemplate,
} from "../../store/template";
import { isHoliday } from "../../holidays";
import type {
  AssignmentPlan,
  CoursePlan,
  NewsPlan,
  QuizPlan,
} from "../../store/plan";
import type { Quiz as BQuiz } from "../../api/quiz";
import type { Folder } from "../../api/folder";
import { isDefined } from "../Introduction/utils";
import Mustache from "mustache";
import type { SelectedCourse } from "../../store/course";

const dayLastHour = 23;
const dayLastMinute = 59;
const msPerSecond = 1000;

export const calculateDate = (
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

export enum TargetDateType {
  START = "START",
  END = "END",
}

export const calculateDateWithHoliday = (
  start: number,
  offset: DateOffset,
  targetDateType: TargetDateType,
): [number, number] => {
  let d = dayjs(start);
  if (offset.weeks != null) d = d.add(offset.weeks, "week");
  if (offset.days != null) d = d.add(offset.days, "day");
  let holidayOffset = 0;
  while (isHoliday("YYYY-MM-DD")) {
    holidayOffset++;
    d = d.add(1, "day");
  }
  if (targetDateType === TargetDateType.START)
    d = d.startOf("day").add(1, "minute");
  else
    d = d.startOf("day").add(dayLastHour, "hour").add(dayLastMinute, "minute");
  return [d.unix() * msPerSecond, holidayOffset];
};

const createMustacheView = (
  assignments: AssignmentPlan[],
  quizzes: QuizPlan[],
): MustacheView => {
  const createDateObject = (date: number): MustacheDate => ({
    iso8601: new Date(date).toISOString(),
    date: new Date(date).toDateString(),
  });

  const createMustacheEvent = (e: AssignmentPlan | QuizPlan): MustacheEvent => {
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

  return {
    assignments: Object.fromEntries(assignmentEntries),
    quizzes: Object.fromEntries(quizEntries),
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
    end: calculateDate(startDateUnixMS, q.end ?? defaultEndOffset, false),

    holidayOffset: due[1],
    startOffset: q.start ?? {},
    dueOffset: q.due,
    endOffset: q.end ?? defaultEndOffset,
  };
};

interface MustacheView {
  assignments: Record<string, MustacheEvent>;
  quizzes: Record<string, MustacheEvent>;
}

interface MustacheDate {
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

export const processTemplate = (
  template: CourseTemplate,
  selectedCourse: SelectedCourse,
): CoursePlan => {
  const { course, folders, quizzes } = selectedCourse;
  const startDateUnixMS = dayjs(course.StartDate).unix() * msPerSecond;
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
