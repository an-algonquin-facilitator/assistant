import { Input, Link, Paper, Typography } from "@mui/material";
import { insertToken, useToken } from "../../store/token";
import { useAppDispatch } from "../../store/hooks";
import { AcquireTokenCodeSnippet } from "./AcquireTokenCodeSnippet";
import type { ReactElement } from "react";

export const TokenField = (): ReactElement => {
  const token = useToken();
  const dispatch = useAppDispatch();

  const onTokenChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(insertToken(e.target.value));
  };
  return (
    <Paper sx={{ p: 2, mt: 4 }} elevation={1}>
      <Typography variant="h6">Or paste a token manually</Typography>
      <Typography sx={{ mt: 1 }}>
        Open{" "}
        <Link
          href="https://brightspace.algonquincollege.com/"
          target="_blank"
          rel="noreferrer"
        >
          Brightspace
        </Link>
        , hit F12, open the <code>console</code> tab, paste this snippet, then
        copy the printed token below:
      </Typography>
      <AcquireTokenCodeSnippet />
      <Input
        value={token}
        onChange={onTokenChange}
        sx={{ width: "100%", mt: 2 }}
        placeholder="Paste the token here"
      />
    </Paper>
  );
};
