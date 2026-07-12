import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const rawAllowedOrigins =
  process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = rawAllowedOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", TRUST_PROXY);

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

// Basic health endpoint to confirm service is reachable.
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "livepoll-server",
    environment: NODE_ENV,
    uptimeSeconds: Number(process.uptime().toFixed(0)),
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoint placeholder for future server features.
app.get("/api", apiLimiter, (_req, res) => {
  res.status(200).json({
    message: "Live Poll API is running",
    version: "v1"
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500;

  if (NODE_ENV === "production") {
    res.status(statusCode).json({ error: "Internal Server Error" });
    return;
  }

  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
