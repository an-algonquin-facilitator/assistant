import type { ReactElement } from "react";
import type { ValidTemplate } from "../../../store/templateValidation";
import { ListWarnings } from "../ListWarnings";
import { OKIcon } from "./OKIcon";
import { WarningIcon } from "./WarningIcon";

interface AgentWarningsProps {
  template: ValidTemplate;
  agentsError?: string;
}

export const AgentWarnings = ({
  template,
  agentsError,
}: AgentWarningsProps): ReactElement => {
  const warningCount =
    template.missingBrightspaceAgents.length +
    template.invalidAgents.length +
    (agentsError === undefined ? 0 : 1);

  if (warningCount === 0) return <OKIcon />;

  return (
    <WarningIcon>
      <ListWarnings
        explanation="Intelligent agents could not be loaded from Brightspace (the agents API needs LE 1.93+ and the classlist permission). Existing agents cannot be detected and role names cannot be resolved."
        warnings={agentsError === undefined ? [] : [agentsError]}
      />
      <ListWarnings
        explanation="The following intelligent agents were found in Brightspace but not in your template. They will not be modified."
        warnings={template.missingBrightspaceAgents.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following intelligent agents in your template cannot be applied:"
        warnings={template.invalidAgents.map(
          (i) => `${i.agent.name}: ${i.reasons.join(" ")}`,
        )}
      />
    </WarningIcon>
  );
};
