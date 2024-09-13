import { Box, Button } from "@mui/material";
import type { ReactElement } from "react";

interface CenterOKProps {
  onClick: () => void;
}

export const CenterOK = ({ onClick }: CenterOKProps): ReactElement => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={onClick}>OK</Button>
    </Box>
  );
};
