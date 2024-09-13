import type { Folder, News as BNews, Quiz as BQuiz } from "../../api/api";
import type {
  Assignment,
  Quiz as TQuiz,
  News as TNews,
} from "../../store/template";
import type { UnvalidatedTemplate } from "./UploadTemplateStep";

export interface ValidatedTemplate {
  validAssignments: Assignment[];
  missingBrightspaceAssignments: Folder[];
  missingTemplateAssignments: Assignment[];

  validQuizzes: TQuiz[];
  missingBrightspaceQuizzes: BQuiz[];
  missingTemplateQuizzes: TQuiz[];

  validNews: TNews[];
  missingBrightspaceNews: BNews[];
  missingTemplateNews: TNews[];
}

export const isValidTemplate = (template: ValidatedTemplate) => {
  return (
    template.validAssignments.length > 0 ||
    template.validNews.length > 0 ||
    template.validQuizzes.length > 0
  );
};

export const validateTemplate = (
  ut: UnvalidatedTemplate | undefined,
  folders: Folder[],
  quizzes: BQuiz[],
  news: BNews[],
): ValidatedTemplate => {
  if (!ut)
    return {
      validAssignments: [],
      missingBrightspaceAssignments: [],
      missingTemplateAssignments: [],
      validQuizzes: [],
      missingBrightspaceQuizzes: [],
      missingTemplateQuizzes: [],
      validNews: [],
      missingBrightspaceNews: [],
      missingTemplateNews: [],
    };

  const templateAssignments = ut.assignments ?? [];
  const templateQuizzes = ut.quizzes ?? [];
  const templateNews = ut.news ?? [];

  // in brightspace but not template
  const missingBrightspaceAssignments = folders.filter(
    (f) => !templateAssignments.some((a) => a.name === f.Name),
  );

  // in template but not brightspace
  const missingTemplateAssignments = templateAssignments.filter(
    (f) => !folders.some((a) => a.Name === f.name),
  );

  const validAssignments = templateAssignments.filter(
    (a) => !missingTemplateAssignments.includes(a),
  );

  // in brightspace but not template
  const missingBrightspaceQuizzes = quizzes.filter(
    (b) => !templateQuizzes.some((q) => q.name === b.Name),
  );
  // in template but not brightspace
  const missingTemplateQuizzes = templateQuizzes.filter(
    (q) => !quizzes.some((b) => b.Name === q.name),
  );

  const validQuizzes = templateQuizzes.filter(
    (a) => !missingTemplateQuizzes.includes(a),
  );

  // in brightspace but not template
  const missingBrightspaceNews = news.filter(
    (b) => !templateNews.some((q) => q.name === b.Title),
  );

  // in template but not brightspace
  const missingTemplateNews = templateNews.filter(
    (q) => !news.some((b) => b.Title === q.name),
  );

  return {
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
