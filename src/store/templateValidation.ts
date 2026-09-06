import type { SelectedCourse, TemplateFile } from "./template";
import type { News as BNews } from "../api/news";
import type { Quiz as BQuiz } from "../api/quiz";
import type { Folder } from "../api/folder";
import type { Topic } from "../api/discussion";
import type { AgentData } from "../api/agent";
import type {
  AssignmentTemplate,
  QuizTemplate as TQuiz,
  DiscussionTemplate as TDiscussion,
  AgentTemplate as TAgent,
  NewsTemplate as TNews,
} from "./template";

export interface InvalidAgent {
  agent: TAgent;
  reasons: string[];
}

export interface ValidTemplate {
  isTemplateValid: true;

  validAssignments: AssignmentTemplate[];
  missingBrightspaceAssignments: Folder[];
  missingTemplateAssignments: AssignmentTemplate[];

  validQuizzes: TQuiz[];
  missingBrightspaceQuizzes: BQuiz[];
  missingTemplateQuizzes: TQuiz[];

  validDiscussions: TDiscussion[];
  missingBrightspaceDiscussions: Topic[];
  missingTemplateDiscussions: TDiscussion[];

  validAgents: TAgent[];
  // Agents in Brightspace that the template does not mention.
  missingBrightspaceAgents: AgentData[];
  // Agents in the template that cannot be built, with the reasons why.
  invalidAgents: InvalidAgent[];

  validNews: TNews[];
  missingBrightspaceNews: BNews[];
  missingTemplateNews: TNews[];
}

export type TemplateValidationResult =
  | ValidTemplate
  | { isTemplateValid: false };

export const isValidTemplate = (
  template: TemplateValidationResult,
): boolean => {
  return (
    !template.isTemplateValid ||
    template.validAssignments.length > 0 ||
    template.validNews.length > 0 ||
    template.validQuizzes.length > 0 ||
    template.validDiscussions.length > 0 ||
    template.validAgents.length > 0
  );
};

const timeRegex = /^(?<h>\d{1,2}):(?<m>\d{2})$/u;
const maxHour = 23;
const maxMinute = 59;

// Parses a "HH:mm" string, undefined when invalid.
export const parseTime = (
  time: string,
): { hour: number; minute: number } | undefined => {
  const m = timeRegex.exec(time);
  if (!m?.groups) return undefined;
  const hour = Number(m.groups.h);
  const minute = Number(m.groups.m);
  if (hour > maxHour || minute > maxMinute) return undefined;
  return { hour, minute };
};

const agentReasons = (
  agent: TAgent,
  validAssignments: AssignmentTemplate[],
  validQuizzes: TQuiz[],
  course: SelectedCourse,
): string[] => {
  const reasons: string[] = [];

  for (const role of agent.roles ?? []) {
    if (!course.roles.some((r) => r.name === role)) {
      const known = course.roles.map((r) => `${r.name} (${r.id})`).join(", ");
      reasons.push(
        `role "${role}" was not found in the classlist (known roles: ${known || "none"}). Use roleIds instead.`,
      );
    }
  }

  for (const item of agent.conditions?.items ?? []) {
    if ("assignment" in item) {
      if (!validAssignments.some((a) => a.id === item.assignment)) {
        reasons.push(
          `condition "${item.type}" refers to assignment id "${item.assignment}" which is not a valid assignment of this template.`,
        );
      }
    } else if ("quiz" in item) {
      if (!validQuizzes.some((q) => q.id === item.quiz)) {
        reasons.push(
          `condition "${item.type}" refers to quiz id "${item.quiz}" which is not a valid quiz of this template.`,
        );
      }
    } else if (typeof item.raw.Type !== "string") {
      reasons.push(`raw condition is missing a string "Type" property.`);
    }
  }

  const { schedule } = agent;
  if (schedule?.time !== undefined && parseTime(schedule.time) === undefined) {
    reasons.push(`schedule time "${schedule.time}" is not in HH:mm format.`);
  }
  if (schedule?.type === "once" && schedule.end) {
    reasons.push(`a "once" schedule cannot have an end date.`);
  }

  return reasons;
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
  const templateDiscussions = ut.template.discussions ?? [];
  const templateAgents = ut.template.agents ?? [];
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
  const missingBrightspaceDiscussions = course.topics.filter(
    (b) => !templateDiscussions.some((d) => d.name === b.Name),
  );
  // in template but not brightspace
  const missingTemplateDiscussions = templateDiscussions.filter(
    (d) => !course.topics.some((b) => b.Name === d.name),
  );

  const validDiscussions = templateDiscussions.filter(
    (d) => !missingTemplateDiscussions.includes(d),
  );

  // in brightspace but not template
  const missingBrightspaceAgents = course.agents.filter(
    (b) => !templateAgents.some((a) => a.name === b.Name),
  );
  const invalidAgents: InvalidAgent[] = templateAgents
    .map((agent) => ({
      agent,
      reasons: agentReasons(agent, validAssignments, validQuizzes, course),
    }))
    .filter((i) => i.reasons.length > 0);
  // Agents are created when missing, so every buildable agent is valid.
  const validAgents = templateAgents.filter(
    (a) => !invalidAgents.some((i) => i.agent === a),
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
    validDiscussions,
    missingBrightspaceDiscussions,
    missingTemplateDiscussions,
    validAgents,
    missingBrightspaceAgents,
    invalidAgents,
    // for news all news are valid as we simply create the missing ones.
    validNews: templateNews,
    missingBrightspaceNews,
    missingTemplateNews,
  };
};
