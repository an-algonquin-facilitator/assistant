import type { ReactElement } from "react";
import { usePlanedAssignmentCount } from "../../store/plan";
import { useTemplateAssignmentCount } from "../../store/template";

export const AssignmentTabLabel = (): ReactElement => {
  const templateAssignmentCount = useTemplateAssignmentCount();
  const plannedAssignmentCount = usePlanedAssignmentCount();
  return (
    <>
      Assignments ({plannedAssignmentCount}/{templateAssignmentCount})
    </>
  );
};
