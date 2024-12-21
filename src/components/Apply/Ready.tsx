import { Box, Button, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useApplyStarted } from "../../store/apply";
import { useAppDispatch } from "../../store/hooks";
import { apply } from "./apply";

export const Ready = (): ReactElement => {
  const isStarted = useApplyStarted();
  const dispatch = useAppDispatch();
  if (isStarted) return <></>;
  const onClick = (): void => {
    void apply(dispatch);
  };

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
