import { Box, Typography } from "@mui/material";
import { CourseSelectionButton } from "./ClassSelectionButton";
import type { ReactElement } from "react";
import type { Enrollment } from "../../../api/enrollment";
import {
  useSelectedCourse,
  useTemplateFile,
} from "../../../store/templateStep";

interface CourseSelectionFieldProps {
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

const SelectedCourseName = (): ReactElement => {
  const course = useSelectedCourse();
  return <>{course.data?.course.Name ?? "None"}</>;
};

export const CourseSelectionField = (
  props: CourseSelectionFieldProps,
): ReactElement => {
  const templateFile = useTemplateFile();
  if (!templateFile) return <></>;
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
