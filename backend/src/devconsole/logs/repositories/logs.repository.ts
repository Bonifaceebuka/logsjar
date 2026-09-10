import { DataSource } from "typeorm";
import { BaseRepository } from "@/common/base.repository";
import { dataSource as AppDataSource } from "@common/configs/postgres";
import { LogsModel } from "@/devconsole/logs/models/logs.model";

export class LogRepository extends BaseRepository<LogsModel> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(LogsModel, dataSource);
  }
}
