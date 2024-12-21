import {
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
import { QuizRow } from "./QuizRow";
import type { ReactElement } from "react";
import { AllPlannedCheckbox } from "./AllPlannedCheckbox";

interface QuizTabProps {
  quizzes: QuizPlan[];
}

export const QuizPanel = ({ quizzes }: QuizTabProps): ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <AllPlannedCheckbox
              elems={quizzes}
              add={addQuizPlan}
              remove={removeQuizPlan}
              useIsAllPlanned={useIsAllQuizPlanned}
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
        {quizzes.map((q) => (
          <QuizRow key={q.id} quiz={q} />
        ))}
      </TableBody>
    </Table>
  );
};
