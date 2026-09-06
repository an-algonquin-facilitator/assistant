import { Box, Button, Typography } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import {
  usePlannedAgents,
  usePlannedAssignments,
  usePlannedDiscussions,
  usePlannedNews,
  usePlannedQuizzes,
} from "../../store/plan";
import { ReviewAssignment } from "./ReviewAssignment";
import { ReviewQuiz } from "./ReviewQuiz";
import { ReviewDiscussion } from "./ReviewDiscussion";
import { ReviewAgent } from "./ReviewAgent";
import { ReviewNews } from "./ReviewNews";
import type { ReactElement } from "react";

export const ReviewStep = ({ previous, next }: PageProps): ReactElement => {
  const assignments = usePlannedAssignments();
  const quizzes = usePlannedQuizzes();
  const discussions = usePlannedDiscussions();
  const agents = usePlannedAgents();
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
      {discussions.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Discussions:
          </Typography>
          {discussions.map((d) => (
            <ReviewDiscussion key={d.id} discussion={d} />
          ))}
        </>
      )}
      {agents.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Intelligent Agents:
          </Typography>
          {agents.map((a) => (
            <ReviewAgent key={a.name} agent={a} />
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
