import { Typography } from "@mui/material";
import type { ReactElement } from "react";

export const Instructions = (): ReactElement => {
  return (
    <>
      <Typography variant="h3">Let's setup your course</Typography>
      <Typography sx={{ mt: 2 }}>
        Sign in with Microsoft below. Your access token is only saved on your
        computer, never shared with anyone, and only valid for one hour.
      </Typography>
    </>
  );
};
