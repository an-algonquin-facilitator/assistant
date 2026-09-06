import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { DiscussionPlan } from "../../store/plan";
import {
  addDiscussionPlan,
  removeDiscussionPlan,
  useIsAllDiscussionPlanned,
} from "../../store/plan";
import { DiscussionRow } from "./DiscussionRow";
import type { ReactElement } from "react";
import { AllPlannedCheckbox } from "./AllPlannedCheckbox";

interface DiscussionTabProps {
  discussions: DiscussionPlan[];
}

export const DiscussionPanel = ({
  discussions,
}: DiscussionTabProps): ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <AllPlannedCheckbox
              elems={discussions}
              add={addDiscussionPlan}
              remove={removeDiscussionPlan}
              useIsAllPlanned={useIsAllDiscussionPlanned}
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
        {discussions.map((q) => (
          <DiscussionRow key={q.id} discussion={q} />
        ))}
      </TableBody>
    </Table>
  );
};
