import { hasProperty, isObject } from "./validate";

export interface JWTPayload {
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

export const isJWTPayload = (v: unknown): v is JWTPayload =>
  v != null &&
  isObject(v) &&
  hasProperty(v, "exp") &&
  typeof v.exp === "number";
