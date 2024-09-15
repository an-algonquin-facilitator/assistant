import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { AssignmentPlan } from "../../store/plan";
import {
  addAssignmentPlan,
  removeAssignmentPlan,
  useIsAssignmentPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";
import type { ReactElement } from "react";

interface AssignmentRowProps {
  assignment: AssignmentPlan;
}

export const AssignmentRow = ({
  assignment: a,
}: AssignmentRowProps): ReactElement => {
  const isPlanned = useIsAssignmentPlanned(a.id);
  const dispatch = useAppDispatch();

  const onChange = (_: unknown, checked: boolean): void => {
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
