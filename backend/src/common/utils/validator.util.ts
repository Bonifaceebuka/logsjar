import dns from 'dns/promises';
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate, validateOrReject, ValidatorOptions } from "class-validator";

export async function validateDto<T>(
  dtoClass: ClassConstructor<T>,
  payload: unknown,
  options: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: false,
  }
): Promise<T> {
  const dto = plainToInstance(dtoClass, payload);
  await validateOrReject(dto as object, options);
  return dto;
}

export async function hasValidMX(email: string) {
  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}