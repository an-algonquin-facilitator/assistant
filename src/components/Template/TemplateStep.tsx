import { Box, Button, Typography } from "@mui/material";
import { UploadTemplateFile } from "./UploadTemplateFile";
import type { PageProps } from "../Assistant/Assistant";
import { useAppDispatch } from "../../store/hooks";
import type { CourseTemplate } from "../../store/template";
import { resetTemplate } from "../../store/template";
import type { ReactElement } from "react";
import { useEnrollmentsQuery } from "../../api/enrollment";
import { Loading } from "../Loading";
import { Overview } from "./Overview/Overview";
import {
  dispatchFullCourseFetches,
  sortCourses,
} from "./CourseSelection/utils";
import { CourseSelectionField } from "./CourseSelection/CourseSelectionField";
import { PlanButton } from "./PlanButton";

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
  const [recent, others] = sortCourses(enrollments?.Items ?? []);
  const dispatch = useAppDispatch();

  const onCourseSelected = (courseId: string): void => {
    dispatchFullCourseFetches(courseId, dispatch);
  };

  const onPrevious = (): void => {
    dispatch(resetTemplate());
    previous();
  };

  if (enrollmentsLoading) return <Loading />;
  if (enrollmentsError !== undefined || !enrollments)
    return (
      <Typography>Error loading enrollments: {enrollmentsError}</Typography>
    );

  return (
    <>
      <UploadTemplateFile recent={recent} onCourseSelected={onCourseSelected} />
      <CourseSelectionField
        recent={recent}
        others={others}
        onCourseSelected={onCourseSelected}
      />
      <Overview />
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <PlanButton onClick={next} />
      </Box>
    </>
  );
};
