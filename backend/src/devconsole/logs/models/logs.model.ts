import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "../../../common/baseModel";
import { Service } from "typedi";
import { LogLevelEnum, LogType } from "@logsjar/shared";
import { ApiKeyModel } from "@/devconsole/api-key/models/apiKey.model";

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

  @Column({ type: "enum", enum:LogLevelEnum, nullable: true})
  level?: LogLevelEnum;

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

  @ManyToOne(() => ApiKeyModel,{

  })
  @JoinColumn({ name: 'api_key_id', referencedColumnName: 'id' })
  apiKey!: ApiKeyModel;
}