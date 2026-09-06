import { IconButton, Typography } from "@mui/material";
import { useState, type ReactElement } from "react";
import { Modal } from "../Modal";
import EmailIcon from "@mui/icons-material/Email";
import type { AgentPlan } from "../../store/plan";

interface AgentEmailButtonProps {
  agent: AgentPlan;
}

export const AgentEmailButton = ({
  agent,
}: AgentEmailButtonProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const email = agent.agentData.Action?.EmailAction;
  if (!email) return <Typography>None</Typography>;
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EmailIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <Typography>To: {email.To}</Typography>
          {email.Cc !== null && email.Cc !== "" && (
            <Typography>Cc: {email.Cc}</Typography>
          )}
          {email.Bcc !== null && email.Bcc !== "" && (
            <Typography>Bcc: {email.Bcc}</Typography>
          )}
          <Typography sx={{ mb: 2 }}>Subject: {email.Subject}</Typography>
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: email.Message ?? "" }} />
          </Typography>
        </>
      </Modal>
    </>
  );
};
