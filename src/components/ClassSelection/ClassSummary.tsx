import { Box, CircularProgress, Typography } from "@mui/material";
import {
  useCourse,
  useCourseError,
  useFolderCount,
  useIsCourseLoading,
  useNewsCount,
  useQuizCount,
} from "../../store/course";

export const ClassSummary = () => {
  const course = useCourse();
  const isLoading = useIsCourseLoading();
  const error = useCourseError();
  const folderCount = useFolderCount();
  const quizzesCount = useQuizCount();
  const newsCount = useNewsCount();

  if (!course.data) return <></>;
  if (error) return <Typography>Error loading course: {error}</Typography>;
  if (isLoading) return <CircularProgress />;
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">This class contains the following:</Typography>
      <Typography>{folderCount} assignments</Typography>
      <Typography>{quizzesCount} quizzes</Typography>
      <Typography>{newsCount} announcements</Typography>
    </Box>
  );
};
