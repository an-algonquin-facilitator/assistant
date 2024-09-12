import { useCourseName } from "../../store/course";
import { Box, Typography } from "@mui/material";
import { ClassSelectionButton } from "./ClassSelectionButton";

export const ClassSelectionField = () => {
  const courseName = useCourseName();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>Selected Class:</Typography>
      <Typography>{courseName ? courseName : "None"}</Typography>
      <ClassSelectionButton />
    </Box>
  );
};
