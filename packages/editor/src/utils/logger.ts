import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "development" ? "trace" : "info",
  browser: {
    asObject: true,
  },
});
