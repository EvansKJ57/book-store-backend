import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1726388323040 implements MigrationInterface {
  name = 'SchemaUpdate1726388323040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_Date"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_Date"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_date"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_Date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_Date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
