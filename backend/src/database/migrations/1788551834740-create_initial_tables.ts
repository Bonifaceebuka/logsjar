import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1788551834740 implements MigrationInterface {
    name = 'CreateInitialTables1788551834740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploads_file_host_provider_enum" AS ENUM('CLOUDINARY')`);
        await queryRunner.query(`CREATE TABLE "uploads" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_size" integer NOT NULL, "file_mimetype" character varying NOT NULL, "file_host_provider" "public"."uploads_file_host_provider_enum" NOT NULL DEFAULT 'CLOUDINARY', "url" character varying NOT NULL, "uploadable_id" integer NOT NULL, "uploadable_type" character varying NOT NULL, "metadata" jsonb, CONSTRAINT "UQ_82e69c7e214c85c3d6b3b476d2e" UNIQUE ("uuid"), CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5654f5380a403fbc5db802a6e3" ON "uploads" ("uploadable_id", "uploadable_type") `);
        await queryRunner.query(`CREATE TYPE "public"."users_user_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'BANNED')`);
        await queryRunner.query(`CREATE TYPE "public"."users_mode_of_sign_up_enum" AS ENUM('GITHUB', 'EMAIL_PASSWORD', 'PENDING_VERIFICATION', 'GOOGLE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "terms_and_conditions" boolean NOT NULL, "verification_token" character varying, "verification_expires_at" TIMESTAMP, "reset_token" character varying, "reset_token_expires_at" TIMESTAMP, "email" character varying NOT NULL, "phone" character varying, "password_hash" character varying, "picture" character varying, "is_verified" boolean NOT NULL DEFAULT false, "plan_id" integer, "avatar_id" integer, "user_status" "public"."users_user_status_enum" NOT NULL DEFAULT 'PENDING', "mode_of_sign_up" "public"."users_mode_of_sign_up_enum" NOT NULL DEFAULT 'EMAIL_PASSWORD', "social_account_id" character varying, CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid"), CONSTRAINT "UQ_659bd3bd8868bd1decb467d9396" UNIQUE ("verification_token"), CONSTRAINT "UQ_dec0bae70633e911fe6a5983c17" UNIQUE ("reset_token"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."access_tokens_accessable_to_enum" AS ENUM('UserModel')`);
        await queryRunner.query(`CREATE TABLE "access_tokens" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "accessable_id" integer NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "accessable_to" "public"."access_tokens_accessable_to_enum" NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_eb2973c8e3ae517add8edc8a566" UNIQUE ("uuid"), CONSTRAINT "PK_65140f59763ff994a0252488166" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "access_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."access_tokens_accessable_to_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_mode_of_sign_up_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5654f5380a403fbc5db802a6e3"`);
        await queryRunner.query(`DROP TABLE "uploads"`);
        await queryRunner.query(`DROP TYPE "public"."uploads_file_host_provider_enum"`);
    }

}
