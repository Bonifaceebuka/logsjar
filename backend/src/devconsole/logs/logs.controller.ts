import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Security, Request, Delete, Path, Get, Query } from 'tsoa';
import { HttpResponseDTO } from '@/common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import { logger } from '@/common/configs/logger';
import LogsService from './logs.service';

@Tags("Logs")
@Route("logs")
@Service()
export class LogsController extends Controller {
  constructor(private readonly logsService: LogsService) {
    super();
  }

  /**
   * Create a new Logs
   * @summary Create a new Logs 
   */
  @Post("/")
  @Security("sdkBearerAuth")
  public async createAppLog(
    @Request() req: any,
  )
  : Promise<HttpResponseDTO> 
  {
    const { user_id, id: api_key_id } = req.auth_sdk_details;
    
    const serviceResponse = await this.logsService.parseNewLogEvents(req, user_id, api_key_id);
  
    if (!serviceResponse?.successful) {
      logger.info(serviceResponse?.message);
      this.setStatus(400);
      return errorResponse({
        message: serviceResponse?.message as string,
        data: serviceResponse?.data,
      });
    }

    logger.info(serviceResponse?.message);
    this.setStatus(202);
    return successResponse({
      message: serviceResponse?.message as string,
      data: serviceResponse.data,
      status_code: 202,
    });
  }

   /**
   * Fetch logs
   * @summary Fetch logs 
   */
  @Get("/")
  @Security("bearerAuth")
  public async fetchLogs(
    @Request() req: any,
    @Query() api_key_id?: string
  )
  : Promise<HttpResponseDTO> 
  {
    const { user_id } = req.auth_user_details;
    
    const serviceResponse = await this.logsService.fetchLogs(user_id, api_key_id);
  
    if (!serviceResponse?.successful) {
      logger.info(serviceResponse?.message);
      this.setStatus(400);
      return errorResponse({
        message: serviceResponse?.message as string,
        data: serviceResponse?.data,
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