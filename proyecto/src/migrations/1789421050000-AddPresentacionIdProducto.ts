import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPresentacionIdProducto1789421050000
  implements MigrationInterface
{
  name = 'AddPresentacionIdProducto1789421050000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`producto\` ADD \`presentacionId\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`producto\` DROP COLUMN \`presentacionId\``,
    );
  }
}