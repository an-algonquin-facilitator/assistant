import QuizIcon from "@mui/icons-material/Quiz";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import type { IQuizPlan } from "../../store/plan";
import { dateOffsetToString, formatDate } from "../Review/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ReviewQuizProps {
  quiz: IQuizPlan;
  expanded: string;
  setExpanded: (id: string) => void;
}

export const ReviewQuiz = ({
  quiz,
  expanded,
  setExpanded,
}: ReviewQuizProps) => {
  const id = "Q" + quiz.id;
  return (
    <>
      <Accordion expanded={expanded === id} onChange={() => setExpanded(id)}>
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
