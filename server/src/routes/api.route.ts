import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    message: "Live Poll API is running",
    version: "v1"
  });
});
