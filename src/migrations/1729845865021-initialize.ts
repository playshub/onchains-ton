import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1729845865021 implements MigrationInterface {
    name = 'Initialize1729845865021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."playshub_transactions_type_enum" AS ENUM('unknown', 'check_in', 'deposit', 'withdraw', 'buy')`);
        await queryRunner.query(`CREATE TABLE "playshub_transactions" ("hash" character varying NOT NULL, "timestamp" integer NOT NULL, "source" character varying NOT NULL, "destination" character varying NOT NULL, "value" character varying NOT NULL, "total_fees" character varying NOT NULL, "payload" character varying NOT NULL, "type" "public"."playshub_transactions_type_enum" NOT NULL DEFAULT 'unknown', CONSTRAINT "PK_60bf1bff44a70a82c25ee714a3a" PRIMARY KEY ("hash"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "playshub_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."playshub_transactions_type_enum"`);
    }

}
