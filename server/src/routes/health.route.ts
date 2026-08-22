import { Router } from "express";
import { env } from "../env.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "livepoll-server",
    environment: env.NODE_ENV,
    uptimeSeconds: Number(process.uptime().toFixed(0)),
    timestamp: new Date().toISOString()
  });
});
