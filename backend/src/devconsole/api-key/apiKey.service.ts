import { Service } from "typedi";
import { UserRepository } from "../users/repositories/user.repository";
import { CONFIGS } from "../../common/configs";
import { ServiceResponseDTO } from "../../common/types/http.type";
import { capitalizeFirst, encrypt, generateJWT, generateOTP, generateUUID, hasExpired, hashString } from "../../common/utils";
import { dynamic_messages, MESSAGES } from "../../common/constants/messages";
import { GenerateApiKeyDto } from "./dtos/api-key.dto";
import crypto from 'node:crypto';
import { API_KEY_ENVIRONMENTS } from "@logsjar/shared";
import { GeneratedApiKey } from "./types/api-key.type";
import { ApiKeyRepository } from "./repositories/apiKey.repository";
import { AppError } from "@/common/errors/appError";

@Service()
export default class ApiKeyService {
  private apiKeyRepository: ApiKeyRepository;

  constructor() {
    this.apiKeyRepository = new ApiKeyRepository();
  }

  public async createApiKey(generateApiKeyDto: GenerateApiKeyDto, user_id: number): Promise<ServiceResponseDTO> {

    const { name, environment } = generateApiKeyDto;
    let message;

    const hashedApiKey = this.generateApiKey(environment);
    
    if (!hashedApiKey.hash) {
      throw new AppError("Unable to generate your API Key")
    }

    await this.apiKeyRepository.create({
      key_hash: hashedApiKey.hash,
      name,
      environment,
      user_id,
      masked_key: this.maskApiKey(hashedApiKey.key)
    });

    message = "API key generated successfully";

    return {
      successful: true,
      data: {
        api_key: hashedApiKey.key
      },
      message,
    };
  }

  public async deleteApiKey(apiKeyId: string, user_id: number): Promise<ServiceResponseDTO> {
    let message;

    const existingApiKey = await this.apiKeyRepository.basicFindOneByConditions({
      uuid: apiKeyId,
      user_id,
    });

    if(!existingApiKey) {
      message = dynamic_messages.NOT_FOUND("API Key")
      throw new AppError(message, 404);
    }

    await this.apiKeyRepository.deleteByCondition({
      uuid: apiKeyId,
      user_id,
    });

    message = "API key deleted successfully";

    return {
      successful: true,
      data: null,
      message,
    };
  }

  public async fetchApiKeys(user_id: number): Promise<ServiceResponseDTO> {
    let message;

    const apiKeys = await this.apiKeyRepository.getRepo().find({
      where: {
        user_id,
      },
      select: {
        uuid: true,
        name: true,
        created_at: true,
        environment: true,
        masked_key: true,
      }
    });

    message = "API keys fetched successfully";

    return {
      successful: true,
      data: apiKeys,
      message,
    };
  }

  /**
   * Generates a cryptographically secure API key.
   *
   * Example:
   * sk_live_7Q3x... 
   */
  generateApiKey(environment: API_KEY_ENVIRONMENTS): GeneratedApiKey {

    // 32 bytes = 256 bits of cryptographically secure randomness.
    const secret = crypto.randomBytes(32).toString('base64url');
    const env = environment === API_KEY_ENVIRONMENTS.PRODUCTION ? 'live' : 'dev'
    const prefix = `sk_${env}_`;

    const key = `${prefix}${secret}`;

    const hash = this.hashApiKey(secret);

    return {
      key,
      secret,
      hash,
    };
  }

  /**
   * Hashes an API key secret for database storage.
   *
   * The plaintext secret should NEVER be stored.
   */
  hashApiKey(secret: string): string {
    return crypto
      .createHash('sha256')
      .update(secret, 'utf8')
      .digest('hex');
  }

  maskApiKey(
    apiKey: string,
    visibleStart = 7,
    visibleEnd = 8,
  ): string {
    if (apiKey.length <= visibleStart + visibleEnd) {
      return '*'.repeat(apiKey.length);
    }

    const start = apiKey.slice(0, visibleStart);
    const end = apiKey.slice(-visibleEnd);

    return `${start}********${end}`;
  }
}