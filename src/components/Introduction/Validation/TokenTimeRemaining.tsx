import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useToken } from "../../../store/token";
import { secondsToMinutes, tokenExpiryDateUnix } from "../utils";

const msPerSecond = 1000;

export const TokenTimeRemaining = (): ReactElement => {
  const token = useToken();
  const [timeLeft, setTimeLeft] = useState(
    secondsToMinutes(tokenExpiryDateUnix(token)),
  );
  useEffect(() => {
    const interv = setInterval(
      () => setTimeLeft(secondsToMinutes(tokenExpiryDateUnix(token))),
      msPerSecond,
    );
    return (): void => clearInterval(interv);
  }, [token]);
  return <>{timeLeft}</>;
};
