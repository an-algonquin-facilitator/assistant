import { Typography } from "@mui/material";
import { CenterOK } from "./CenterOK";
import type { ReactElement } from "react";

interface NoWhoAmIProps {
  onClose: () => void;
}

export const NoWhoAmI = ({ onClose }: NoWhoAmIProps): ReactElement => {
  return (
    <>
      <Typography variant="h4">Unknown Error</Typography>
      <br />
      <Typography>
        Data is empty but request didn't fail, please report a bug
      </Typography>
      <CenterOK onClick={onClose} />
    </>
  );
};
