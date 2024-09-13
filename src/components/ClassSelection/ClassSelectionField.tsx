import { useCourseName } from "../../store/course";
import { Box, Typography } from "@mui/material";
import { ClassSelectionButton } from "./ClassSelectionButton";
import type { ReactElement } from "react";

export const ClassSelectionField = (): ReactElement => {
  const courseName = useCourseName();
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
      <Typography>{courseName ? courseName : "None"}</Typography>
      <ClassSelectionButton />
    </Box>
  );
};
