import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import { IAssignmentPlan } from "../../store/plan";

interface AssignmentRowProps {
  assignment: IAssignmentPlan;
}

export const AssignmentRow = ({ assignment }: AssignmentRowProps) => {
  const a = assignment;

  const onChange = (_: unknown, checked: boolean) => {
    console.log(checked);
  };
  return (
    <TableRow>
      <TableCell>
        <Checkbox onChange={onChange} />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>{a.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <PlannedDate date={a.start} offset={a.startOffset} />
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <PlannedDate
            date={a.due}
            offset={a.dueOffset}
            holidayOffset={a.holidayOffset}
          />
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <PlannedDate date={a.end} offset={a.endOffset} />
        </Typography>
      </TableCell>
    </TableRow>
  );
};
