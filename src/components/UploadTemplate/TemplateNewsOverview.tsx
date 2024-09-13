import { IconButton, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Modal } from "../Modal";
import { useState } from "react";
import { ListWarnings } from "./ListWarnings";
import type { ValidatedTemplate } from "./utils";

interface TemplateNewsOverviewProps {
  template: ValidatedTemplate;
}

export const TemplateNewsOverview = ({
  template,
}: TemplateNewsOverviewProps) => {
  const [open, setOpen] = useState(false);

  const warningCount = template.missingBrightspaceNews.length;

  return (
    <Typography>
      {template.validNews.length - template.missingTemplateNews.length} valid
      news, {template.missingTemplateNews.length} to be created
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
                explanation="The following News were found in Brightspace but not in your template. They will not be modified."
                warnings={template.missingBrightspaceNews.map((m) => m.Title)}
              />
            </>
          </Modal>
        </>
      )}
    </Typography>
  );
};
