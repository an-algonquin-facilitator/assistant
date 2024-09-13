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
import { useState } from "react";

export const ReviewStep = ({ previous, next }: PageProps) => {
  const [expanded, setExpanded] = useState("");
  const assignments = usePlannedAssignments();
  const quizzes = usePlannedQuizzes();
  const news = usePlannedNews();

  const changeExpanded = (id: string) => setExpanded(id === expanded ? "" : id);

  return (
    <>
      {assignments.length > 0 && (
        <>
          <Typography variant="h5">Assignments:</Typography>
          {assignments.map((a) => (
            <ReviewAssignment
              key={a.id}
              assignment={a}
              expanded={expanded}
              setExpanded={changeExpanded}
            />
          ))}
        </>
      )}
      {quizzes.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Quizzes:
          </Typography>
          {quizzes.map((q) => (
            <ReviewQuiz
              key={q.id}
              quiz={q}
              expanded={expanded}
              setExpanded={changeExpanded}
            />
          ))}
        </>
      )}

      {news.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            News:
          </Typography>
          {news.map((n) => (
            <ReviewNews
              key={n.name}
              news={n}
              expanded={expanded}
              setExpanded={changeExpanded}
            />
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
