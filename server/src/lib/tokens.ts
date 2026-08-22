import { randomBytes, createHash } from "node:crypto";

// Opaque, non-JWT tokens used for refresh tokens and password-reset links.
// Only the sha256 hash is ever persisted; the raw value goes to the client
// (cookie or reset URL) so a DB leak alone can't be used to forge a session.

export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
