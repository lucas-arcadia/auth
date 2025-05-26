// /src/utils/logger.ts

import pino from "pino";

interface LogObject {
  time?: number | string;
  msg?: string;
  //[key: string]: any;
}

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }),
    log: (object: LogObject) => ({
      ...object,
      msg: object.msg || "",
      time: object.time
        ? new Date(
            typeof object.time === "string" || typeof object.time === "number"
              ? object.time
              : Date.now()
          ).toISOString()
        : new Date().toISOString(),
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ["req.headers.authorization", "req.body.password"],
    censor: "[REDACTED]",
  },
  ...(process.env.NODE_ENV === "production"
    ? {
        transport: {
          target: "pino/file",
          options: { destination: "./logs/app.log", mkdir: true },
        },
      }
    : {
        messageKey: "msg",
      }),
});

export default logger;
