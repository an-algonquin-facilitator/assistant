import type { ReactElement } from "react";
import type { ValidatedTemplate } from "../utils";
import { ListWarnings } from "../ListWarnings";
import { OKIcon } from "./OKIcon";
import { WarningIcon } from "./WarningIcon";

interface QuizWarningsProps {
  template: ValidatedTemplate;
}

export const QuizWarnings = ({ template }: QuizWarningsProps): ReactElement => {
  const warningCount =
    template.missingBrightspaceQuizzes.length +
    template.missingTemplateQuizzes.length;

  if (warningCount === 0) return <OKIcon />;

  return (
    <WarningIcon>
      <ListWarnings
        explanation="The following quizzes were found in Brightspace but not in your template. They will not be modified."
        warnings={template.missingBrightspaceQuizzes.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following quizzes were found in your template but not in Brightspace. It cannot be applied."
        warnings={template.missingTemplateQuizzes.map((m) => m.name)}
      />
    </WarningIcon>
  );
};
