import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserIdToApiKeysTable1788645931106 implements MigrationInterface {
    name = 'AddedUserIdToApiKeysTable1788645931106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_keys" ADD "user_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "user_id"`);
    }

}
