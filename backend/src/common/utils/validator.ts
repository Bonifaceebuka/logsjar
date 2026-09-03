import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import dns from 'dns/promises';

export const validateDto = (dtoClass: any): RequestHandler => {
    return async (req, res, next) => {
        const output = plainToInstance(dtoClass, req.body);
        const errors = await validate(output, { skipMissingProperties: false });
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.body = output;
        return next();
    };
};


export async function hasValidMX(email: string) {
  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}