import type { ReactElement } from "react";
import type { ValidTemplate } from "../../../store/templateValidation";
import { ListWarnings } from "../ListWarnings";
import { OKIcon } from "./OKIcon";
import { WarningIcon } from "./WarningIcon";

interface DiscussionWarningsProps {
  template: ValidTemplate;
}

export const DiscussionWarnings = ({
  template,
}: DiscussionWarningsProps): ReactElement => {
  const warningCount =
    template.missingBrightspaceDiscussions.length +
    template.missingTemplateDiscussions.length;

  if (warningCount === 0) return <OKIcon />;

  return (
    <WarningIcon>
      <ListWarnings
        explanation="The following discussion topics were found in Brightspace but not in your template. They will not be modified."
        warnings={template.missingBrightspaceDiscussions.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following discussions were found in your template but not in Brightspace. It cannot be applied."
        warnings={template.missingTemplateDiscussions.map((m) => m.name)}
      />
    </WarningIcon>
  );
};
