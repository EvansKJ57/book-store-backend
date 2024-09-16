import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1726473310029 implements MigrationInterface {
    name = 'SchemaUpdate1726473310029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "created_date" TO "createdAt"`);
    }

}
