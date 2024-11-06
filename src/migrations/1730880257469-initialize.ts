import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1730880257469 implements MigrationInterface {
    name = 'Initialize1730880257469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."webhook_status_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "webhook_status" ("hash" character varying NOT NULL, "status" "public"."webhook_status_status_enum" NOT NULL DEFAULT 'pending', "attempts" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_efc5be8df18fb07b7f65fdb2c9e" PRIMARY KEY ("hash"))`);
        await queryRunner.query(`CREATE TABLE "observer_accounts" ("address" character varying NOT NULL, "name" character varying NOT NULL, "lastTxLt" character varying NOT NULL, "lastTxHash" character varying NOT NULL, "stopped" boolean NOT NULL, "synced" boolean NOT NULL, CONSTRAINT "PK_4d1a97300f11002db28cba3fac4" PRIMARY KEY ("address"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "observer_accounts"`);
        await queryRunner.query(`DROP TABLE "webhook_status"`);
        await queryRunner.query(`DROP TYPE "public"."webhook_status_status_enum"`);
    }

}
