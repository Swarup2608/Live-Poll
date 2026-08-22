import type { Request, Response } from "express";
import { env } from "../env.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../schemas/auth.schemas.js";
import * as authService from "../services/auth.service.js";
import { HttpError } from "../services/auth.service.js";
import {
  setRefreshCookie,
  clearRefreshCookie,
  setSessionHintCookie,
  clearSessionHintCookie,
  setOAuthStateCookie,
  clearOAuthStateCookie,
  REFRESH_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME
} from "../lib/cookies.js";
import { buildGoogleAuthUrl, exchangeGoogleCode, generateOAuthState } from "../lib/googleOAuth.js";

function validationError(res: Response, error: { flatten: () => unknown }) {
  res.status(400).json({ error: "Validation failed", details: error.flatten() });
}

export async function signupHandler(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed.error);

  const result = await authService.signup(parsed.data);
  setRefreshCookie(res, result.rawRefreshToken);
  setSessionHintCookie(res);

  res.status(201).json({
    user: result.user,
    organizations: result.organizations,
    accessToken: result.accessToken
  });
}

export async function loginHandler(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed.error);

  const result = await authService.login(parsed.data);
  setRefreshCookie(res, result.rawRefreshToken);
  setSessionHintCookie(res);

  res.status(200).json({
    user: result.user,
    organizations: result.organizations,
    accessToken: result.accessToken
  });
}

export async function refreshHandler(req: Request, res: Response) {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

  try {
    const result = await authService.refresh(rawRefreshToken);
    setRefreshCookie(res, result.rawRefreshToken);
    setSessionHintCookie(res);
    res.status(200).json({ accessToken: result.accessToken });
  } catch (err) {
    clearRefreshCookie(res);
    clearSessionHintCookie(res);
    throw err;
  }
}

export async function logoutHandler(req: Request, res: Response) {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  await authService.logout(rawRefreshToken);
  clearRefreshCookie(res);
  clearSessionHintCookie(res);
  res.status(204).send();
}

export async function meHandler(req: Request, res: Response) {
  const result = await authService.me(req.user!.id);
  res.status(200).json(result);
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed.error);

  await authService.forgotPassword(parsed.data.email);
  res.status(200).json({ message: "If that email exists, a reset link was sent." });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed.error);

  await authService.resetPassword(parsed.data.token, parsed.data.newPassword);
  res.status(204).send();
}

export function googleRedirectHandler(_req: Request, res: Response) {
  const state = generateOAuthState();
  setOAuthStateCookie(res, state);
  res.redirect(buildGoogleAuthUrl(state));
}

export async function googleCallbackHandler(req: Request, res: Response) {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const cookieState = req.signedCookies?.[OAUTH_STATE_COOKIE_NAME] as string | undefined;

  clearOAuthStateCookie(res);

  if (!code || !state || !cookieState || state !== cookieState) {
    throw new HttpError(400, "Invalid OAuth state");
  }

  const profile = await exchangeGoogleCode(code);
  const result = await authService.loginOrCreateWithGoogle(profile);

  setRefreshCookie(res, result.rawRefreshToken);
  setSessionHintCookie(res);

  res.redirect(`${env.CLIENT_ORIGIN}/auth/callback`);
}
