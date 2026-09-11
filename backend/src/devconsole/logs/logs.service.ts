import { Service } from "typedi";
import { ServiceResponseDTO } from "../../common/types/http.type";
import { CreateNewLogEntryDto } from "./dtos/logs.dto";
import { LogRepository } from "./repositories/logs.repository";
import { IncomingLogEvent } from "./types/logs.type";
import { mapLogEventToEntity } from "./utils/log-events.mapper";
import { LogsModel } from "./models/logs.model";

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
        message:"No events sent",
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

}