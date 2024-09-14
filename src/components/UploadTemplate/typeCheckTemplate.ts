import * as t from "io-ts";
import type {
  DateOffset as TDateOffset,
  Assignment as TAssignment,
  Quiz as TQuiz,
  News as TNews,
  Template as TTemplate,
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
  t.intersection([
    t.type({
      courseCode: t.string,
    }),
    t.partial(
      {
        assignments: t.array(AssignmentValidator),
        quizzes: t.array(QuizValidator),
        news: t.array(NewsValidator),
      },
      "Template",
    ),
  ]),
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

  const _ne0: TNews = null as unknown as News;
  const _ne1: News = null as unknown as TNews;

  const _te0: TTemplate = null as unknown as Template;
  const _te1: Template = null as unknown as TTemplate;
})();
