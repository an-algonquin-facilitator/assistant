import { IconButton, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Modal } from "../Modal";
import type { ReactElement } from "react";
import { useState } from "react";
import { ListWarnings } from "./ListWarnings";
import type { ValidatedTemplate } from "./utils";

interface TemplateQuizzesOverviewProps {
  template: ValidatedTemplate;
}

export const TemplateQuizzesOverview = ({
  template,
}: TemplateQuizzesOverviewProps): ReactElement => {
  const [open, setOpen] = useState(false);

  const warningCount =
    template.missingBrightspaceQuizzes.length +
    template.missingTemplateQuizzes.length;

  return (
    <Typography>
      {template.validQuizzes.length} valid quiz
      {warningCount === 0 ? (
        <></>
      ) : (
        <>
          {" "}
          and
          <Typography component="span" color="orange">
            {" "}
            {warningCount} warnings
          </Typography>
          <IconButton onClick={() => setOpen(true)} color="info">
            <HelpOutlineIcon />
          </IconButton>
          <Modal open={open} onClose={() => setOpen(false)}>
            <>
              <ListWarnings
                explanation="The following quizzes were found in Brightspace but not in your template. They will not be modified."
                warnings={template.missingBrightspaceQuizzes.map((m) => m.Name)}
              />
              <ListWarnings
                explanation="The following quizzes were found in your template but not in Brightspace. It cannot be applied."
                warnings={template.missingTemplateQuizzes.map((m) => m.name)}
              />
            </>
          </Modal>
        </>
      )}
    </Typography>
  );
};
