import { DataSource } from "typeorm";
import { BaseRepository } from "@common/BaseRepository";
import { dataSource as AppDataSource } from "@common/configs/postgres";
import { AccessTokenModel } from "@/devconsole/auth/models/accessToken.model";

export class AccessTokenRepository extends BaseRepository<AccessTokenModel> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(AccessTokenModel, dataSource);
  }
}
