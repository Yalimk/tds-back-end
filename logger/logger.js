/* eslint-disable max-len */
import winston from "winston";

const infoFilter = winston.format((info) => {
  return info.level === "info" || info.level === "http" ? info : false;
});

const errorFilter = winston.format((info) => {
  return info.level === "error" || info.level === "warn" ? info : false;
});

export const Logger = winston.createLogger({
  exitOnError: false,
  silent: false,
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "info.log",
      level: "info",
      format: winston.format.combine(
        infoFilter(),
        winston.format.simple(),
        winston.format.colorize()
      ),
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "warn",
      format: winston.format.combine(
        errorFilter(),
        winston.format.simple(),
        winston.format.colorize()
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      dirname: "logs",
      filename: "exception.log",
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
      ),
    }),
  ],
});

export const logMoment = {
  get dateAndTime() {
    return (
      new Date().toLocaleDateString() +
      " " +
      "at " +
      new Date().toLocaleTimeString()
    );
  },
};
