import { Box, Button } from "@mui/material";
import { UploadTemplateFile } from "./UploadTemplateFile";
import { TemplateOverview } from "./TemplateOverview";
import { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";
import {
  resetTemplate,
  setTemplateAssignments,
  setTemplateNews,
  setTemplateQuizzes,
} from "../../store/template";
import { useState } from "react";
import { useFolders, useNews, useQuizzes } from "../../store/course";
import { isValidTemplate, validateTemplate } from "./utils";

export interface UnvalidatedTemplate {
  filename?: string;
  assignments?: any[];
  quizzes?: any[];
  news?: any[];
}

export const UploadTemplateStep = ({ previous, next }: PageProps) => {
  const [ut, setUT] = useState<UnvalidatedTemplate | undefined>();
  const folders = useFolders();
  const quizzes = useQuizzes();
  const news = useNews();
  const dispatch = useAppDispatch();

  const validatedTemplate = validateTemplate(ut, folders, quizzes, news);
  const isValid = isValidTemplate(validatedTemplate);

  const onPrevious = () => {
    dispatch(resetTemplate());
    previous();
  };

  const onNext = () => {
    if (!isValid) return;
    dispatch(setTemplateAssignments(validatedTemplate.validAssignments));
    dispatch(setTemplateQuizzes(validatedTemplate.validQuizzes));
    dispatch(setTemplateNews(validatedTemplate.validNews));
    next();
  };

  return (
    <>
      <UploadTemplateFile ut={ut} setUT={setUT} />
      {ut && <TemplateOverview template={validatedTemplate} />}
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <Button onClick={onNext} disabled={!isValid}>
          PLAN
        </Button>
      </Box>
    </>
  );
};
