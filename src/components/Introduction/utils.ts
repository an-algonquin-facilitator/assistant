import { hasProperty, isObject } from "../../validator/validate";

const msPerSecond = 1000;
const msPerMinutes = 60000;
const msPerHour = 3600000;

interface JWTPayload {
  exp: number;
  // aud: string;
  // azp: string;
  // iss: string;
  // jti: string;
  // nbf: number;
  // scope: string;
  // sub: string;
  // tenantid: string;
}

const isJWTPayload = (v: unknown): v is JWTPayload =>
  v != null &&
  isObject(v) &&
  hasProperty(v, "exp") &&
  typeof v.exp === "number";

export const tokenExpiryDateUnix = (jwt: string): number => {
  try {
    const [, payloadB64] = jwt.split(".");
    const payloadRaw = atob(payloadB64);
    const payload: unknown = JSON.parse(payloadRaw);
    if (!isJWTPayload(payload)) return -1;
    return new Date(payload.exp * msPerSecond).getTime() - Date.now();
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
