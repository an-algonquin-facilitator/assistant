import { IModalProps, Modal } from "./Modal";
import { useWhoAmIQuery } from "../api/api";
import { Box, Button, CircularProgress, Link, Typography } from "@mui/material";
import { expires, secondsToMinutes } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";

const Expiration = ({ token }: { token: string }) => {
  const [timeLeft, setTimeLeft] = useState(secondsToMinutes(expires(token)));
  useEffect(() => {
    const interv = setInterval(
      () => setTimeLeft(secondsToMinutes(expires(token))),
      1000
    );
    return () => clearInterval(interv);
  }, [token]);
  return (
    <Typography variant="h4" component="code">
      {timeLeft}
    </Typography>
  );
};

const Content = ({ onValidated }: IProps) => {
  const token = useSelector((state: RootState) => state.token.value);
  const { data: whoAmI, loading, error } = useWhoAmIQuery();
  const exp = expires(token);
  const expired = exp > 0;

  const onClick = () => {
    onValidated();
  };

  if (!expired) {
    return (
      <>
        <Typography>
          Your token has expired. This is normal as it is only valid for 1 hour.
        </Typography>
        <p />
        <Typography>
          Visit{" "}
          <Link
            href="https://brightspace.algonquincollege.com/"
            target="_blank"
          >
            Brightspace
          </Link>{" "}
          and run the command again to refresh it.
        </Typography>
      </>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography sx={{ color: "red" }}>
        There was an error validating your token. Copy ONLY the token and not
        any other debug information.
      </Typography>
    );
  }

  return (
    <>
      {loading && <CircularProgress />}
      {!loading && error && <Typography>{error}</Typography>}
      {!loading && whoAmI && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">
            Welcome&nbsp;{whoAmI.FirstName}&nbsp;{whoAmI.LastName}
          </Typography>
          <Typography variant="h5">
            {whoAmI.UniqueName} ({whoAmI.Identifier})
          </Typography>
          <p />
          <Typography>Your token is valid for an extra:</Typography>
          <Expiration token={token} />
          <p />
          <Typography fontSize={"small"} sx={{ textAlign: "justify" }}>
            If you don't think that's enough time. Log out of Brightspace, log
            in and run the command again. This will get you a full hour.
          </Typography>
          <p></p>
          <Button disabled={exp < 0} onClick={onClick}>
            OK
          </Button>
        </Box>
      )}
    </>
  );
};

interface IProps extends IModalProps {
  onValidated: () => void;
}
export const ValidateTokenModal = (props: IProps) => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
