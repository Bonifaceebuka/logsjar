import { DataSource } from "typeorm";
import { BaseRepository } from "@/common/base.repository";
import { dataSource as AppDataSource } from "@common/configs/postgres";
import { ApiKeyModel } from "@/devconsole/api-key/models/apiKey.model";

export class ApiKeyRepository extends BaseRepository<ApiKeyModel> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(ApiKeyModel, dataSource);
  }
}
