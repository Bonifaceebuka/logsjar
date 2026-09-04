import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseModel } from "@/common/baseModel";
import { AccountStatus, ONBOARDING_MEDIUM } from "@/common/enums/user.enums";
import { UploadModel } from "@/media/models/upload.model";

@Entity({ name: "users" })
export default class UserModel extends BaseModel {
    @Column({ type: 'varchar' })
    full_name!: string;

    @Column()
    terms_and_conditions!: boolean;

    @Column({ unique: true, nullable: true, type: 'varchar' })
    verification_token?: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    verification_expires_at?: Date | null;

    @Column({ unique: true, nullable: true, type: 'varchar' })
    reset_token?: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    reset_token_expires_at?: Date | null;

    @Column({ unique: true, type: 'varchar' })
    email!: string;

    @Column({ unique: true, nullable: true, type: 'varchar' })
    phone?: string;

    @Column({ nullable: true })
    password_hash?: string;

    @Column({ nullable: true })
    picture?: string;

    @Column({ default: false })
    is_verified!: Boolean;

    @Column({ nullable: true })
    plan_id?: number;

    @Column({ nullable: true })
    avatar_id?: number;

    @Column({
        type: "enum",
        enum: AccountStatus,
        default: AccountStatus.PENDING
    })
    user_status!: AccountStatus;

    @Column({
        type: "enum",
        enum: ONBOARDING_MEDIUM,
        default: ONBOARDING_MEDIUM.EMAIL_PASSWORD
    })
    mode_of_sign_up!: ONBOARDING_MEDIUM;

    @Column({ nullable: true })
    social_account_id?: string;

  // @OneToOne(() => UploadModel, (upload) => upload.user_avatar, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "avatar_id", referencedColumnName: "id" })
  // avatar?: UploadModel;
}