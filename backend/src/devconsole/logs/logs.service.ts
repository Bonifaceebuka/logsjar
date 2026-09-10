import { Service } from "typedi";
import { ServiceResponseDTO } from "../../common/types/http.type";
import { CreateNewLogEntryDto } from "./dtos/logs.dto";
import { LogRepository } from "./repositories/logs.repository";

@Service()
export default class LogsService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  public async createAppLog(newLogEntryDto: any, user_id: number): Promise<ServiceResponseDTO> {

    const { 
      type, 
      level, 
      message: logMessage, 
      exception, 
      environment, 
      service, 
      timestamp,
      extra,
      context,
      release,
      ...otherDataSent 
    } = newLogEntryDto;

    let message;

    // const hashedApiKey = this.generateApiKey(environment);
    
    // if (!hashedApiKey.hash) {
    //   throw new AppError("Unable to generate your API Key")
    // }

    // await this.logRepository.create({
    //   key_hash: hashedApiKey.hash,
    //   name,
    //   environment,
    //   user_id,
    //   masked_key: this.maskApiKey(hashedApiKey.key)
    // });

    message = "API key generated successfully";

    return {
      successful: true,
      data: {
        // api_key: hashedApiKey.key
      },
      message,
    };
  }

}