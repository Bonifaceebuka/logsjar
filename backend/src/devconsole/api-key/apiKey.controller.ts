import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Security, Request } from 'tsoa';
import { HttpResponseDTO } from '@/common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import { logger } from '@/common/configs/logger';
import { validateDto } from '@/common/utils/validator.util';
import ApiKeyService from './apiKey.service';
import { GenerateApiKeyDto } from './dtos/api-key.dto';

@Tags("Api Key")
@Route("api-key")
@Security("bearerAuth")
@Service()
export class ApiKeyController extends Controller {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super();
  }

  /**
   * Create a new API key
   * @summary Create a new API key 
   */
  @Post("/")
  public async createApiKey(
    @Request() req: any,
    @Body() generateApiKeyDto: GenerateApiKeyDto
  ): Promise<HttpResponseDTO> {
    await validateDto(GenerateApiKeyDto, generateApiKeyDto);
    const { user_id } = req.auth_user_details;
    const newUser = await this.apiKeyService.createApiKey(generateApiKeyDto, user_id);
    if (!newUser.successful) {
      logger.info(newUser?.message);
      this.setStatus(400);
      return errorResponse({
        message: newUser?.message as string,
        data: newUser.data,
      });
    }

    logger.info(newUser?.message);
    this.setStatus(201);
    return successResponse({
      message: newUser?.message as string,
      data: newUser.data,
      status_code: 201,
    });
  }
}