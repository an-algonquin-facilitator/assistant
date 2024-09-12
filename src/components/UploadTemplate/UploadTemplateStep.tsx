import { Box, Button, Typography } from "@mui/material";
import { resetStartDate, setTemplate, useTemplate } from "../../store/template";
import { SemesterStartDate } from "./SemesterStartDate";
import { UploadTemplateFile } from "./UploadTemplateFile";
import { TemplateOverview } from "./TemplateOverview";
import { isValidTemplate } from "./utils";
import { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";

export const UploadTemplateStep = ({ previous, next }: PageProps) => {
  const template = useTemplate();
  const dispatch = useAppDispatch();

  const validTemplate = isValidTemplate(template);

  const onPrevious = () => {
    dispatch(setTemplate({}));
    dispatch(resetStartDate());
    previous();
  };
  const onNext = () => {
    next();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      <Typography variant="h3">Template</Typography>
      <Typography>REMOVE START DATE IT MAKES NO SENSE</Typography>
      <SemesterStartDate />
      <UploadTemplateFile />
      <TemplateOverview />
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <Button onClick={onNext} disabled={!validTemplate}>
          REVIEW
        </Button>
      </Box>
    </Box>
  );
};
