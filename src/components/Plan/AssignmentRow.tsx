import { TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { AssignmentPlan } from "../../store/plan";
import {
  addAssignmentPlan,
  removeAssignmentPlan,
  useIsAssignmentPlanned,
} from "../../store/plan";
import type { ReactElement } from "react";
import { PlanCheckbox } from "./PlanCheckbox";

interface AssignmentRowProps {
  assignment: AssignmentPlan;
}

export const AssignmentRow = ({
  assignment: a,
}: AssignmentRowProps): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <PlanCheckbox
          id={a.id}
          elem={a}
          add={addAssignmentPlan}
          remove={removeAssignmentPlan}
          useIsPlanned={useIsAssignmentPlanned}
        />
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
        <PlannedDate
          date={a.end}
          offset={a.endOffset}
          holidayOffset={a.holidayOffset}
        />
      </TableCell>
    </TableRow>
  );
};
