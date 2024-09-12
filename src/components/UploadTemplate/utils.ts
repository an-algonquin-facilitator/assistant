import { Template } from "../../store/template";

export const isValidTemplate = (template: Template) =>
  (template.assignments?.length ?? 0) > 0 ||
  (template.news?.length ?? 0) > 0 ||
  (template.quizzes?.length ?? 0) > 0;
