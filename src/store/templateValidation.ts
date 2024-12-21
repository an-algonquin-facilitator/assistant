import type { SelectedCourse, TemplateFile } from "./template";
import type { News as BNews } from "../api/news";
import type { Quiz as BQuiz } from "../api/quiz";
import type { Folder } from "../api/folder";
import type {
  AssignmentTemplate,
  QuizTemplate as TQuiz,
  NewsTemplate as TNews,
} from "./template";

export type TemplateValidationResult =
  | {
      isTemplateValid: true;

      validAssignments: AssignmentTemplate[];
      missingBrightspaceAssignments: Folder[];
      missingTemplateAssignments: AssignmentTemplate[];

      validQuizzes: TQuiz[];
      missingBrightspaceQuizzes: BQuiz[];
      missingTemplateQuizzes: TQuiz[];

      validNews: TNews[];
      missingBrightspaceNews: BNews[];
      missingTemplateNews: TNews[];
    }
  | { isTemplateValid: false };

export const isValidTemplate = (
  template: TemplateValidationResult,
): boolean => {
  return (
    !template.isTemplateValid ||
    template.validAssignments.length > 0 ||
    template.validNews.length > 0 ||
    template.validQuizzes.length > 0
  );
};

export const validateTemplate = (
  ut: TemplateFile | undefined,
  course: SelectedCourse | undefined,
): TemplateValidationResult => {
  if (!ut || !course)
    return {
      isTemplateValid: false,
    };

  const templateAssignments = ut.template.assignments ?? [];
  const templateQuizzes = ut.template.quizzes ?? [];
  const templateNews = ut.template.news ?? [];

  // in brightspace but not template
  const missingBrightspaceAssignments = course.folders.filter(
    (f) => !templateAssignments.some((a) => a.name === f.Name),
  );

  // in template but not brightspace
  const missingTemplateAssignments = templateAssignments.filter(
    (f) => !course.folders.some((a) => a.Name === f.name),
  );

  const validAssignments = templateAssignments.filter(
    (a) => !missingTemplateAssignments.includes(a),
  );

  // in brightspace but not template
  const missingBrightspaceQuizzes = course.quizzes.filter(
    (b) => !templateQuizzes.some((q) => q.name === b.Name),
  );
  // in template but not brightspace
  const missingTemplateQuizzes = templateQuizzes.filter(
    (q) => !course.quizzes.some((b) => b.Name === q.name),
  );

  const validQuizzes = templateQuizzes.filter(
    (a) => !missingTemplateQuizzes.includes(a),
  );

  // in brightspace but not template
  const missingBrightspaceNews = course.news.filter(
    (b) => !templateNews.some((q) => q.name === b.Title),
  );

  // in template but not brightspace
  const missingTemplateNews = templateNews.filter(
    (q) => !course.news.some((b) => b.Title === q.name),
  );

  return {
    isTemplateValid: true,
    validAssignments,
    missingBrightspaceAssignments,
    missingTemplateAssignments,
    validQuizzes,
    missingBrightspaceQuizzes,
    missingTemplateQuizzes,
    // for news all news are valid as we simply create the missing ones.
    validNews: templateNews,
    missingBrightspaceNews,
    missingTemplateNews,
  };
};
