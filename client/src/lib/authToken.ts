// In-memory only — never localStorage/sessionStorage, so a bearer token can't be
// exfiltrated by an XSS payload reading web storage. Lost on hard refresh by design;
// callers rehydrate via POST /auth/refresh (httpOnly cookie) + GET /auth/me.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
