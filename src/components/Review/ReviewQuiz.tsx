import QuizIcon from "@mui/icons-material/Quiz";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import type { QuizPlan } from "../../store/plan";
import { dateOffsetToString, formatDate } from "../Review/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactElement } from "react";
import { changeExpanded, useIsExpanded } from "../../store/review";
import { useAppDispatch } from "../../store/hooks";

interface ReviewQuizProps {
  quiz: QuizPlan;
}

export const ReviewQuiz = ({ quiz }: ReviewQuizProps): ReactElement => {
  const id = "Q" + quiz.id;

  const isExpanded = useIsExpanded(id);
  const dispatch = useAppDispatch();
  return (
    <>
      <Accordion
        expanded={isExpanded}
        onChange={() => dispatch(changeExpanded(id))}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <QuizIcon /> {quiz.name} ({quiz.id})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Tooltip
            title={
              <Typography>{dateOffsetToString(quiz.startOffset)}</Typography>
            }
          >
            <Typography>Start: {formatDate(quiz.start)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(quiz.dueOffset, quiz.holidayOffset)}
              </Typography>
            }
          >
            <Typography>Due: {formatDate(quiz.due)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>{dateOffsetToString(quiz.endOffset)}</Typography>
            }
          >
            <Typography>End: {formatDate(quiz.end)}</Typography>
          </Tooltip>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
