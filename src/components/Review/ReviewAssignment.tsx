import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AssignmentPlan } from "../../store/plan";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { dateOffsetToString, formatDate } from "./utils";
import type { ReactElement } from "react";
import { changeExpanded, useIsExpanded } from "../../store/review";
import { useAppDispatch } from "../../store/hooks";

interface IReviewAssignmentProps {
  assignment: AssignmentPlan;
}

export const ReviewAssignment = ({
  assignment,
}: IReviewAssignmentProps): ReactElement => {
  const id = "A" + assignment.id;
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
            <AssignmentIcon /> {assignment.name} ({assignment.id})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(assignment.startOffset)}
              </Typography>
            }
          >
            <Typography>Start: {formatDate(assignment.start)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(
                  assignment.dueOffset,
                  assignment.holidayOffset,
                )}
              </Typography>
            }
          >
            <Typography>Due: {formatDate(assignment.due)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(
                  assignment.endOffset,
                  assignment.holidayOffset,
                )}
              </Typography>
            }
          >
            <Typography>End: {formatDate(assignment.end)}</Typography>
          </Tooltip>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
