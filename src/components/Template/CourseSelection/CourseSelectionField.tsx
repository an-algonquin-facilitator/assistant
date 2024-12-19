import { Box, Typography } from "@mui/material";
import { CourseSelectionButton } from "./ClassSelectionButton";
import type { ReactElement } from "react";
import type { Enrollment } from "../../../api/enrollment";
import { useTemplateFile } from "../../../store/templateStep";

interface CourseSelectionFieldProps {
  courseName: string;
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

export const CourseSelectionField = (
  props: CourseSelectionFieldProps,
): ReactElement => {
  const { courseName } = props;
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
      <Typography>{courseName}</Typography>
      <CourseSelectionButton {...props} />
    </Box>
  );
};
