import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository.interface';
import { generarDenominacionPresentacion } from '../../domain/value-objects/denominacion-presentacion';

@Injectable()
export class PresentacionPersistenceAdapter
  extends BasePersistenceAdapter<Presentacion>
  implements IPresentacionRepository
{
  private readonly logger = new Logger(PresentacionPersistenceAdapter.name);

  protected readonly ALIAS = 'presentacion';

  constructor(
    @InjectRepository(Presentacion)
    repository: Repository<Presentacion>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  private nombreDe(entity: Presentacion): string {
    return generarDenominacionPresentacion(
      entity.tipo,
      entity.quantity,
      entity.volumen,
      entity.unidad,
    );
  }

  @Transactional()
  async create(data: CreatePresentacionDto): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    try {
      const nuevaEntity = repo.create({
        tipo: data.tipo,
        quantity: data.quantity ?? null,
        volumen: data.volumen ?? null,
        unidad: data.unidad ?? null,
        usuarioCreatedId: data.usuarioCreatedId,
      });
      return await repo.save(nuevaEntity);
    } catch (error) {
      this.logger.error(`Error al crear Presentación: `, error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Presentacion[]; total: number }> {
    try {
      const todas = await this.baseQuery(incluirEliminados).getMany();
      const conNombre = todas.map((entity) => ({
        entity,
        nombre: this.nombreDe(entity),
      }));

      const filtradas = denominacion
        ? conNombre.filter(({ nombre }) =>
            nombre.toUpperCase().includes(denominacion.toUpperCase()),
          )
        : conNombre;

      filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre));

      const total = filtradas.length;
      const data = filtradas.slice(skip, skip + take).map(({ entity }) => entity);

      return { data, total };
    } catch (error) {
      handleDatabaseError(this.logger, 'findBy', error);
    }
  }

  async findAllListado(): Promise<Presentacion[]> {
    try {
      const todas = await this.baseQuery().getMany();
      return todas
        .map((entity) => ({ entity, nombre: this.nombreDe(entity) }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(({ entity }) => entity);
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllListado', error);
    }
  }

  async findAllFor(denominacion: string): Promise<Presentacion[]> {
    try {
      const todas = await this.baseQuery().getMany();
      return todas
        .map((entity) => ({ entity, nombre: this.nombreDe(entity) }))
        .filter(({ nombre }) =>
          nombre.toUpperCase().includes(denominacion.toUpperCase()),
        )
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(({ entity }) => entity);
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllFor', error);
    }
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) return null;

      return {
        id: entity.id,
        detalle: `Presentación ${this.nombreDe(entity)}`,
        createdAt: entity.createdAt
          ? FechaUtils.formatFechaHora(entity.createdAt)
          : '',
        updatedAt: entity.updatedAt
          ? FechaUtils.formatFechaHora(entity.updatedAt)
          : '',
        deletedAt: entity.deletedAt
          ? FechaUtils.formatFechaHora(entity.deletedAt)
          : '',
        usuarioCreated: '',
        usuarioUpdated: '',
        usuarioDeleted: '',
      };
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Presentacion | null> {
    try {
      const entity = await this.repository.findOne({
        where: { id, deletedAt: IsNull() },
      });
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada.');
      }
      return entity;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async update(id: number, data: UpdatePresentacionDto): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    try {
      const entity = await repo.findOne({ where: { id } });
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada.');
      }

      if (data.tipo !== undefined) entity.tipo = data.tipo;
      if (data.quantity !== undefined) entity.quantity = data.quantity;
      if (data.volumen !== undefined) entity.volumen = data.volumen;
      if (data.unidad !== undefined) entity.unidad = data.unidad;
      if (data.usuarioUpdatedId !== undefined)
        entity.usuarioUpdatedId = data.usuarioUpdatedId;

      return await repo.save(entity);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      this.logger.error(`Error al actualizar Presentación: `);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional()
  async remove(data: Presentacion, usuario: Usuario): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    try {
      data.deletedAt = new Date();
      data.usuarioDeletedId = usuario.id;
      return await repo.save(data);
    } catch (error) {
      this.logger.error(`Error al eliminar Presentación: `);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }
}