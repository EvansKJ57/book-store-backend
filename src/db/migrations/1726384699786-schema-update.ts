import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1726384699786 implements MigrationInterface {
  name = 'SchemaUpdate1726384699786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
  }
}
