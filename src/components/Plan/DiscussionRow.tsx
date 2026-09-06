import { TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { DiscussionPlan } from "../../store/plan";
import {
  addDiscussionPlan,
  removeDiscussionPlan,
  useIsDiscussionPlanned,
} from "../../store/plan";
import type { ReactElement } from "react";
import { PlanCheckbox } from "./PlanCheckbox";

interface DiscussionRowProps {
  discussion: DiscussionPlan;
}

export const DiscussionRow = ({
  discussion: d,
}: DiscussionRowProps): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <PlanCheckbox
          id={d.id}
          elem={d}
          add={addDiscussionPlan}
          remove={removeDiscussionPlan}
          useIsPlanned={useIsDiscussionPlanned}
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>{d.name}</Typography>
      </TableCell>
      <TableCell>
        <PlannedDate date={d.start} offset={d.startOffset} />
      </TableCell>
      <TableCell>
        <PlannedDate
          date={d.due}
          offset={d.dueOffset}
          holidayOffset={d.holidayOffset}
        />
      </TableCell>
      <TableCell>
        <PlannedDate
          date={d.end}
          offset={d.endOffset}
          holidayOffset={d.holidayOffset}
        />
      </TableCell>
    </TableRow>
  );
};
