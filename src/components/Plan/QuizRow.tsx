import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { IQuizPlan } from "../../store/plan";
import {
  addQuizPlan,
  removeQuizPlan,
  useIsQuizPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";

interface QuizRowProps {
  quiz: IQuizPlan;
}

export const QuizRow = ({ quiz: q }: QuizRowProps) => {
  const isPlanned = useIsQuizPlanned(q.id);
  const dispatch = useAppDispatch();

  const onChange = (_: unknown, checked: boolean) => {
    dispatch(checked ? addQuizPlan(q) : removeQuizPlan(q));
  };
  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isPlanned} onChange={onChange} />
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
        <PlannedDate date={q.end} offset={q.endOffset} />
      </TableCell>
    </TableRow>
  );
};
