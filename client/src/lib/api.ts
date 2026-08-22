import { getAccessToken, setAccessToken } from "./authToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getAccessToken();

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers
    }
  });
}

export function googleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  website: string | null;
  notify: boolean;
  preferredTheme: string;
  createdAt: string;
}

export interface CurrentOrganization {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  currentPlanId: "starter" | "team" | "enterprise";
}

export interface MeResponse {
  user: CurrentUser;
  organizations: CurrentOrganization[];
}

// Attempts to mint a fresh access token from the httpOnly refresh cookie, then
// fetches /auth/me. Used on app load / hard refresh, since the in-memory access
// token doesn't survive a reload.
export async function fetchCurrentUser(): Promise<MeResponse | null> {
  const refreshRes = await apiFetch("/auth/refresh", { method: "POST" });
  if (!refreshRes.ok) {
    return null;
  }

  const { accessToken } = (await refreshRes.json()) as { accessToken: string };
  setAccessToken(accessToken);

  const meRes = await apiFetch("/auth/me");
  if (!meRes.ok) {
    return null;
  }

  return (await meRes.json()) as MeResponse;
}
