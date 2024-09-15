import { Box, Button, Typography } from "@mui/material";
import { UploadTemplateFile } from "./UploadTemplateFile";
import type { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";
import type { CourseTemplate } from "../../store/template";
import { resetTemplate, setTemplate } from "../../store/template";
import type { ReactElement } from "react";
import { useState } from "react";
import type { SelectedCourse } from "../../store/course";
import { isValidTemplate, validateTemplate } from "./utils";
import { useEnrollmentsQuery } from "../../api/enrollment";
import { CourseSelection } from "./CourseSelection/CourseSelection";
import { Loading } from "../Loading";
import { Overview } from "./Overview/Overview";
import { setCourse as dSetCourse } from "../../store/course";

export interface TemplateFile {
  filename: string;
  template: CourseTemplate;
}

export const TemplateStep = ({ previous, next }: PageProps): ReactElement => {
  const {
    data: enrollments,
    loading: enrollmentsLoading,
    error: enrollmentsError,
  } = useEnrollmentsQuery();
  const [templateFile, setTemplateFile] = useState<TemplateFile | undefined>();
  const [course, setCourse] = useState<SelectedCourse | undefined>();
  const dispatch = useAppDispatch();

  const validatedTemplate = validateTemplate(templateFile, course);
  const isValid = isValidTemplate(validatedTemplate);

  const onPrevious = (): void => {
    dispatch(resetTemplate());
    previous();
  };

  const onNext = (): void => {
    if (!templateFile || !course || !isValid) return;
    dispatch(
      setTemplate({
        courseCode: templateFile.template.courseCode,
        assignments: validatedTemplate.validAssignments,
        quizzes: validatedTemplate.validQuizzes,
        news: validatedTemplate.validNews,
      }),
    );
    dispatch(dSetCourse(course));
    next();
  };

  if (enrollmentsLoading) return <Loading />;
  if (enrollmentsError !== undefined || !enrollments)
    return (
      <Typography>Error loading enrollments: {enrollmentsError}</Typography>
    );

  return (
    <>
      <UploadTemplateFile
        templateFile={templateFile}
        setTemplateFile={setTemplateFile}
      />
      {templateFile && (
        <CourseSelection
          enrollments={enrollments.Items}
          courseCode={templateFile.template.courseCode}
          onCourseSelected={setCourse}
        />
      )}
      {templateFile && course && (
        <Overview template={validatedTemplate} course={course} />
      )}
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
