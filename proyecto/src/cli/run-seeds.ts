import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedAllService } from '../modules/common/seed/seed-all/seed-all.service';
import { SeedOrganizacionService } from '../modules/common/seed/seed-organizacion/seed-organizacion.service';
import { SeedUsuarioService } from '../modules/common/seed/seed-usuario/seed-usuario.service';


async function bootstrap() {
  const logger = new Logger('SeedCLI');

  const arg = process.argv.find((a) => a.startsWith('solo='));
  const solo = arg ? arg.split('=')[1] : undefined;

  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    try {
      if (solo === 'usuario') {
        logger.log('🚀 Ejecutando seed de USUARIO...');
        await app.get(SeedUsuarioService, { strict: false }).runAllSeeds();
      } else if (solo === 'organizacion') {
        logger.log('🚀 Ejecutando seed de ORGANIZACION...');
        await app.get(SeedOrganizacionService, { strict: false }).runAllSeeds();
      } else {
        logger.log('🚀 Ejecutando TODOS los seeds...');
        await app.get(SeedAllService, { strict: false }).runAllSeeds();
      }

      logger.log('✅ Seeds ejecutados correctamente.');
    } finally {
      await app.close();
    }
  } catch (error) {
    const msg = error instanceof Error ? `${error.message}\n${error.stack}` : error;
    logger.error('❌ Error ejecutando los seeds:', msg);
    process.exitCode = 1;
  }
}

bootstrap();