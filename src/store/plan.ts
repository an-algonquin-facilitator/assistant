import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DateOffset } from "./template";
import { useAppSelector } from "./hooks";
import type { AgentData } from "../api/agent";
import type { ConditionsData } from "../api/releaseConditions";

export interface PlanState {
  assignments: AssignmentPlan[];
  quizzes: QuizPlan[];
  discussions: DiscussionPlan[];
  agents: AgentPlan[];
  news: NewsPlan[];
}

const initialState: PlanState = {
  assignments: [],
  quizzes: [],
  discussions: [],
  agents: [],
  news: [],
};

export interface AssignmentPlan {
  id: string;
  templateId?: string;
  name: string;
  start: number;
  due: number;
  end: number;

  holidayOffset: number;
  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface QuizPlan {
  id: string;
  templateId?: string;
  name: string;
  start: number;
  due: number;
  end: number;

  holidayOffset: number;
  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface DiscussionPlan {
  // Discussion topic id. Topics live inside a forum so the forum id is
  // needed as well to address the topic in the API.
  id: string;
  forumId: string;
  templateId?: string;
  name: string;
  start: number;
  due: number;
  end: number;

  holidayOffset: number;
  startOffset: DateOffset;
  dueOffset: DateOffset;
  endOffset: DateOffset;
}

export interface AgentPlan {
  // Agent name, unique within the course. Also the plan identity.
  name: string;
  // AgentId of the existing agent with that name, when there is one.
  existingId?: string;
  // Complete payload sent to Brightspace.
  agentData: AgentData;
  // Release conditions to put on the agent once it exists.
  conditions?: ConditionsData;
  // Human readable descriptions for the UI.
  conditionSummaries: string[];
  roleSummaries: string[];
  scheduleSummary: string;
  // Present when the agent has a schedule.
  scheduleStart?: number;
  scheduleStartOffset?: DateOffset;
  scheduleEnd?: number;
  scheduleEndOffset?: DateOffset;
}

export interface NewsPlan {
  name: string;
  content: string;
  open: number;
  openOffset: DateOffset;
  dismiss: number;
  dismissOffset: DateOffset;
}

export interface CoursePlan {
  assignments: AssignmentPlan[];
  quizzes: QuizPlan[];
  discussions: DiscussionPlan[];
  agents: AgentPlan[];
  news: NewsPlan[];
}

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    addAssignmentPlan(state, action: PayloadAction<AssignmentPlan>) {
      if (state.assignments.some((a) => a.id === action.payload.id)) return;
      state.assignments.push(action.payload);
    },
    removeAssignmentPlan(state, action: PayloadAction<AssignmentPlan>) {
      const i = state.assignments.findIndex((a) => a.id === action.payload.id);
      if (i === -1) return;
      state.assignments.splice(i, 1);
    },
    addQuizPlan(state, action: PayloadAction<QuizPlan>) {
      if (state.quizzes.some((a) => a.id === action.payload.id)) return;
      state.quizzes.push(action.payload);
    },
    removeQuizPlan(state, action: PayloadAction<QuizPlan>) {
      const i = state.quizzes.findIndex((a) => a.id === action.payload.id);
      if (i === -1) return;
      state.quizzes.splice(i, 1);
    },
    addDiscussionPlan(state, action: PayloadAction<DiscussionPlan>) {
      if (state.discussions.some((a) => a.id === action.payload.id)) return;
      state.discussions.push(action.payload);
    },
    removeDiscussionPlan(state, action: PayloadAction<DiscussionPlan>) {
      const i = state.discussions.findIndex((a) => a.id === action.payload.id);
      if (i === -1) return;
      state.discussions.splice(i, 1);
    },
    addAgentPlan(state, action: PayloadAction<AgentPlan>) {
      if (state.agents.some((a) => a.name === action.payload.name)) return;
      state.agents.push(action.payload);
    },
    removeAgentPlan(state, action: PayloadAction<AgentPlan>) {
      const i = state.agents.findIndex((a) => a.name === action.payload.name);
      if (i === -1) return;
      state.agents.splice(i, 1);
    },

    addNewsPlan(state, action: PayloadAction<NewsPlan>) {
      if (state.news.some((a) => a.name === action.payload.name)) return;
      state.news.push(action.payload);
    },
    removeNewsPlan(state, action: PayloadAction<NewsPlan>) {
      const i = state.news.findIndex((a) => a.name === action.payload.name);
      if (i === -1) return;
      state.news.splice(i, 1);
    },
    resetPlan(state) {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addAssignmentPlan,
  removeAssignmentPlan,
  addQuizPlan,
  removeQuizPlan,
  addDiscussionPlan,
  removeDiscussionPlan,
  addAgentPlan,
  removeAgentPlan,
  addNewsPlan,
  removeNewsPlan,
  resetPlan,
} = planSlice.actions;

export const useIsAssignmentPlanned = (id: string): boolean =>
  useAppSelector((s) => s.plan.assignments.some((a) => a.id === id));

export const useIsQuizPlanned = (id: string): boolean =>
  useAppSelector((s) => s.plan.quizzes.some((a) => a.id === id));

export const useIsDiscussionPlanned = (id: string): boolean =>
  useAppSelector((s) => s.plan.discussions.some((a) => a.id === id));

export const useIsAgentPlanned = (name: string): boolean =>
  useAppSelector((s) => s.plan.agents.some((a) => a.name === name));

export const useIsNewsPlanned = (name: string): boolean =>
  useAppSelector((s) => s.plan.news.some((a) => a.name === name));

export const useIsAllAssignmentPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.assignments.length === s.template.value.assignments.length,
  );

export const usePlanedAssignmentCount = (): number =>
  useAppSelector((s) => s.plan.assignments.length);

export const useIsAllQuizPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.quizzes.length === s.template.value.quizzes.length,
  );

export const useIsAllDiscussionPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.discussions.length === s.template.value.discussions.length,
  );

export const usePlanedDiscussionCount = (): number =>
  useAppSelector((s) => s.plan.discussions.length);

export const useIsAllAgentPlanned = (): boolean =>
  useAppSelector(
    (s) => s.plan.agents.length === s.template.value.agents.length,
  );

export const usePlanedAgentCount = (): number =>
  useAppSelector((s) => s.plan.agents.length);

export const useIsAllNewsPlanned = (): boolean =>
  useAppSelector((s) => s.plan.news.length === s.template.value.news.length);

export const usePlanedQuizCount = (): number =>
  useAppSelector((s) => s.plan.quizzes.length);

export const usePlanedNewsCount = (): number =>
  useAppSelector((s) => s.plan.news.length);

export const useIsAnythingPlanned = (): boolean =>
  useAppSelector(
    (s) =>
      s.plan.assignments.length > 0 ||
      s.plan.quizzes.length > 0 ||
      s.plan.discussions.length > 0 ||
      s.plan.agents.length > 0 ||
      s.plan.news.length > 0,
  );

export const usePlannedAssignments = (): AssignmentPlan[] =>
  useAppSelector((s) => s.plan.assignments);
export const usePlannedQuizzes = (): QuizPlan[] =>
  useAppSelector((s) => s.plan.quizzes);
export const usePlannedDiscussions = (): DiscussionPlan[] =>
  useAppSelector((s) => s.plan.discussions);
export const usePlannedAgents = (): AgentPlan[] =>
  useAppSelector((s) => s.plan.agents);
export const usePlannedNews = (): NewsPlan[] =>
  useAppSelector((s) => s.plan.news);

export const planReducer = planSlice.reducer;
