import { Paper, Tooltip, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Code that you can paste in ACO to print the token.
// We can't auto copy to clipboard because of permission stuff.
const code = `console.log(JSON.parse(localStorage["D2L.Fetch.Tokens"])["*:*:*"].access_token);`;

export const AcquireTokenCodeSnippet = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const onClick = (): void => {
    navigator.clipboard.writeText(code);
    setOpen(true);
  };

  return (
    <Tooltip
      title={<Typography>Copied!</Typography>}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Paper sx={{ m: 2, p: 0 }} elevation={5} onClick={onClick}>
        <SyntaxHighlighter
          language="javascript"
          style={monokai}
          customStyle={{
            padding: 32,
            borderRadius: 4,
            userSelect: "none",
            margin: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Paper>
    </Tooltip>
  );
};
