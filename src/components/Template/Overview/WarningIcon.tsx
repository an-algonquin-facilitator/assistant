import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton } from "@mui/material";
import type { PropsWithChildren, ReactElement } from "react";
import { useState } from "react";
import { Modal } from "../../Modal";

export const WarningIcon = ({ children }: PropsWithChildren): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <HelpOutlineIcon sx={{ fill: "orange" }} />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        {children}
      </Modal>
    </>
  );
};
