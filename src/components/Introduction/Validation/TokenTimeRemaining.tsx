import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useToken } from "../../../store/token";
import { secondsToMinutes, tokenExpiryDateUnix } from "../utils";

const msPerSecond = 1000;

export const TokenTimeRemaining = (): ReactElement => {
  const token = useToken();
  const expiry = tokenExpiryDateUnix(token);
  const [timeLeft, setTimeLeft] = useState(secondsToMinutes(expiry));
  useEffect(() => {
    const interv = setInterval(
      () => setTimeLeft(secondsToMinutes(tokenExpiryDateUnix(token))),
      msPerSecond,
    );
    return (): void => clearInterval(interv);
  }, [token, setTimeLeft]);
  return <>{timeLeft}</>;
};
