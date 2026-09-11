import { Column, Entity, Index } from "typeorm";
import { BaseModel } from "../../../common/baseModel";
import { Service } from "typedi";
import { LogLevel, LogType } from "../enums/logs.enums";

@Service()
@Entity({ name: "logs" })
@Index(['api_key_id', 'timestamp'])
@Index(['api_key_id', 'type'])
@Index(['api_key_id', 'level', 'timestamp'])
@Index(['api_key_id', 'environment', 'timestamp'])
export class LogsModel extends BaseModel {
  @Column({type: "jsonb", nullable: true})
  context?: any;

  @Column({type: "jsonb", nullable: true})
  extras?: any;

  @Column({type: "text", nullable: true})
  exception?: string;

  @Column({ type: 'bigint' })
  timestamp!: number;

  @Column({nullable: true})
  type?: LogType;

  @Column({nullable: true})
  level?: LogLevel;

  @Column({nullable: true, type: 'text'})
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