import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import {
  IAssignmentPlan,
  addAssignmentPlan,
  removeAssignmentPlan,
  useIsAssignmentPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";

interface AssignmentRowProps {
  assignment: IAssignmentPlan;
}

export const AssignmentRow = ({ assignment: a }: AssignmentRowProps) => {
  const isPlanned = useIsAssignmentPlanned(a.id);
  const dispatch = useAppDispatch();

  const onChange = (_: unknown, checked: boolean) => {
    dispatch(checked ? addAssignmentPlan(a) : removeAssignmentPlan(a));
  };
  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isPlanned} onChange={onChange} />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>{a.name}</Typography>
      </TableCell>
      <TableCell>
        <PlannedDate date={a.start} offset={a.startOffset} />
      </TableCell>
      <TableCell>
        <PlannedDate
          date={a.due}
          offset={a.dueOffset}
          holidayOffset={a.holidayOffset}
        />
      </TableCell>
      <TableCell>
        <PlannedDate date={a.end} offset={a.endOffset} />
      </TableCell>
    </TableRow>
  );
};
