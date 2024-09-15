import type { CircularProgressProps } from "@mui/material";
import { Box, CircularProgress } from "@mui/material";
import type { ReactElement } from "react";

export const Loading = (props: CircularProgressProps): ReactElement => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress {...props} />
    </Box>
  );
};
