import { Box, Button, Typography } from "@mui/material";
import { UploadTemplateFile } from "./UploadTemplateFile";
import type { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";
import type { CourseTemplate } from "../../store/template";
import { resetTemplate, setTemplate } from "../../store/template";
import type { ReactElement } from "react";
import { useState } from "react";
import { isValidTemplate, validateTemplate } from "./utils";
import { useEnrollmentsQuery } from "../../api/enrollment";
import { Loading } from "../Loading";
import { Overview } from "./Overview/Overview";
import type { SelectedCourse } from "../../store/course";
import { setCourse as dSetCourse } from "../../store/course";
import {
  dispatchFullCourseFetches,
  sortCourses,
} from "./CourseSelection/utils";
import { CourseSelectionField } from "./CourseSelection/CourseSelectionField";
import type { Response } from "../../api/utils";

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
  const [course, setCourse] = useState<Response<SelectedCourse>>({
    loading: false,
  });
  const dispatch = useAppDispatch();

  const validatedTemplate = validateTemplate(templateFile, course.data);
  const isValid = isValidTemplate(validatedTemplate);
  const [recent, others] = sortCourses(enrollments?.Items ?? []);

  const onCourseSelected = (courseId: string): void => {
    dispatchFullCourseFetches(courseId, setCourse);
  };

  const onTemplateSelected = (t?: TemplateFile): void => {
    setTemplateFile(t);
    if (!t || !enrollments) return;

    const prefered = recent.find((c) =>
      c.OrgUnit.Code.includes(t.template.courseCode),
    );
    if (!prefered) return;
    onCourseSelected(prefered.OrgUnit.Id + "");
  };

  const onPrevious = (): void => {
    dispatch(resetTemplate());
    previous();
  };

  const onNext = (): void => {
    if (!templateFile || !course.data || !isValid) return;
    dispatch(
      setTemplate({
        courseCode: templateFile.template.courseCode,
        assignments: validatedTemplate.validAssignments,
        quizzes: validatedTemplate.validQuizzes,
        news: validatedTemplate.validNews,
      }),
    );
    dispatch(dSetCourse(course.data));
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
        setTemplateFile={onTemplateSelected}
      />
      {templateFile && (
        <CourseSelectionField
          courseName={course.data?.course.Name ?? "None"}
          recent={recent}
          others={others}
          onCourseSelected={onCourseSelected}
        />
      )}
      {templateFile && course.data && (
        <Overview template={validatedTemplate} course={course.data} />
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
