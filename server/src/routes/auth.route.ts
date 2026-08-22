import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  signupHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  googleRedirectHandler,
  googleCallbackHandler
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(signupHandler));
authRouter.post("/login", asyncHandler(loginHandler));
authRouter.post("/refresh", asyncHandler(refreshHandler));
authRouter.post("/logout", asyncHandler(logoutHandler));
authRouter.get("/me", requireAuth, asyncHandler(meHandler));
authRouter.post("/forgot-password", asyncHandler(forgotPasswordHandler));
authRouter.post("/reset-password", asyncHandler(resetPasswordHandler));
authRouter.get("/google", googleRedirectHandler);
authRouter.get("/google/callback", asyncHandler(googleCallbackHandler));
