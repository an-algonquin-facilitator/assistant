import { Box, Button, Typography } from "@mui/material";
import type { ReactElement } from "react";

interface ReadyProps {
  onClick: () => void;
}

export const Ready = ({ onClick }: ReadyProps): ReactElement => {
  return (
    <>
      <Typography variant="h3">Ready to apply your plan?</Typography>

      <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
        <Button size="large" onClick={onClick}>
          Apply!
        </Button>
      </Box>
    </>
  );
};
