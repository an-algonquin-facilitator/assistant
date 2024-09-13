import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { IAssignmentPlan } from "../../store/plan";
import {
  addAssignmentPlan,
  removeAssignmentPlan,
  useIsAllAssignmentPlanned,
} from "../../store/plan";
import { AssignmentRow } from "./AssignmentRow";
import { useAppDispatch } from "../../store/hooks";
import type { ReactElement } from "react";

interface AssignmentTabProps {
  assignments: IAssignmentPlan[];
}

export const AssignmentTab = ({
  assignments,
}: AssignmentTabProps): ReactElement => {
  const dispatch = useAppDispatch();
  const allPlanned = useIsAllAssignmentPlanned();

  const onCheck = (_: unknown, checked: boolean): void => {
    const f = checked ? addAssignmentPlan : removeAssignmentPlan;
    assignments.forEach((a) => dispatch(f(a)));
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox checked={allPlanned} onChange={onCheck} />
          </TableCell>
          <TableCell>
            <Typography>Name</Typography>
          </TableCell>
          <TableCell>
            <Typography>Start</Typography>
          </TableCell>
          <TableCell>
            <Typography>Due</Typography>
          </TableCell>
          <TableCell>
            <Typography>End</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assignments.map((a) => (
          <AssignmentRow key={a.id} assignment={a} />
        ))}
      </TableBody>
    </Table>
  );
};
