import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Security, Request, Delete, Path, Get } from 'tsoa';
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
    const serviceResponse = await this.apiKeyService.createApiKey(generateApiKeyDto, user_id);
    if (!serviceResponse.successful) {
      logger.info(serviceResponse?.message);
      this.setStatus(400);
      return errorResponse({
        message: serviceResponse?.message as string,
        data: serviceResponse.data,
      });
    }

    logger.info(serviceResponse?.message);
    this.setStatus(201);
    return successResponse({
      message: serviceResponse?.message as string,
      data: serviceResponse.data,
      status_code: 201,
    });
  }

  /**
   * Create a new API key
   * @summary Create a new API key 
   */
  @Delete("/:apiKeyId")
  public async deleteApiKey(
    @Request() req: any,
    @Path() apiKeyId: string
  ): Promise<HttpResponseDTO> {
    const { user_id } = req.auth_user_details;
    const serviceResponse = await this.apiKeyService.deleteApiKey(apiKeyId, user_id);
    if (!serviceResponse.successful) {
      logger.info(serviceResponse?.message);
      this.setStatus(400);
      return errorResponse({
        message: serviceResponse?.message as string,
        data: serviceResponse.data,
      });
    }

    logger.info(serviceResponse?.message);
    this.setStatus(200);
    return successResponse({
      message: serviceResponse?.message as string,
      data: serviceResponse.data,
      status_code: 200,
    });
  }

  /**
   * Fetch created API keys by a user account
   * @summary Fetch created API keys by a user account 
   */
  @Get("/")
  public async fetchApiKeys(
    @Request() req: any,
  ): Promise<HttpResponseDTO> {
    const { user_id } = req.auth_user_details;
    const serviceResponse = await this.apiKeyService.fetchApiKeys(user_id);
    if (!serviceResponse.successful) {
      logger.info(serviceResponse?.message);
      this.setStatus(400);
      return errorResponse({
        message: serviceResponse?.message as string,
        data: serviceResponse.data,
      });
    }

    logger.info(serviceResponse?.message);
    this.setStatus(200);
    return successResponse({
      message: serviceResponse?.message as string,
      data: serviceResponse.data,
      status_code: 200,
    });
  }
}