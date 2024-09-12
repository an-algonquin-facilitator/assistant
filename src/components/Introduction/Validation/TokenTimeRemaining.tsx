import { useEffect, useState } from "react";
import { useToken } from "../../../store/token";
import { secondsToMinutes, tokenExpiryDateUnix } from "../utils";

export const TokenTimeRemaining = () => {
  const token = useToken();
  const [timeLeft, setTimeLeft] = useState(
    secondsToMinutes(tokenExpiryDateUnix(token)),
  );
  useEffect(() => {
    const interv = setInterval(
      () => setTimeLeft(secondsToMinutes(tokenExpiryDateUnix(token))),
      1000,
    );
    return () => clearInterval(interv);
  }, [token]);
  return <>{timeLeft}</>;
};
