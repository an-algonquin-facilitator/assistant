import QuizIcon from "@mui/icons-material/Quiz";
import { Box, Tooltip, Typography } from "@mui/material";
import { IQuizPlan } from "../store/plan";
import { DateOffset } from "../store/template";

const dateOffsetToString = (offset: DateOffset) => {
  let str = "semester start";
  if (offset.weeks) str += ` + ${offset.weeks} weeks`;
  if (offset.days) str += ` + ${offset.days} days`;
  return str;
};

const formatDate = (unix: number) => {
  return new Date(unix).toLocaleString();
};

interface IProps {
  quiz: IQuizPlan;
}

export const ReviewQuiz = ({ quiz }: IProps) => {
  return (
    <>
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        <QuizIcon /> {quiz.name} ({quiz.id})
      </Typography>
      <Box sx={{ m: 2 }}>
        <Tooltip
          title={
            <Typography>{dateOffsetToString(quiz.startOffset)}</Typography>
          }
        >
          <Typography>Start: {formatDate(quiz.start)}</Typography>
        </Tooltip>
        <Tooltip
          title={<Typography>{dateOffsetToString(quiz.dueOffset)}</Typography>}
        >
          <Typography>Due: {formatDate(quiz.due)}</Typography>
        </Tooltip>
        <Tooltip
          title={<Typography>{dateOffsetToString(quiz.endOffset)}</Typography>}
        >
          <Typography>End: {formatDate(quiz.end)}</Typography>
        </Tooltip>
      </Box>
    </>
  );
};
