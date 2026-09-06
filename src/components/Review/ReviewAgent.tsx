import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AgentPlan } from "../../store/plan";
import { ActionRepeatType } from "../../api/agent";
import { dateOffsetToString, formatDate } from "./utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactElement } from "react";
import { changeExpanded, useIsExpanded } from "../../store/review";
import { useAppDispatch } from "../../store/hooks";

interface ReviewAgentProps {
  agent: AgentPlan;
}

export const ReviewAgent = ({ agent }: ReviewAgentProps): ReactElement => {
  const id = "G" + agent.name;
  const isExpanded = useIsExpanded(id);
  const dispatch = useAppDispatch();
  const email = agent.agentData.Action?.EmailAction;
  const repeat = agent.agentData.Action?.RepeatType;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => dispatch(changeExpanded(id))}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <SmartToyIcon /> {agent.name}{" "}
          {agent.existingId === undefined
            ? "(new)"
            : `(update ${agent.existingId})`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Enabled: {agent.agentData.IsEnabled ? "yes" : "no"}
        </Typography>
        <Typography>Schedule: {agent.scheduleSummary}</Typography>
        {agent.scheduleStart !== undefined && (
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(agent.scheduleStartOffset ?? {})}
              </Typography>
            }
          >
            <Typography>Start: {formatDate(agent.scheduleStart)}</Typography>
          </Tooltip>
        )}
        {agent.scheduleEnd !== undefined && (
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(agent.scheduleEndOffset ?? {})}
              </Typography>
            }
          >
            <Typography>End: {formatDate(agent.scheduleEnd)}</Typography>
          </Tooltip>
        )}
        <Typography>
          Roles:{" "}
          {agent.roleSummaries.length === 0
            ? "all roles"
            : agent.roleSummaries.join(", ")}
        </Typography>
        <Typography>
          Release conditions:{" "}
          {agent.conditionSummaries.length === 0
            ? "none"
            : `${agent.conditions?.Expression.ExpressionParams.Operator ?? "All"} of`}
        </Typography>
        {agent.conditionSummaries.map((c) => (
          <Typography key={c} sx={{ ml: 2 }}>
            - {c}
          </Typography>
        ))}
        <Typography>
          Action repeats:{" "}
          {repeat === ActionRepeatType.EveryTime
            ? "every time"
            : "only the first time"}
        </Typography>
        {email && (
          <Card elevation={24} sx={{ p: 2, mt: 1 }}>
            <Typography>To: {email.To}</Typography>
            {email.Cc !== null && email.Cc !== "" && (
              <Typography>Cc: {email.Cc}</Typography>
            )}
            {email.Bcc !== null && email.Bcc !== "" && (
              <Typography>Bcc: {email.Bcc}</Typography>
            )}
            <Typography sx={{ mb: 1 }}>Subject: {email.Subject}</Typography>
            <Typography>
              <span dangerouslySetInnerHTML={{ __html: email.Message ?? "" }} />
            </Typography>
          </Card>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
