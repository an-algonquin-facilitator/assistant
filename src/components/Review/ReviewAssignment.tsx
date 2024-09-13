import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import type { IAssignmentPlan } from "../../store/plan";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { dateOffsetToString, formatDate } from "./utils";
import type { ReactElement } from "react";

interface IReviewAssignmentProps {
  assignment: IAssignmentPlan;
  expanded: string;
  setExpanded: (id: string) => void;
}

export const ReviewAssignment = ({
  assignment,
  expanded,
  setExpanded,
}: IReviewAssignmentProps): ReactElement => {
  const id = "A" + assignment.id;
  return (
    <>
      <Accordion expanded={expanded === id} onChange={() => setExpanded(id)}>
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
                {dateOffsetToString(assignment.endOffset)}
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
