import { Column, Entity } from "typeorm";
import { BaseModel } from "../../../common/baseModel";
import { Service } from "typedi";
import { LogLevel, LogType } from "../enums/logs.enums";

@Service()
@Entity({ name: "logs" })
export class LogsModel extends BaseModel {
  @Column({type: "jsonb"})
  context!: any;

  @Column({type: "jsonb"})
  extras!: any;

  @Column({type: "text", nullable: true})
  exception?: string;

  @Column({type: "timestamptz"})
  timestamp!: string;

  @Column({nullable: true})
  type?: LogType;

  @Column({nullable: true})
  level?: LogLevel;

  @Column({nullable: true})
  message?: string;

  @Column({nullable: true})
  environment?: string;

  @Column({nullable: true})
  service?: string;

  @Column({nullable: true})
  release?: string;

  @Column()
  api_key_id!: number;

  @Column()
  user_id!: number;
}