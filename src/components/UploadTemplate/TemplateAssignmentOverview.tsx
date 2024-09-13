import { IconButton, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Modal } from "../Modal";
import { useState } from "react";
import { ListWarnings } from "./ListWarnings";
import type { ValidatedTemplate } from "./utils";

interface TemplateAssignmentOverviewProps {
  template: ValidatedTemplate;
}

export const TemplateAssignmentOverview = ({
  template,
}: TemplateAssignmentOverviewProps) => {
  const [open, setOpen] = useState(false);

  const warningCount =
    template.missingBrightspaceAssignments.length +
    template.missingTemplateAssignments.length;

  return (
    <Typography>
      {template.validAssignments.length} valid assignment
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
                explanation="The following assignments were found in Brightspace but not in your template. They will not be modified."
                warnings={template.missingBrightspaceAssignments.map(
                  (m) => m.Name,
                )}
              />
              <ListWarnings
                explanation="The following assignments were found in your template but not in Brightspace. It cannot be applied."
                warnings={template.missingTemplateAssignments.map(
                  (m) => m.name,
                )}
              />
            </>
          </Modal>
        </>
      )}
    </Typography>
  );
};
