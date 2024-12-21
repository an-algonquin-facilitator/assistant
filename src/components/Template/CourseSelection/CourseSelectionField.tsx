import { Box, LinearProgress, Typography } from "@mui/material";
import { CourseSelectionButton } from "./CourseSelectionButton";
import type { ReactElement } from "react";
import type { Enrollment } from "../../../api/enrollment";
import {
  useCourse,
  useIsCourseLoading,
  useTemplateFile,
} from "../../../store/template";

interface CourseSelectionFieldProps {
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

const SelectedCourseName = (): ReactElement => {
  const course = useCourse();
  return <>{course.course.Name || "None"}</>;
};

export const CourseSelectionField = (
  props: CourseSelectionFieldProps,
): ReactElement => {
  const templateFile = useTemplateFile();
  const isLoading = useIsCourseLoading();
  if (!templateFile.filename) return <></>;
  if (isLoading) return <LinearProgress />;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography>Selected Class:</Typography>
      <Typography>
        <SelectedCourseName />
      </Typography>
      <CourseSelectionButton {...props} />
    </Box>
  );
};
