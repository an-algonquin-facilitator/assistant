import { TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { AgentPlan } from "../../store/plan";
import {
  addAgentPlan,
  removeAgentPlan,
  useIsAgentPlanned,
} from "../../store/plan";
import type { ReactElement } from "react";
import { PlanCheckbox } from "./PlanCheckbox";
import { AgentEmailButton } from "./AgentEmailButton";

interface AgentRowProps {
  agent: AgentPlan;
}

export const AgentRow = ({ agent: a }: AgentRowProps): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <PlanCheckbox
          id={a.name}
          elem={a}
          add={addAgentPlan}
          remove={removeAgentPlan}
          useIsPlanned={useIsAgentPlanned}
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>
          {a.name}
          {a.existingId === undefined ? " (new)" : ` (${a.existingId})`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{a.scheduleSummary}</Typography>
        {a.scheduleStart !== undefined && (
          <PlannedDate
            date={a.scheduleStart}
            offset={a.scheduleStartOffset ?? {}}
          />
        )}
      </TableCell>
      <TableCell>
        {a.roleSummaries.length === 0 && <Typography>All roles</Typography>}
        {a.roleSummaries.map((r) => (
          <Typography key={r}>{r}</Typography>
        ))}
      </TableCell>
      <TableCell>
        {a.conditionSummaries.length === 0 && <Typography>None</Typography>}
        {a.conditionSummaries.map((c) => (
          <Typography key={c}>{c}</Typography>
        ))}
      </TableCell>
      <TableCell>
        <AgentEmailButton agent={a} />
      </TableCell>
    </TableRow>
  );
};
