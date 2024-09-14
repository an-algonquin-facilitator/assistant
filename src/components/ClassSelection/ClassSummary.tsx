import { Box, CircularProgress, Typography } from "@mui/material";
import type { ReactElement } from "react";
import type { Response } from "../../api/utils";
import type { Course } from "../../api/course";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";
import { isDefined } from "../Introduction/utils";

interface ClassSummaryProps {
  course: Response<Course>;
  folders: Response<Folder[]>;
  quizzes: Response<Quiz[]>;
  news: Response<News[]>;
}

export const ClassSummary = ({
  course,
  folders,
  quizzes,
  news,
}: ClassSummaryProps): ReactElement => {
  const notSelected =
    course.data === undefined && !course.loading && course.error === undefined;
  if (notSelected) return <></>;

  const isLoading =
    course.loading || folders.loading || quizzes.loading || news.loading;
  if (isLoading) return <CircularProgress />;

  const errors = [
    course.error ?? undefined,
    folders.error ?? undefined,
    quizzes.error ?? undefined,
    news.error ?? undefined,
  ].filter(isDefined);
  if (errors.length > 0) {
    return (
      <Box sx={{ mt: 4 }}>
        {errors.map((e) => (
          <Typography>{e}</Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">This course contains the following:</Typography>
      <Typography>{folders.data?.length ?? 0} assignments</Typography>
      <Typography>{quizzes.data?.length ?? 0} quizzes</Typography>
      <Typography>{news.data?.length ?? 0} announcements</Typography>
    </Box>
  );
};
