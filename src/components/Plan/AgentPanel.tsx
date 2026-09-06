import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AgentPlan } from "../../store/plan";
import {
  addAgentPlan,
  removeAgentPlan,
  useIsAllAgentPlanned,
} from "../../store/plan";
import { AgentRow } from "./AgentRow";
import type { ReactElement } from "react";
import { AllPlannedCheckbox } from "./AllPlannedCheckbox";

interface AgentTabProps {
  agents: AgentPlan[];
}

export const AgentPanel = ({ agents }: AgentTabProps): ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <AllPlannedCheckbox
              elems={agents}
              add={addAgentPlan}
              remove={removeAgentPlan}
              useIsAllPlanned={useIsAllAgentPlanned}
            />
          </TableCell>
          <TableCell>
            <Typography>Name</Typography>
          </TableCell>
          <TableCell>
            <Typography>Runs</Typography>
          </TableCell>
          <TableCell>
            <Typography>Roles</Typography>
          </TableCell>
          <TableCell>
            <Typography>Release conditions</Typography>
          </TableCell>
          <TableCell>
            <Typography>Email</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {agents.map((a) => (
          <AgentRow key={a.name} agent={a} />
        ))}
      </TableBody>
    </Table>
  );
};
