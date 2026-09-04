import dotenv from "dotenv";
import { AppError } from "../errors/appError";
import { logger } from "./logger";
dotenv.config();
const COMPANY_NAME = "Neumock Inc.";

enum EnvironmentKeys {
    NODE_ENV = 'NODE_ENV',
    JWT_SECRET = 'JWT_SECRET',
    REFRESH_JWT_SECRET = 'REFRESH_JWT_SECRET',
    JWT_ISSUER = 'JWT_ISSUER',
    PORT = 'PORT',
    HOST='HOST',
    JWT_RESET_PASSWORD_TOKEN = 'JWT_RESET_PASSWORD_TOKEN',
    ADMIN_JWT_SECRET = 'ADMIN_JWT_SECRET',
    PG_HOST = 'PG_HOST',
    PG_PORT = 'PG_PORT',
    PG_USERNAME = 'PG_USERNAME',
    PG_DATABASE = 'PG_DATABASE',
    PG_PASSWORD = 'PG_PASSWORD',
    APP_KEY_SECRET = 'APP_KEY_SECRET',
    REDIS_URL = 'REDIS_URL',
    MAIL_HOST = 'MAIL_HOST',
    MAIL_USERNAME = 'MAIL_USERNAME',
    MAIL_PASSWORD = 'MAIL_PASSWORD',
    MAIL_FROM_ADDRESS = 'MAIL_FROM_ADDRESS',
    MAIL_PROVIDER = 'MAIL_PROVIDER',
    MAIL_SECURE = 'MAIL_SECURE',
    MAIL_PORT = 'MAIL_PORT',
    GITHUB_CLIENT_ID = 'GITHUB_CLIENT_ID',
    GITHUB_CLIENT_SECRET = 'GITHUB_CLIENT_SECRET',
    GITHUB_CALLBACK_URL = 'GITHUB_CALLBACK_URL',
    FRONTEND_URL = 'FRONTEND_URL',
}

export function getEnv(key: EnvironmentKeys): string {
    const envKey = EnvironmentKeys[key];
    const envValue = process.env[envKey] as string;
    if (!envValue) {
        logger.info(`Missing environment variable: ${key}`);
        throw new AppError (`Missing environment variable: ${key}`, 500);
    }
    return envValue;
}

export const CONFIGS ={
    NODE_ENV: getEnv(EnvironmentKeys.NODE_ENV),
    APP_NAME:"Logsjar",
    DATA_FETCH_LIMIT: 20,
    MAX_EXAM_TIME: 20,
    APP_KEY_SECRET: getEnv(EnvironmentKeys.APP_KEY_SECRET),
    API_KEY_EXPIRES_AT: 24,
    DEFAULT_CHARACTER_LENGTH: 12,
    SERVER_PORT: getEnv(EnvironmentKeys.PORT),
    BASE_URL: `localhost:${getEnv(EnvironmentKeys.PORT)}`,
    HOST: getEnv(EnvironmentKeys.HOST),
    IS_PRODUCTION: getEnv(EnvironmentKeys.NODE_ENV) === "prod" || getEnv(EnvironmentKeys.NODE_ENV) === "production" ? true : false,
    IS_STAGING: getEnv(EnvironmentKeys.NODE_ENV) === "dev" || getEnv(EnvironmentKeys.NODE_ENV) === "development" ? true : false,
    JWT_TOKEN:{
        SECRET: getEnv(EnvironmentKeys.JWT_SECRET),
        STATELESS_EXPIRES_IN: '3600s',
        REFRESH_JWT_SECRET: getEnv(EnvironmentKeys.REFRESH_JWT_SECRET),
        JWT_ISSUER: getEnv(EnvironmentKeys.JWT_ISSUER)
    },
    REDIS: {
        REDIS_URL: getEnv(EnvironmentKeys.REDIS_URL)
    },
    DATABASE:{
        HOST: getEnv(EnvironmentKeys.PG_HOST),
        PORT: getEnv(EnvironmentKeys.PG_PORT) as unknown as number,
        USERNAME: getEnv(EnvironmentKeys.PG_USERNAME),
        PASSWORD: getEnv(EnvironmentKeys.PG_PASSWORD),
        DATABASE: getEnv(EnvironmentKeys.PG_DATABASE),
    },
    HTTP_ALLOWED_HEADERS: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "X-Requested-With",
        "x-jwt-token",
        "x-jwt-refresh-token",
        "Content-Length",
        "Accept-Language",
        "Accept-Encoding",
        "Connection",
        "X-Api-Gateway-Signature",
        "X-Api-Gateway-Timestamp",
        "Access-Control-Allow-Origin"
    ],
    HTTP_METHODS:["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    WEBSOCKET_METHODS:["GET","POST"],
    MAIL:{
        MAIL_HOST: getEnv(EnvironmentKeys.MAIL_HOST),
        SENDER_NAME: COMPANY_NAME,
        SENDER_EMAIL: getEnv(EnvironmentKeys.MAIL_FROM_ADDRESS),
        MAIL_USERNAME: getEnv(EnvironmentKeys.MAIL_USERNAME),
        MAIL_PORT: getEnv(EnvironmentKeys.MAIL_PORT),
        MAIL_PASSWORD: getEnv(EnvironmentKeys.MAIL_PASSWORD),
        MAIL_PROVIDER: getEnv(EnvironmentKeys.MAIL_PROVIDER),
        MAIL_SECURE: getEnv(EnvironmentKeys.MAIL_SECURE) || false
    },
    GITHUB:{
        CLIENT_ID: getEnv(EnvironmentKeys.GITHUB_CLIENT_ID),
        CLIENT_SECRET: getEnv(EnvironmentKeys.GITHUB_CLIENT_SECRET),
        CALLBACK_URL: getEnv(EnvironmentKeys.GITHUB_CALLBACK_URL),
        FRONTEND_URL: getEnv(EnvironmentKeys.FRONTEND_URL),
    }
}