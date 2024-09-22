import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1727020672686 implements MigrationInterface {
  name = 'SchemaUpdate1727020672686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "likes" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "created_date"`);
  }
}
