import { Box, Button, Typography } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import {
  usePlannedAssignments,
  usePlannedNews,
  usePlannedQuizzes,
} from "../../store/plan";
import { ReviewAssignment } from "./ReviewAssignment";
import { ReviewQuiz } from "./ReviewQuiz";
import { ReviewNews } from "./ReviewNews";
import type { ReactElement } from "react";

export const ReviewStep = ({ previous, next }: PageProps): ReactElement => {
  const assignments = usePlannedAssignments();
  const quizzes = usePlannedQuizzes();
  const news = usePlannedNews();

  return (
    <>
      {assignments.length > 0 && (
        <>
          <Typography variant="h5">Assignments:</Typography>
          {assignments.map((a) => (
            <ReviewAssignment key={a.id} assignment={a} />
          ))}
        </>
      )}
      {quizzes.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Quizzes:
          </Typography>
          {quizzes.map((q) => (
            <ReviewQuiz key={q.id} quiz={q} />
          ))}
        </>
      )}

      {news.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            News:
          </Typography>
          {news.map((n) => (
            <ReviewNews key={n.name} news={n} />
          ))}
        </>
      )}
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={previous}>BACK</Button>
        <Button onClick={next}>READY</Button>
      </Box>
    </>
  );
};
