import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1730097820717 implements MigrationInterface {
    name = 'Initialize1730097820717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."webhook_status_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "webhook_status" ("hash" character varying NOT NULL, "status" "public"."webhook_status_status_enum" NOT NULL DEFAULT 'pending', "attempts" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_efc5be8df18fb07b7f65fdb2c9e" PRIMARY KEY ("hash"))`);
        await queryRunner.query(`CREATE TYPE "public"."playshub_transactions_type_enum" AS ENUM('unknown', 'check_in', 'deposit', 'withdraw', 'buy')`);
        await queryRunner.query(`CREATE TABLE "playshub_transactions" ("hash" character varying NOT NULL, "timestamp" integer NOT NULL, "source" character varying NOT NULL, "destination" character varying NOT NULL, "value" character varying NOT NULL, "total_fees" character varying NOT NULL, "payload" character varying NOT NULL, "type" "public"."playshub_transactions_type_enum" NOT NULL DEFAULT 'unknown', CONSTRAINT "PK_60bf1bff44a70a82c25ee714a3a" PRIMARY KEY ("hash"))`);
        await queryRunner.query(`CREATE TABLE "observer_accounts" ("address" character varying NOT NULL, "name" character varying NOT NULL, "lastTxLt" character varying NOT NULL, "lastTxHash" character varying NOT NULL, CONSTRAINT "PK_4d1a97300f11002db28cba3fac4" PRIMARY KEY ("address"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "observer_accounts"`);
        await queryRunner.query(`DROP TABLE "playshub_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."playshub_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "webhook_status"`);
        await queryRunner.query(`DROP TYPE "public"."webhook_status_status_enum"`);
    }

}
