import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Security, Request, Delete, Path, Get } from 'tsoa';
import { HttpResponseDTO } from '@/common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import { logger } from '@/common/configs/logger';
import { validateDto } from '@/common/utils/validator.util';
import LogsService from './logs.service';
import { CreateNewLogEntryDto } from './dtos/logs.dto';
import { IncomingLogEvent } from './types/logs.type';
import { parseNDJSON } from './utils/ndjson-parser';
import { validateLogEvent } from './utils/log.utils';

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
  )
  // : Promise<HttpResponseDTO> 
  {
    const { user_id, id: api_key_id } = req.auth_sdk_details;
    const res = req.res
    const MAX_BATCH_SIZE = 500;
    const batch: IncomingLogEvent[] = [];
    let accepted = 0;
    let rejected = 0;
    // const serviceResponse = await this.logsService.createAppLog(newLogEntryDto, user_id);
   try {
    for await (const parsedChunk of parseNDJSON(req)) {
      // parseNDJSON is returning an array
      const events = Array.isArray(parsedChunk)
        ? parsedChunk
        : [parsedChunk];

      for (const rawEvent of events) {
        console.log({ rawEvent });

        if (!validateLogEvent(rawEvent)) {
          rejected++;
          continue;
        }

        batch.push(rawEvent);

        if (batch.length >= MAX_BATCH_SIZE) {
          const eventsToInsert = batch.splice(0, MAX_BATCH_SIZE);

          await this.logsService.createAppLog(
            eventsToInsert,
            user_id,
            api_key_id
          );

          accepted += eventsToInsert.length;
        }
      }
    }

    // Send remaining events
    if (batch.length > 0) {
      const eventsToInsert = batch.splice(0, batch.length);

      await this.logsService.createAppLog(
        eventsToInsert,
        user_id,
        api_key_id
      );

      accepted += eventsToInsert.length;
    }

    res.status(202).json({
      accepted,
      rejected,
    });
  } catch (error) {
    console.error("Log ingestion failed:", error);

    if (!res.headersSent) {
      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to process logs",
      });
    }
  }
    
    // if (!serviceResponse.successful) {
    //   logger.info(serviceResponse?.message);
    //   this.setStatus(400);
    //   return errorResponse({
    //     message: serviceResponse?.message as string,
    //     data: serviceResponse.data,
    //   });
    // }

    // logger.info(serviceResponse?.message);
    // this.setStatus(201);
    // return successResponse({
    //   message: serviceResponse?.message as string,
    //   data: serviceResponse.data,
    //   status_code: 201,
    // });
  }
}