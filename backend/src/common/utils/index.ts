import bcrypt from "bcryptjs";
import { CONFIGS } from "../configs";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"
import { AppError } from "../errors/AppError";
import crypto from "crypto";
import { JWT_EXPIRATION_TIME, JWT_TYPES } from "../enums/IndexEnum";

export function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function hashString(input: string): Promise<string> {
  if (!input) return "";

  const adminKey = CONFIGS.APP_KEY_SECRET
  const combinedInput = input + adminKey;

  const salt = await bcrypt.genSalt(10);
  const hashedString = await bcrypt.hash(combinedInput, salt);

  return hashedString;
}

export function generateOTP(time: number) {
  const oldDateObj = moment();
  const expireAt = moment(oldDateObj)
    .add(time ?? 24, 'h')
    .format() as unknown as Date;
  const randomPass = crypto.getRandomValues(new Uint8Array(8));
  const newPass = randomPass.toString();
  const password = newPass.replace(/[^\w\s]/gi, '').slice(0, 6);

  return { otp: password, expireAt };
};

export function generateUUID() {
  const currentTime = moment();
  const lifeSpan = 24
  const expiresAt = currentTime.add(lifeSpan, 'hours').format() as unknown as Date;
  return {
    uuid: uuidv4(),
    expiresAt
  }
}

export async function compareHash(input: string, hashed: string): Promise<boolean> {

  if (!input || !hashed) return false;

  const adminKey = CONFIGS.APP_KEY_SECRET

  const combinedInput = input + adminKey;

  return await bcrypt.compare(combinedInput, hashed);
}

export function generateJWT(jwtData: any, type: JWT_TYPES = 'USER_ACCESS_TOKEN', expires_in: JWT_EXPIRATION_TIME = "1h") {
  let issuer, audience;
  let secretKey: string = '';

  try {
    switch (type) {
      case 'USER_ACCESS_TOKEN':
        audience = jwtData?.email
        issuer = CONFIGS.JWT_TOKEN.JWT_ISSUER
        secretKey = CONFIGS.JWT_TOKEN.SECRET
        break;
      case 'USER_REFRESH_ACCESS_TOKEN':
        audience = jwtData?.email
        issuer = CONFIGS.JWT_TOKEN.JWT_ISSUER
        secretKey = CONFIGS.JWT_TOKEN.REFRESH_JWT_SECRET
        break;
      case 'ADMIN':
        audience = jwtData?.email
        issuer = CONFIGS.JWT_TOKEN.JWT_ISSUER
        secretKey = CONFIGS.JWT_TOKEN.SECRET
        break;
      default:
        throw new AppError('Unable to complete JWT generation process')
    }

    return jwt.sign({ jwtData }, secretKey, {
      expiresIn: expires_in,
      issuer,
      audience
    });
  } catch (error) {
    throw new AppError('Unable to complete JWT generation process');
  }
}

export function hasExpired(expectedExpirationDate: any) {
  const currentTime = moment();
  if (currentTime.isAfter(expectedExpirationDate)) {
    return true;
  }
  return false
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);
export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
}

// Decrypt
export function decrypt(encryptedData: string, ivHex: string) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}