import { Box, Paper, Typography } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import type { ReactElement } from "react";

interface IProps {
  str: string;
}

export const WarningString = ({ str }: IProps): ReactElement => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <WarningRoundedIcon color="warning" />
      <Paper sx={{ m: 2, p: 2 }} elevation={5}>
        <Typography
          fontFamily={"Monaco"}
          component="span"
          sx={{ color: "orange" }}
        >
          {'"' + str + '"'}
        </Typography>
      </Paper>
    </Box>
  );
};
