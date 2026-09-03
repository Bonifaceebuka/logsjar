import dotenv from "dotenv";
dotenv.config();
import winston, { transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { hostname } from "os";

const IS_PRODUCTION = process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production" ? true : false;

const { combine, colorize, errors, timestamp, printf } = format;

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            dirname: `logs/${hostname}/combined`,
            filename: "combined",
            extension: ".log",
            level: IS_PRODUCTION as boolean ? "info" : "debug"
        }),
        new DailyRotateFile({
            dirname: `logs/${hostname}/error`,
            filename: "errors",
            extension: ".log",
            level: "error",
            format: combine(errors({stack: !IS_PRODUCTION}))
        })
    ]
});