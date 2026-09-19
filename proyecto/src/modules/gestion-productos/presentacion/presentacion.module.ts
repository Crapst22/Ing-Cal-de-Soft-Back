import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PresentacionController } from './application/controllers/presentacion.controller';
import { Presentacion } from './domain/entities/presentacion.entity';
import { PresentacionPersistenceAdapter } from './infraestructure/repositories/presentacion.persistence-adapter';
import { PresentacionRepository } from './infraestructure/repositories/presentacion.repository';
import { PresentacionService } from './application/services/presentacion.service';
import { PoliticaEliminacionPresentacion } from './domain/services/politica-eliminacion-presentacion.service';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Presentacion]),
    UsuarioModule,
    forwardRef(() => ProductoModule),
  ],
  controllers: [PresentacionController],
  providers: [
    PresentacionService,
    PresentacionPersistenceAdapter,
    PoliticaEliminacionPresentacion,
    {
      provide: 'IPresentacionRepository',
      useClass: PresentacionRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [TypeOrmModule, PresentacionService, 'IPresentacionRepository'],
})
export class PresentacionModule {}