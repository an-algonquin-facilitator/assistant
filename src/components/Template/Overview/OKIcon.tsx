import { IconButton } from "@mui/material";
import type { ReactElement } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const OKIcon = (): ReactElement => {
  return (
    <IconButton disabled={true}>
      <CheckCircleOutlineIcon color="success" />
    </IconButton>
  );
};
