import { Entity, Column, Index, OneToOne} from "typeorm";
import { BaseModel } from "../../common/baseModel";
import { FILE_HOST_PROVIDER } from "../../common/enums/upload.enum";
// import UserModel from "./UserModel";

@Entity({ name: "uploads" })
@Index(["uploadable_id", "uploadable_type"])
export class UploadModel extends BaseModel {
  @Column()
  file_name!: string;

  @Column()
  file_size!: number;

  @Column()
  file_mimetype!: string;

  @Column({
        type: "enum",
        enum: FILE_HOST_PROVIDER,
        default: FILE_HOST_PROVIDER.CLOUDINARY
    })
  file_host_provider!: FILE_HOST_PROVIDER;

  @Column()
  url!: string;

  @Column()
  uploadable_id!: number;

  @Column()
  uploadable_type!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: any;

  // @OneToOne(() => UserModel, (user) => user.avatar, {
  //     onDelete: "SET NULL",
  //     onUpdate: "CASCADE",
  // })
  // user_avatar?: UserModel | null;
}
