import type { ReactElement } from "react";
import type { ValidatedTemplate } from "../utils";
import { ListWarnings } from "../ListWarnings";
import { OKIcon } from "./OKIcon";
import { WarningIcon } from "./WarningIcon";

interface AssignmentWarningsProps {
  template: ValidatedTemplate;
}

export const AssignmentWarnings = ({
  template,
}: AssignmentWarningsProps): ReactElement => {
  const warningCount =
    template.missingBrightspaceAssignments.length +
    template.missingTemplateAssignments.length;

  if (warningCount === 0) return <OKIcon />;

  return (
    <WarningIcon>
      <ListWarnings
        explanation="The following assignments were found in Brightspace but not in your template. They will not be modified."
        warnings={template.missingBrightspaceAssignments.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following assignments were found in your template but not in Brightspace. It cannot be applied."
        warnings={template.missingTemplateAssignments.map((m) => m.name)}
      />
    </WarningIcon>
  );
};
