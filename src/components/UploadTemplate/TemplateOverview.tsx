import { Typography } from "@mui/material";
import { TemplateAssignmentOverview } from "./TemplateAssignmentOverview";
import type { ValidatedTemplate } from "./utils";
import { isValidTemplate } from "./utils";
import { TemplateQuizzesOverview } from "./TemplateQuizzesOverview";
import { TemplateNewsOverview } from "./TemplateNewsOverview";
import type { ReactElement } from "react";

interface TemplateOverviewProps {
  template: ValidatedTemplate;
}

export const TemplateOverview = ({
  template,
}: TemplateOverviewProps): ReactElement => {
  const isValid = isValidTemplate(template);

  if (!isValid)
    return (
      <>
        <Typography>
          This template seemingly contains nothing. Check the documentation to
          make sure you setup your file correctly.
        </Typography>
      </>
    );

  return (
    <>
      <Typography variant="h4">
        This template contains specification for:
      </Typography>
      <TemplateAssignmentOverview template={template} />
      <TemplateQuizzesOverview template={template} />
      <TemplateNewsOverview template={template} />
    </>
  );
};
