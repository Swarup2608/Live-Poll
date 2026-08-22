import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env, ALLOWED_ORIGINS } from "./env.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.route.js";
import { apiRouter } from "./routes/api.route.js";
import { authRouter } from "./routes/auth.route.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." }
  });

  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("CORS origin not allowed"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Basic health endpoint to confirm service is reachable.
  app.use("/health", healthRouter);

  // Basic API endpoint placeholder for future server features.
  app.use("/api", apiLimiter, apiRouter);

  app.use("/api/v1/auth", authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
