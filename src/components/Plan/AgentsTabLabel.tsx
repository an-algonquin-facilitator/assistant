import type { ReactElement } from "react";
import { usePlanedAgentCount } from "../../store/plan";
import { useTemplateAgentsCount } from "../../store/template";

export const AgentsTabLabel = (): ReactElement => {
  const plannedAgentCount = usePlanedAgentCount();
  const templateAgentCount = useTemplateAgentsCount();
  return (
    <>
      Agents ({plannedAgentCount}/{templateAgentCount})
    </>
  );
};
