import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useWhoAmIQuery } from "../../../api/api";
import { WhoAmIError } from "./WhoAmIError";
import { TokenTimeRemaining } from "./TokenTimeRemaining";
import { useToken } from "../../../store/token";
import { tokenExpiryDateUnix } from "../utils";
import { NoWhoAmI } from "./NoWhoAmI";

interface WhoAmIProps {
  onValidate(valid: boolean): void;
}

export const WhoAmI = ({ onValidate }: WhoAmIProps) => {
  const token = useToken();
  const millisRemaining = tokenExpiryDateUnix(token);
  const { data: whoAmI, loading, error } = useWhoAmIQuery();

  const onNotValid = () => onValidate(false);

  if (loading) return <CircularProgress />;
  if (error) return <WhoAmIError onClose={onNotValid} />;
  if (!whoAmI) return <NoWhoAmI onClose={onNotValid} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4">Valid Token</Typography>
      <Typography>
        This is a token for {whoAmI.FirstName} {whoAmI.LastName}
      </Typography>

      <Typography>
        username: {whoAmI.UniqueName} ({whoAmI.Identifier})
      </Typography>
      <Typography sx={{ mt: 2 }}>Your token is valid for an extra:</Typography>
      <Typography sx={{ mt: 2 }} variant="h4" component="code">
        <TokenTimeRemaining />
      </Typography>
      <p />
      <Typography sx={{ textAlign: "justify" }}>
        If you don't think that's enough time. Log out of Brightspace, log in
        and run the command again. A fresh token should have 1h before expiring.
        I recommend at least 10 minutes.
      </Typography>
      <p></p>
      <Button disabled={millisRemaining < 0} onClick={() => onValidate(true)}>
        OK
      </Button>
    </Box>
  );
};
