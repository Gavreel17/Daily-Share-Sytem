import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] || "10000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  logger.error({ rawPort }, "Invalid PORT provided, exiting");
  process.exit(1);
}

const server = app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening on 0.0.0.0");
});

server.on("error", (err) => {
  logger.error({ err }, "Server failed to start");
  process.exit(1);
});
