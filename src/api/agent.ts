// https://docs.valence.desire2learn.com/res/intelligentagents.html
import { host, leAgentsBaseURL } from "./api";
import type { ObjectListPage } from "./api";

// SCHEDULETYPE_T
export enum ScheduleType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
  Hourly = 4,
  OneTime = 5,
}

// ENROLLMENTTYPE_T
export enum EnrollmentType {
  Enroll = 0,
  Unenroll = 1,
}

// RUNNOWTYPE_T
export enum RunNowType {
  Practice = 0,
  Full = 1,
}

// LOGINCONDITIONTYPE_T
export enum LoginConditionType {
  HasNotLoggedIn = 0,
  HasLoggedIn = 1,
}

// ACCESSCONDITIONTYPE_T
export enum AccessConditionType {
  HasNotAccessed = 0,
  HasAccessed = 1,
}

// ActionData.RepeatType
export enum ActionRepeatType {
  EveryTime = 0,
  FirstTimeOnly = 1,
}

export interface ScheduleData {
  IsEnabled: boolean;
  Type: ScheduleType | null;
  StartDate: string | null;
  EndDate: string | null;
  RepeatsEvery: number | null;
  RepeatsOnDay: number | null;
  RepeatsOnDays: string[] | null;
  RepeatsOnMonth: number | null;
  ScheduledTimeHour: number | null;
  ScheduledTimeMinute: number | null;
}

export interface EmailAction {
  IsEnabled: boolean;
  // Comma separated addresses. {InitiatingUser}, {InitiatingUserAuditors}
  // and {InitiatingUserParents} are expanded by Brightspace.
  To: string | null;
  Cc: string | null;
  Bcc: string | null;
  Subject: string | null;
  Message: string | null;
  IsHtml: boolean;
}

export interface EnrollmentAction {
  IsEnabled: boolean;
  EnrollmentType: EnrollmentType | null;
  OrgUnitId: number | null;
  RoleId: number | null;
}

export interface ActionData {
  RepeatType: ActionRepeatType;
  EmailAction: EmailAction | null;
  EnrollmentAction: EnrollmentAction | null;
}

export interface DateCondition {
  Type: number;
  Days: number;
}

// Reference to the release condition set attached to the agent. The set
// itself is managed through the release conditions API with the
// "intelligentAgents" target type and the AgentId as target id.
export interface AgentReleaseCondition {
  ConditionSetId: number | null;
}

export interface AgentConditionData {
  LoginActivity: DateCondition | null;
  CourseActivity: DateCondition | null;
  ReleaseCondition: AgentReleaseCondition | null;
  // Null or empty means all roles.
  RoleIds: number[] | null;
}

// IntelligentAgents.AgentData, used for GET, POST and PUT.
export interface AgentData {
  // Ignored on creation.
  AgentId: number | null;
  Name: string;
  Description: string;
  IsEnabled: boolean;
  Schedule: ScheduleData | null;
  Action: ActionData | null;
  Condition: AgentConditionData | null;
  LastRunDate: string | null;
  NextRunDate: string | null;
  CategoryId: number | null;
}

export interface RunNowData {
  RunNowType: RunNowType | null;
}

const authHeaders = (token: string): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const fetchAgentsPage = async (
  token: string,
  url: string,
): Promise<ObjectListPage<AgentData>> => {
  const resp = await fetch(url, { headers: authHeaders(token) });
  const body: unknown = await resp.json();
  const page = body as ObjectListPage<AgentData>;
  if (!resp.ok || !Array.isArray(page.Objects)) {
    throw new Error(
      `Unexpected intelligent agents response (${resp.status}): ${JSON.stringify(body)}`,
    );
  }
  return page;
};

// The agents list is an object list page; follow Next until it is null.
export const fetchAllAgents = async (
  token: string,
  course: string,
): Promise<AgentData[]> => {
  const agents: AgentData[] = [];
  let url: string | null = `${leAgentsBaseURL}/${course}/agents`;
  while (url !== null) {
    const page: ObjectListPage<AgentData> = await fetchAgentsPage(token, url);
    agents.push(...page.Objects);
    const next: string | null = page.Next;
    if (next === null || next === "") url = null;
    else url = next.startsWith("http") ? next : host + next;
  }
  return agents;
};

export const createAgent = async (
  token: string,
  course: string,
  agent: AgentData,
): Promise<Response> => {
  return fetch(`${leAgentsBaseURL}/${course}/agents`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(agent),
  });
};

export const updateAgent = async (
  token: string,
  course: string,
  agentId: string,
  agent: AgentData,
): Promise<Response> => {
  return fetch(`${leAgentsBaseURL}/${course}/agents/${agentId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(agent),
  });
};

// Not used by the assistant flow, but handy to trigger a practice run when
// testing an agent created through the API.
export const runAgent = async (
  token: string,
  course: string,
  agentId: string,
  run: RunNowData,
): Promise<Response> => {
  return fetch(`${leAgentsBaseURL}/${course}/agents/${agentId}/runs`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(run),
  });
};
