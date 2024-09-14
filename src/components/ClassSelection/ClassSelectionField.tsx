import { Box, Typography } from "@mui/material";
import { ClassSelectionButton } from "./ClassSelectionButton";
import type { ReactElement } from "react";
import type { Course } from "../../api/course";
import type { Response } from "../../api/utils";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";

interface ClassSelectionFieldProps {
  course: Response<Course>;
  setCourse: (resp: Response<Course>) => void;
  setFolders: (resp: Response<Folder[]>) => void;
  setQuizzes: (resp: Response<Quiz[]>) => void;
  setNews: (resp: Response<News[]>) => void;
}

export const ClassSelectionField = (
  props: ClassSelectionFieldProps,
): ReactElement => {
  const { course } = props;
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
      <Typography>{course.data?.Name ?? "None"}</Typography>
      <ClassSelectionButton {...props} />
    </Box>
  );
};
