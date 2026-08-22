import { OAuth2Client } from "google-auth-library";
import { randomBytes } from "node:crypto";
import { env } from "../env.js";

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

function getClient(): OAuth2Client {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
    throw Object.assign(new Error("Google OAuth is not configured"), { status: 501 });
  }
  return new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI
  });
}

export function generateOAuthState(): string {
  return randomBytes(16).toString("base64url");
}

export function buildGoogleAuthUrl(state: string): string {
  const client = getClient();
  return client.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state
  });
}

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile> {
  const client = getClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) {
    throw Object.assign(new Error("Google did not return an id token"), { status: 502 });
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw Object.assign(new Error("Google id token missing required claims"), { status: 502 });
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    avatarUrl: payload.picture ?? null
  };
}
