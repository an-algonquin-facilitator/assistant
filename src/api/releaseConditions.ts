// https://docs.valence.desire2learn.com/res/releaseconditions.html
import { lpConditionsBaseURL } from "./api";
import type { RichText } from "./api";
import { makeFetch } from "./utils";

// TARGET_T values we use.
export const intelligentAgentsTarget = "intelligentAgents";

export type ExpressionOperator = "All" | "Any";

// A single condition. Type is a CONDITIONDATA_T string such as
// "NotSubmittedToDropbox" and its parameters live under "<Type>Params".
export type ReleaseConditionData = {
  Type: string;
  // Opaque round-trip value. May be omitted or null when creating.
  State: string | null;
  // Ignored on input.
  Text?: RichText;
} & Record<string, unknown>;

export interface ExpressionData {
  Type: "Expression";
  State: string | null;
  ExpressionParams: {
    Operator: ExpressionOperator;
    Operands: ReleaseConditionData[];
  };
  Text?: RichText;
}

export interface ConditionsData {
  Expression: ExpressionData;
}

export const fetchConditions = makeFetch<
  ConditionsData,
  [string, string, string]
>(
  lpConditionsBaseURL,
  ([course, targetType, targetId]: [string, string, string]) =>
    `/${course}/conditionalRelease/conditions/${targetType}/${targetId}`,
);

// Replaces every condition on the target.
export const putConditions = async (
  token: string,
  course: string,
  targetType: string,
  targetId: string,
  conditions: ConditionsData,
): Promise<Response> => {
  return fetch(
    `${lpConditionsBaseURL}/${course}/conditionalRelease/conditions/${targetType}/${targetId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(conditions),
    },
  );
};
