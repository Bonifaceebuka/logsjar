import { Column, Entity } from "typeorm";
import { BaseModel } from "@/common/baseModel";
import { Service } from "typedi";
import { ACCESS_TOKEN_TYPES, SYS_MODELS } from "@/common/enums";

@Service()
@Entity({ name: "access_tokens" })
export class AccessTokenModel extends BaseModel {
  @Column()
  accessable_id!: number;

  @Column({type:"timestamptz"})
  expires_at!: Date;

  @Column({
      type: "enum",
      enum: SYS_MODELS
  })
  accessable_to!: SYS_MODELS;

  @Column()
  token!: string;
}