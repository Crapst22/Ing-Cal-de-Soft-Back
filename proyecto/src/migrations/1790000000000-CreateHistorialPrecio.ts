import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHistorialPrecio1790000000000 implements MigrationInterface {
  name = 'CreateHistorialPrecio1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`historial_precio\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha\` timestamp NOT NULL,
        \`precioAnterior\` decimal(15,5) NOT NULL DEFAULT '0.00000',
        \`precioNuevo\` decimal(15,5) NOT NULL DEFAULT '0.00000',
        \`motivo\` text NULL,
        \`tipoCambio\` varchar(12) NOT NULL,
        \`producto_id\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deletedAt\` timestamp NULL,
        \`usuario_created_id\` int NULL,
        \`usuario_updated_id\` int NULL,
        \`sistema\` int NOT NULL DEFAULT '0',
        INDEX \`IDX_historial_precio_producto\` (\`producto_id\`),
        INDEX \`IDX_historial_precio_fecha\` (\`fecha\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_historial_precio_producto\` FOREIGN KEY (\`producto_id\`) REFERENCES \`producto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_historial_precio_usuario_created\` FOREIGN KEY (\`usuario_created_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_historial_precio_usuario_updated\` FOREIGN KEY (\`usuario_updated_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `historial_precio`');
  }
}
