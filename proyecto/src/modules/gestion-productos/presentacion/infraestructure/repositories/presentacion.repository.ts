import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository.interface';
import { PresentacionPersistenceAdapter } from './presentacion.persistence-adapter';

@Injectable()
export class PresentacionRepository implements IPresentacionRepository {
  private readonly logger = new Logger(PresentacionRepository.name);

  constructor(
    private readonly persistenceService: PresentacionPersistenceAdapter,
  ) {}

  async create(data: CreatePresentacionDto): Promise<Presentacion> {
    this.logger.log(`Creando una nueva Presentación`);
    return this.persistenceService.create(data);
  }

  async findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: Presentacion[]; total: number }> {
    return this.persistenceService.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findAllListado(): Promise<Presentacion[]> {
    return this.persistenceService.findAllListado();
  }

  async findAllFor(denominacion: string): Promise<Presentacion[]> {
    return this.persistenceService.findAllFor(denominacion);
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    return this.persistenceService.findByIdConAuditoria(id);
  }

  async findOne(id: number): Promise<Presentacion | null> {
    return this.persistenceService.findOne(id);
  }

  async update(
    id: number,
    data: UpdatePresentacionDto,
  ): Promise<Presentacion> {
    return this.persistenceService.update(id, data);
  }

  async remove(data: Presentacion, usuario: Usuario): Promise<Presentacion> {
    return this.persistenceService.remove(data, usuario);
  }
}