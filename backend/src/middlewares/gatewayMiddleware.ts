import { Response, NextFunction } from "express";
import { verifySignature } from "../common/utils/security";
import { AppError } from "../common/errors/AppError";
import { CONFIGS } from "../common/configs";
import { logger } from "../common/configs/logger";

export const gatewayMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const validApiKey = CONFIGS.APP_KEY_SECRET as string
    let message;
    if (!req.headers["x-api-gateway-timestamp"] || req.headers["x-api-gateway-timestamp"].trim().length === 0) {
        message = "Unauthorized access!"
        logger.error(message)
        return next(new AppError(message, 403));
    }

    if (!req.headers["x-api-gateway-signature"] || req.headers["x-api-gateway-signature"].trim().length === 0) {
        message = "Unauthorized access!"
        logger.error(message)
        return next(new AppError(message, 403));
    }
    const timestamp = req.headers["x-api-gateway-timestamp"]
    const signature = req.headers["x-api-gateway-signature"]
    await verifySignature(validApiKey, timestamp, signature);

    next()
}