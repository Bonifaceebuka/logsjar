import { Column, Entity } from "typeorm";
import { BaseModel } from "../../../common/baseModel";
import { Service } from "typedi";
import { API_KEY_ENVIRONMENTS } from "@logsjar/shared";

@Service()
@Entity({ name: "api_keys" })
export class ApiKeyModel extends BaseModel {
  @Column({type: "enum", enum: API_KEY_ENVIRONMENTS})
  environment!: API_KEY_ENVIRONMENTS;

  @Column({type:"varchar"})
  name!: string;

  @Column({unique: true})
  key_hash!: string;

  @Column()
  masked_key!: string;

  @Column()
  user_id!: number;
}