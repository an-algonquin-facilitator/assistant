import { Typography } from "@mui/material";
import env from "../env.json";

export const Build = (): React.ReactElement => {
  return (
    <Typography sx={{ position: "sticky", m: 2, bottom: 0 }}>
      Build: {env.hash}
    </Typography>
  );
};
