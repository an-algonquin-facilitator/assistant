import AssignmentIcon from "@mui/icons-material/Assignment";
import { Box, Tooltip, Typography } from "@mui/material";
import { IAssignmentPlan } from "../store/plan";
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

interface IReviewAssignmentProps {
  assignment: IAssignmentPlan;
}

export const ReviewAssignment = ({ assignment }: IReviewAssignmentProps) => {
  return (
    <>
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        <AssignmentIcon /> {assignment.name} ({assignment.id})
      </Typography>
      <Box sx={{ m: 2 }}>
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
            <Typography>{dateOffsetToString(assignment.dueOffset)}</Typography>
          }
        >
          <Typography>Due: {formatDate(assignment.due)}</Typography>
        </Tooltip>
        <Tooltip
          title={
            <Typography>{dateOffsetToString(assignment.endOffset)}</Typography>
          }
        >
          <Typography>End: {formatDate(assignment.end)}</Typography>
        </Tooltip>
      </Box>
    </>
  );
};
