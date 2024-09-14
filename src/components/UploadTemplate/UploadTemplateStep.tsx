import { Box, Button } from "@mui/material";
import { UploadTemplateFile } from "./UploadTemplateFile";
import { TemplateOverview } from "./TemplateOverview";
import type { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";
import type { Template } from "../../store/template";
import { resetTemplate, setTemplate } from "../../store/template";
import type { ReactElement } from "react";
import { useState } from "react";
import { useFolders, useNews, useQuizzes } from "../../store/course";
import { isValidTemplate, validateTemplate } from "./utils";

export interface TemplateFile {
  filename: string;
  template: Template;
}

export const UploadTemplateStep = ({
  previous,
  next,
}: PageProps): ReactElement => {
  const [ut, setUT] = useState<TemplateFile | undefined>();
  const folders = useFolders();
  const quizzes = useQuizzes();
  const news = useNews();
  const dispatch = useAppDispatch();

  const validatedTemplate = validateTemplate(ut, folders, quizzes, news);
  const isValid = isValidTemplate(validatedTemplate);

  const onPrevious = (): void => {
    dispatch(resetTemplate());
    previous();
  };

  const onNext = (): void => {
    if (!ut) return;
    if (!isValid) return;
    dispatch(
      setTemplate({
        courseCode: ut.template.courseCode,
        assignments: validatedTemplate.validAssignments,
        quizzes: validatedTemplate.validQuizzes,
        news: validatedTemplate.validNews,
      }),
    );
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
