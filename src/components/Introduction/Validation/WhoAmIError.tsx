import { Box, Typography } from "@mui/material";
import { CenterOK } from "./CenterOK";
import type { ReactElement } from "react";

interface WhoAmIErrorProps {
  onClose: () => void;
}

export const WhoAmIError = ({ onClose }: WhoAmIErrorProps): ReactElement => {
  return (
    <Box sx={{ maxWidth: "400px" }}>
      <Typography variant="h4">Validation Error</Typography>
      <br />
      <Typography>
        There was an error validating your token. Copy ONLY the token and not
        any other debug information.
      </Typography>
      <br />
      <Typography>
        If the error persists please contact me I'd be happy to help you.
      </Typography>
      <CenterOK onClick={onClose} />
    </Box>
  );
};
