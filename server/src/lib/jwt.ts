import jwt from "jsonwebtoken";
import { env } from "../env.js";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

const ACCESS_TOKEN_TTL = "15m";

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
    throw new Error("Malformed access token payload");
  }
  return { sub: decoded.sub as string, email: decoded.email as string };
}
