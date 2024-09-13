import { Box, Link, Typography } from "@mui/material";
import { CenterOK } from "./CenterOK";
interface ExpiredTokenProps {
  onClose: () => void;
}
export const ExpiredToken = ({ onClose }: ExpiredTokenProps) => {
  return (
    <Box sx={{ maxWidth: "400px" }}>
      <Typography variant="h4">Expired Token</Typography>
      <br />
      <Typography>
        Your token has expired. This is normal as it is only valid for 1 hour.
      </Typography>
      <p />
      <Typography>
        Visit{" "}
        <Link
          href="https://brightspace.algonquincollege.com/"
          target="_blank"
          rel="noreferrer"
        >
          Brightspace
        </Link>{" "}
        again, refresh the page to make sure you get a new session, and run the
        command again.
      </Typography>

      <CenterOK onClick={onClose} />
    </Box>
  );
};
