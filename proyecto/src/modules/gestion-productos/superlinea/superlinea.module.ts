import { forwardRef, Module } from '@nestjs/common';
import { SuperLinea } from './domain/entities/superlinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaPersistenceAdapter } from './infraestructure/repositories/superlinea.persistence-adapter';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { SuperLineaRepository } from './infraestructure/repositories/superlinea.repository';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { SuperLineaController } from './application/controllers/superlinea.controller';
import { SuperLineaService } from './application/services/superlinea.service';
import { PoliticaEliminacionSuperLinea } from './domain/services/politica-eliminacion-superlinea.service';
import { LineaModule } from '../linea/linea.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperLinea]),
    UsuarioModule,
    forwardRef(() => LineaModule),
  ],
  controllers: [SuperLineaController],
  providers: [
    SuperLineaService,
    PoliticaEliminacionSuperLinea,
    {
      provide: 'ISuperLineaRepository',
      useClass: SuperLineaRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    SuperLineaPersistenceAdapter,
  ],
  exports: [
    TypeOrmModule,
    SuperLineaService,
    SuperLineaPersistenceAdapter,
    'ISuperLineaRepository',
  ],
})
export class SuperLineaModule {}