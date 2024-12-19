import { TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { QuizPlan } from "../../store/plan";
import {
  addQuizPlan,
  removeQuizPlan,
  useIsQuizPlanned,
} from "../../store/plan";
import type { ReactElement } from "react";
import { PlanCheckbox } from "./PlanCheckbox";

interface QuizRowProps {
  quiz: QuizPlan;
}

export const QuizRow = ({ quiz: q }: QuizRowProps): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <PlanCheckbox
          id={q.id}
          elem={q}
          add={addQuizPlan}
          remove={removeQuizPlan}
          useIsPlanned={useIsQuizPlanned}
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>{q.name}</Typography>
      </TableCell>
      <TableCell>
        <PlannedDate date={q.start} offset={q.startOffset} />
      </TableCell>
      <TableCell>
        <PlannedDate
          date={q.due}
          offset={q.dueOffset}
          holidayOffset={q.holidayOffset}
        />
      </TableCell>
      <TableCell>
        <PlannedDate
          date={q.end}
          offset={q.endOffset}
          holidayOffset={q.holidayOffset}
        />
      </TableCell>
    </TableRow>
  );
};
