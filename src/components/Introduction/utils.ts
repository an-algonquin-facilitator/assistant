import { isLeft } from "fp-ts/lib/Either";
import * as t from "io-ts";

const msPerSecond = 1000;
const msPerMinutes = 60000;
const msPerHour = 3600000;

const JWTPayloadValidator = t.exact(
  t.type({
    exp: t.number,
  }),
);

export const tokenExpiryDateUnix = (jwt: string): number => {
  try {
    const [, payloadB64] = jwt.split(".");
    const payloadRaw = atob(payloadB64);
    const payload: unknown = JSON.parse(payloadRaw);
    const decoded = JWTPayloadValidator.decode(payload);
    if (isLeft(decoded)) return -1;
    const { exp } = decoded.right;
    return new Date(exp * msPerSecond).getTime() - Date.now();
  } catch {
    return -1;
  }
};

export const secondsToMinutes = (d: number): string => {
  const m = Math.floor((d % msPerHour) / msPerMinutes);
  const s = Math.floor((d % msPerMinutes) / msPerSecond);
  return `${m} minutes ${s} seconds`;
};

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};
