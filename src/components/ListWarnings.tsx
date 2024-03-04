import { Box, Typography } from "@mui/material";
import { WarningString } from "./WarningString";

interface IProps {
  warnings: string[];
  explanation: string;
}

export const ListWarnings = ({ warnings, explanation }: IProps) => {
  if (warnings.length === 0) return <></>;
  return (
    <Box sx={{ m: 2 }}>
      <Typography>{explanation}</Typography>
      {warnings.map((w) => (
        <WarningString key={w} str={w} />
      ))}
    </Box>
  );
};
