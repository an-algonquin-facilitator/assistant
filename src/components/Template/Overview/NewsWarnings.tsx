import type { ReactElement } from "react";
import type { ValidatedTemplate } from "../utils";
import { ListWarnings } from "../ListWarnings";
import { OKIcon } from "./OKIcon";
import { WarningIcon } from "./WarningIcon";

interface NewsWarningsProps {
  template: ValidatedTemplate;
}

export const NewsWarnings = ({ template }: NewsWarningsProps): ReactElement => {
  const warningCount = template.missingBrightspaceNews.length;

  if (warningCount === 0) return <OKIcon />;
  return (
    <WarningIcon>
      <ListWarnings
        explanation="The following News were found in Brightspace but not in your template. They will not be modified."
        warnings={template.missingBrightspaceNews.map((m) => m.Title)}
      />
    </WarningIcon>
  );
};
