import type { ReactElement } from "react";
import { useApplyCompleted } from "../../store/apply";
import { Box, Typography } from "@mui/material";

export const SuccessMessage = (): ReactElement => {
  const isCompleted = useApplyCompleted();
  if (!isCompleted) return <></>;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4">Success</Typography>
      <Typography>Refresh the page to setup another course.</Typography>
    </Box>
  );
};
