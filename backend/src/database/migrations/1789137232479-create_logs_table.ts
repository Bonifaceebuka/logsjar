import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLogsTable1789137232479 implements MigrationInterface {
    name = 'CreateLogsTable1789137232479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "context" jsonb, "extras" jsonb, "exception" text, "timestamp" bigint NOT NULL, "type" character varying, "level" character varying, "message" text, "environment" character varying, "service" character varying, "release" character varying, "api_key_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_f013d49cbc46779530d28f095a0" UNIQUE ("uuid"), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9ec3a10e97b6726f512216d59d" ON "logs" ("api_key_id", "environment", "timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_71145e4a622c5e44759e944c78" ON "logs" ("api_key_id", "level", "timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d2dc5c413b43c16319433fb47" ON "logs" ("api_key_id", "type") `);
        await queryRunner.query(`CREATE INDEX "IDX_d4992fd6dc77a7712fdc2fe86b" ON "logs" ("api_key_id", "timestamp") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d4992fd6dc77a7712fdc2fe86b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d2dc5c413b43c16319433fb47"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71145e4a622c5e44759e944c78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9ec3a10e97b6726f512216d59d"`);
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
