import * as t from "io-ts";
import type {
  DateOffset as TDateOffset,
  AssignmentTemplate as TAssignment,
  QuizTemplate as TQuiz,
  DiscussionTemplate as TDiscussion,
  AgentTemplate as TAgent,
  NewsTemplate as TNews,
  CourseTemplate as TTemplate,
} from "../../store/template";

const DateOffsetValidator = t.exact(
  t.partial(
    {
      weeks: t.number,
      days: t.number,
    },
    "DateOffset",
  ),
);

type DateOffset = t.TypeOf<typeof DateOffsetValidator>;

const AssignmentValidator = t.exact(
  t.intersection(
    [
      t.type({
        name: t.string,
        due: DateOffsetValidator,
      }),
      t.partial({
        id: t.string,
        start: DateOffsetValidator,
        end: DateOffsetValidator,
      }),
    ],
    "Assignment",
  ),
);

type Assignment = t.TypeOf<typeof AssignmentValidator>;

const QuizValidator = t.exact(
  t.intersection(
    [
      t.type({
        name: t.string,
        due: DateOffsetValidator,
      }),
      t.partial({
        id: t.string,
        start: DateOffsetValidator,
        end: DateOffsetValidator,
      }),
    ],
    "Quiz",
  ),
);

type Quiz = t.TypeOf<typeof QuizValidator>;

const DiscussionValidator = t.exact(
  t.intersection(
    [
      t.type({
        name: t.string,
        due: DateOffsetValidator,
      }),
      t.partial({
        id: t.string,
        start: DateOffsetValidator,
        end: DateOffsetValidator,
      }),
    ],
    "Discussion",
  ),
);

type Discussion = t.TypeOf<typeof DiscussionValidator>;

const AgentLoginActivityValidator = t.exact(
  t.type(
    {
      type: t.union([t.literal("notLoggedIn"), t.literal("loggedIn")]),
      days: t.number,
    },
    "AgentLoginActivity",
  ),
);

const AgentCourseActivityValidator = t.exact(
  t.type(
    {
      type: t.union([t.literal("notAccessed"), t.literal("accessed")]),
      days: t.number,
    },
    "AgentCourseActivity",
  ),
);

const AgentCriteriaValidator = t.exact(
  t.partial(
    {
      loginActivity: AgentLoginActivityValidator,
      courseActivity: AgentCourseActivityValidator,
    },
    "AgentCriteria",
  ),
);

const AgentDropboxConditionValidator = t.exact(
  t.type(
    {
      type: t.union([
        t.literal("submittedToDropbox"),
        t.literal("notSubmittedToDropbox"),
        t.literal("receivesFeedback"),
      ]),
      assignment: t.string,
    },
    "AgentDropboxCondition",
  ),
);

const AgentQuizConditionValidator = t.exact(
  t.intersection(
    [
      t.type({
        type: t.union([
          t.literal("submitsQuizAttempt"),
          t.literal("notSubmittedQuizAttempt"),
        ]),
        quiz: t.string,
      }),
      t.partial({
        attempts: t.number,
      }),
    ],
    "AgentQuizCondition",
  ),
);

const AgentRawConditionValidator = t.exact(
  t.type(
    {
      raw: t.UnknownRecord,
    },
    "AgentRawCondition",
  ),
);

const AgentConditionsValidator = t.exact(
  t.intersection(
    [
      t.type({
        items: t.array(
          t.union([
            AgentDropboxConditionValidator,
            AgentQuizConditionValidator,
            AgentRawConditionValidator,
          ]),
        ),
      }),
      t.partial({
        operator: t.union([t.literal("all"), t.literal("any")]),
      }),
    ],
    "AgentConditions",
  ),
);

const AgentScheduleValidator = t.exact(
  t.intersection(
    [
      t.type({
        type: t.union([
          t.literal("once"),
          t.literal("daily"),
          t.literal("weekly"),
          t.literal("monthly"),
        ]),
        start: DateOffsetValidator,
      }),
      t.partial({
        time: t.string,
        end: DateOffsetValidator,
        every: t.number,
        onDays: t.array(t.string),
      }),
    ],
    "AgentSchedule",
  ),
);

const AgentEmailValidator = t.exact(
  t.intersection(
    [
      t.type({
        to: t.string,
        subject: t.string,
        message: t.string,
      }),
      t.partial({
        cc: t.string,
        bcc: t.string,
      }),
    ],
    "AgentEmail",
  ),
);

const AgentEnrollmentValidator = t.exact(
  t.type(
    {
      type: t.union([t.literal("enroll"), t.literal("unenroll")]),
      orgUnitId: t.number,
      roleId: t.number,
    },
    "AgentEnrollment",
  ),
);

const AgentActionValidator = t.exact(
  t.partial(
    {
      repeat: t.union([t.literal("firstTimeOnly"), t.literal("everyTime")]),
      email: AgentEmailValidator,
      enrollment: AgentEnrollmentValidator,
    },
    "AgentAction",
  ),
);

const AgentValidator = t.exact(
  t.intersection(
    [
      t.type({
        name: t.string,
      }),
      t.partial({
        description: t.string,
        enabled: t.boolean,
        roles: t.array(t.string),
        roleIds: t.array(t.number),
        criteria: AgentCriteriaValidator,
        conditions: AgentConditionsValidator,
        schedule: AgentScheduleValidator,
        action: AgentActionValidator,
      }),
    ],
    "Agent",
  ),
);

type Agent = t.TypeOf<typeof AgentValidator>;

const NewsValidator = t.exact(
  t.intersection(
    [
      t.type({
        name: t.string,
        content: t.string,
      }),
      t.partial({
        start: DateOffsetValidator,
        end: DateOffsetValidator,
      }),
    ],
    "News",
  ),
);

type News = t.TypeOf<typeof NewsValidator>;

export const TemplateFileValidator = t.exact(
  t.intersection(
    [
      t.type({
        courseCode: t.string,
      }),
      t.partial({
        assignments: t.array(AssignmentValidator),
        quizzes: t.array(QuizValidator),
        discussions: t.array(DiscussionValidator),
        agents: t.array(AgentValidator),
        news: t.array(NewsValidator),
      }),
    ],
    "Template",
  ),
);

type Template = t.TypeOf<typeof TemplateFileValidator>;

((): void => {
  // perform some "static runtime" check to help typescript.
  // io-ts types are pretty messy to read so we're never going
  // to use them over the clean ones saved in redux. But we want to make sure that they're the same.
  const _do0: TDateOffset = null as unknown as DateOffset;
  const _do1: DateOffset = null as unknown as TDateOffset;

  const _as0: TAssignment = null as unknown as Assignment;
  const _as1: Assignment = null as unknown as TAssignment;

  const _qu0: TQuiz = null as unknown as Quiz;
  const _qu1: Quiz = null as unknown as TQuiz;

  const _di0: TDiscussion = null as unknown as Discussion;
  const _di1: Discussion = null as unknown as TDiscussion;

  const _ag0: TAgent = null as unknown as Agent;
  const _ag1: Agent = null as unknown as TAgent;

  const _ne0: TNews = null as unknown as News;
  const _ne1: News = null as unknown as TNews;

  const _te0: TTemplate = null as unknown as Template;
  const _te1: Template = null as unknown as TTemplate;
})();
