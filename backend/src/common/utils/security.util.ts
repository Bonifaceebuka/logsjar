import {  MESSAGES } from '../constants/messages';
import { AppError } from '../errors/appError';
import { CONFIGS } from '../configs/index';
import crypto from "crypto";
import { logger } from '../configs/logger';

const {
  API_KEY_EXPIRES_AT
} = CONFIGS;
export function generateSignature(apiKey: string, timestamp: string): string {
  return crypto.createHmac("sha256", apiKey).update(timestamp).digest("hex");
}

export async function verifySignature(validApiKey: string, timestamp: string, signature: string): Promise<boolean> {
  const decryptedSignature = generateSignature(validApiKey, timestamp);
  let message;

  if (signature !== decryptedSignature) {
    message = MESSAGES.COMMON.UNATHORIZED_ACCESS
    logger.error(message)
    throw new AppError(message, 403);
  }

  const expiresAt = API_KEY_EXPIRES_AT;
  const sentTimestamp = Number(timestamp);
  const sentDate = new Date(sentTimestamp)
  const lifeSpan = expiresAt * 60 * 60 * 1000;
  const hasExpired = Date.now() - sentTimestamp > lifeSpan;
  if (hasExpired) {
    logger.info(`Timestamp has expired at: ${sentDate}`)
    throw new AppError(MESSAGES.COMMON.UNATHORIZED_ACCESS);
  }

  return true
}

export async function issueNewSignature(serviceApiKey: string): Promise<{ timestamp: string, signature: string }> {
  const newTimestamp = Date.now().toString();
  const newSignature = crypto.createHmac("sha256", serviceApiKey).update(newTimestamp).digest("hex");
  return {
    timestamp: newTimestamp,
    signature: newSignature
  }
}