import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { ICoursePlan } from "../../store/plan";
import { AssignmentRow } from "./AssignmentRow";

interface AssignmentTabProps {
  plan: ICoursePlan;
}

export const AssignmentTab = ({ plan }: AssignmentTabProps) => {
  const assignments = plan.assignments;
  return (
    <Table>
      <TableHead>
        <TableCell>
          <Checkbox />
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
      </TableHead>
      <TableBody>
        {assignments.map((a) => (
          <AssignmentRow assignment={a} />
        ))}
      </TableBody>
    </Table>
  );
};
