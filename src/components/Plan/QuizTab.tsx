import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { QuizPlan } from "../../store/plan";
import {
  addQuizPlan,
  removeQuizPlan,
  useIsAllQuizPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";
import { QuizRow } from "./QuizRow";
import type { ReactElement } from "react";

interface QuizTabProps {
  quizzes: QuizPlan[];
}

export const QuizTab = ({ quizzes }: QuizTabProps): ReactElement => {
  const dispatch = useAppDispatch();
  const allPlanned = useIsAllQuizPlanned();

  const onCheck = (_: unknown, checked: boolean): void => {
    const f = checked ? addQuizPlan : removeQuizPlan;
    quizzes.forEach((a) => dispatch(f(a)));
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
        {quizzes.map((q) => (
          <QuizRow key={q.id} quiz={q} />
        ))}
      </TableBody>
    </Table>
  );
};
