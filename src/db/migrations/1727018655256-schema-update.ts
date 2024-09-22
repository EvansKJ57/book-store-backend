import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1727018655256 implements MigrationInterface {
  name = 'SchemaUpdate1727018655256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "likes" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "updated_date"`);
  }
}
