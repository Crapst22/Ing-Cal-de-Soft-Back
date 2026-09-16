import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperLinea1789421039686 implements MigrationInterface {
  name = 'AddSuperLinea1789421039686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`super_linea\` (\`id\` int NOT NULL AUTO_INCREMENT, \`denominacion\` varchar(255) NOT NULL, \`observacion\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`usuarioCreatedId\` int NULL, \`usuarioDeletedId\` int NULL, \`usuarioUpdatedId\` int NULL, \`sistema\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_super_linea_denominacion_deletedAt\` (\`denominacion\`, \`deletedAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`linea\` ADD \`super_linea_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`linea\` ADD CONSTRAINT \`FK_linea_super_linea\` FOREIGN KEY (\`super_linea_id\`) REFERENCES \`super_linea\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`linea\` DROP FOREIGN KEY \`FK_linea_super_linea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`linea\` DROP COLUMN \`super_linea_id\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_super_linea_denominacion_deletedAt\` ON \`super_linea\``);
    await queryRunner.query(`DROP TABLE \`super_linea\``);
  }
}