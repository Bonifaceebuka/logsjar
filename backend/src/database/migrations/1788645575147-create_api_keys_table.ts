import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiKeysTable1788645575147 implements MigrationInterface {
    name = 'CreateApiKeysTable1788645575147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."api_keys_environment_enum" AS ENUM('PRODUCTION', 'DEVELOPMENT')`);
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "environment" "public"."api_keys_environment_enum" NOT NULL, "name" character varying NOT NULL, "key_hash" character varying NOT NULL, "masked_key" character varying NOT NULL, CONSTRAINT "UQ_7caad710392a404f52adf8707b7" UNIQUE ("uuid"), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "api_keys"`);
        await queryRunner.query(`DROP TYPE "public"."api_keys_environment_enum"`);
    }

}
