import { Box, Typography } from "@mui/material";
import { ClassSelectionButton } from "./ClassSelectionButton";
import type { ReactElement } from "react";
import type { Enrollment } from "../../../api/enrollment";

interface ClassSelectionFieldProps {
  courseName: string;
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

export const ClassSelectionField = (
  props: ClassSelectionFieldProps,
): ReactElement => {
  const { courseName } = props;
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
      <ClassSelectionButton {...props} />
    </Box>
  );
};
