import { Box } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { ReactElement } from "react";

interface IProps {
  str: string;
}

export const WarningString = ({ str }: IProps): ReactElement => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <WarningRoundedIcon color="warning" />
      <SyntaxHighlighter language="javascript" style={monokai}>
        {'"' + str + '"'}
      </SyntaxHighlighter>
    </Box>
  );
};
