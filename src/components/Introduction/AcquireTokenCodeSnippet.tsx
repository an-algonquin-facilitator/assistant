import type { TypographyProps } from "@mui/material";
import { Paper, Tooltip, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useState } from "react";

// Code that you can paste in ACO to print the token.
// We can't auto copy to clipboard because of permission stuff.
export const CopyTokenJS = `console.log(JSON.parse(localStorage["D2L.Fetch.Tokens"])["*:*:*"].access_token);`;

const T = (props: TypographyProps & { col: string }): ReactElement => {
  return (
    <Typography
      fontFamily={"Monaco"}
      component="span"
      sx={{ color: props.col }}
    >
      {props.children}
    </Typography>
  );
};

export const AcquireTokenCodeSnippet = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const onClick = (): void => {
    void navigator.clipboard.writeText(CopyTokenJS);
    setOpen(true);
  };

  return (
    <Tooltip
      title={<Typography>Copied!</Typography>}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Paper sx={{ m: 2, p: 2 }} elevation={5} onClick={onClick}>
        <Typography fontFamily={"Monaco"} component="span">
          console.<T col={"#dcdcaa"}>log</T>
          <T col={"#179fff"}>{"("}</T>JSON.<T col={"#dcdcaa"}>parse</T>
          <T col={"#ffd702"}>{"("}</T>localstorage<T col={"#da6fd6"}>{"["}</T>
          <T col={"#ce9178"}>"D2L.Fetch.Tokens"</T>
          <T col={"#da6fd6"}>{"]"}</T>
          <T col={"#ffd702"}>{")"}</T>
          <T col={"#ffd702"}>{"["}</T>
          <T col={"#ce9178"}>"*:*:*"</T>
          <T col={"#ffd702"}>{"]"}</T>.access_token<T col={"#179fff"}>{")"}</T>;
        </Typography>
      </Paper>
    </Tooltip>
  );
};
