import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import fs from "node:fs";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

const STATIC_PATH = path.resolve(__dirname, "..", "..", "revenue-sharing", "static-build");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve static files from the revenue-sharing build
app.use(express.static(STATIC_PATH));

// Serve manifest and landing page for Expo Go
app.get(["/", "/manifest"], (req, res, next) => {
  const platform = req.headers["expo-platform"];
  if (platform === "ios" || platform === "android") {
    const manifestPath = path.join(STATIC_PATH, platform, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      res.setHeader("expo-protocol-version", "1");
      res.setHeader("expo-sfv-version", "0");
      return res.sendFile(manifestPath);
    }
  }
  next();
});

// Fallback to index.html for SPA (if needed, though Expo Go build is mostly static)
app.get("*", (req, res) => {
  res.sendFile(path.join(STATIC_PATH, "index.html"), (err) => {
    if (err) {
      res.status(404).send("Not Found");
    }
  });
});

export default app;
