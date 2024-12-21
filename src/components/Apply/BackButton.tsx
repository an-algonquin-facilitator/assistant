import type { ReactElement } from "react";
import type { PageProps } from "../Assistant/Assistant";
import { Box, Button } from "@mui/material";
import { useApplyStarted } from "../../store/apply";

export const BackButton = ({ previous }: PageProps): ReactElement => {
  const isStarted = useApplyStarted();

  if (isStarted) return <></>;
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Button onClick={previous}>BACK</Button>
    </Box>
  );
};
