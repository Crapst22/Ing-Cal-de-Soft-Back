import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPresentacion1789421040000 implements MigrationInterface {
  name = 'AddPresentacion1789421040000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`presentacion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` varchar(20) NOT NULL DEFAULT 'pack', \`quantity\` int NULL, \`volumen\` decimal(12,3) NULL, \`unidad\` varchar(20) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`usuarioCreatedId\` int NULL, \`usuarioDeletedId\` int NULL, \`usuarioUpdatedId\` int NULL, \`sistema\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`producto\` ADD \`presentacion_id\` int NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_producto_presentacion_id\` ON \`producto\` (\`presentacion_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`producto\` ADD CONSTRAINT \`FK_producto_presentacion\` FOREIGN KEY (\`presentacion_id\`) REFERENCES \`presentacion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`producto\` DROP FOREIGN KEY \`FK_producto_presentacion\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_producto_presentacion_id\` ON \`producto\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`producto\` DROP COLUMN \`presentacion_id\``,
    );
    await queryRunner.query(`DROP TABLE \`presentacion\``);
  }
}