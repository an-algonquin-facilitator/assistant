import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AssignmentPlan } from "../../store/plan";
import {
  addAssignmentPlan,
  removeAssignmentPlan,
  useIsAllAssignmentPlanned,
} from "../../store/plan";
import { AssignmentRow } from "./AssignmentRow";

import type { ReactElement } from "react";
import { AllPlannedCheckbox } from "./AllPlannedCheckbox";

interface AssignmentTabProps {
  assignments: AssignmentPlan[];
}

export const AssignmentPanel = ({
  assignments,
}: AssignmentTabProps): ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <AllPlannedCheckbox
              elems={assignments}
              add={addAssignmentPlan}
              remove={removeAssignmentPlan}
              useIsAllPlanned={useIsAllAssignmentPlanned}
            />
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
