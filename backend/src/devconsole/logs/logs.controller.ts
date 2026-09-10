import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Security, Request, Delete, Path, Get } from 'tsoa';
import { HttpResponseDTO } from '@/common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import { logger } from '@/common/configs/logger';
import { validateDto } from '@/common/utils/validator.util';
import LogsService from './logs.service';
import { CreateNewLogEntryDto } from './dtos/logs.dto';

@Tags("Logs")
@Route("logs")
@Security("sdkBearerAuth")
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
  public async createAppLog(
    @Request() req: any,
    @Body() newLogEntryDto: any
  ): Promise<HttpResponseDTO> {
    const { user_id } = req.auth_sdk_details;
    const serviceResponse = await this.logsService.createAppLog(newLogEntryDto, user_id);
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
}