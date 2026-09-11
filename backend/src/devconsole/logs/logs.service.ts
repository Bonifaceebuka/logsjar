import { Service } from "typedi";
import { ServiceResponseDTO } from "../../common/types/http.type";
import { CreateNewLogEntryDto } from "./dtos/logs.dto";
import { LogRepository } from "./repositories/logs.repository";
import { IncomingLogEvent } from "./types/logs.type";
import { mapLogEventToEntity } from "./utils/log-events.mapper";
import { LogsModel } from "./models/logs.model";
import { parseNDJSON } from "./utils/ndjson-parser";
import { validateLogEvent } from "./utils/log.utils";
import { logger } from "@/common/configs/logger";
import { AppError } from "@/common/errors/appError";

@Service()
export default class LogsService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  public async createAppLog(events: IncomingLogEvent[], user_id: number, api_key_id: number): Promise<ServiceResponseDTO> {
    let message;
    if (events.length === 0) {
      return {
        successful: true,
        data: null,
        message: "No events sent",
      };
    }

    const rows = events.map((event) =>
      mapLogEventToEntity(event, user_id, api_key_id),
    );

    await this.logRepository.getRepo().createQueryBuilder().insert().into(LogsModel).values(rows).execute();
    message = "Logs created successfully";

    return {
      successful: true,
      data: {
        // api_key: hashedApiKey.key
      },
      message,
    };
  }

  public async parseNewLogEvents(req: any, user_id: number, api_key_id: number): Promise<ServiceResponseDTO | void> {
    let message;
    const MAX_BATCH_SIZE = 500;
    const batch: IncomingLogEvent[] = [];
    let accepted = 0;
    let rejected = 0;
    const res = req.res

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

            await this.createAppLog(
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

        await this.createAppLog(
          eventsToInsert,
          user_id,
          api_key_id
        );

        accepted += eventsToInsert.length;
      }

      message = "Logs created successfully";
      return {
        successful: true,
        data: {
          accepted,
          rejected,
        },
        message,
      };
    } catch (error) {
      if (!res.headersSent) {
        message =
          error instanceof Error
            ? error.message
            : "Failed to process logs"
        logger.error(message)
        throw new AppError(message, 400)
      }
    }
  }
}