import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsWaSession1678886400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE wa_session
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE wa_session
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at;
    `);
  }
}