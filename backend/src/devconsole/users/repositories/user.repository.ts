import { DataSource } from "typeorm";
import { BaseRepository } from "@/common/base.repository";
import { dataSource as AppDataSource } from "@/common/configs/postgres";
import UserModel from "@/devconsole/users/models/user.model";

export class UserRepository extends BaseRepository<UserModel> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(UserModel, dataSource);
  }
}
