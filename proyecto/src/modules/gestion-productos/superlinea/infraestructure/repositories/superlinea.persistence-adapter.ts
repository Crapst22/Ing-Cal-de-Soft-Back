import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { Repository, DataSource } from 'typeorm';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { SuperLinea } from '../../domain/entities/superlinea.entity';
import { ISuperLineaRepository } from '../../domain/interfaces/superlinea.repository.interface';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { QueryBuilderHelper } from 'src/modules/common/query-builders/query-builder-helpers';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class SuperLineaPersistenceAdapter
  extends BasePersistenceAdapter<SuperLinea>
  implements ISuperLineaRepository
{
  private readonly logger = new Logger(SuperLineaPersistenceAdapter.name);

  protected readonly ALIAS = 'superLinea';

  constructor(
    @InjectRepository(SuperLinea)
    repository: Repository<SuperLinea>,

    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreateSuperLineaDto): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);

    try {
      const nuevaEntity = repo.create({
        denominacion: data.denominacion,
        usuarioCreatedId: data.usuarioCreatedId,
        observacion: data.observacion,
      });

      const entityGuardada = await repo.save(nuevaEntity);

      return entityGuardada;
    } catch (error) {
      this.logger.error(`Error al conectar con la base de datos: ${error}`);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional()
  async update(id: number, data: UpdateSuperLineaDto): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);

    const entity = await repo.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Super línea con ID ${id} no encontrada`);
    }

    entity.denominacion = data.denominacion ?? entity.denominacion;
    entity.observacion = data.observacion ?? entity.observacion;
    entity.usuarioCreatedId = data.usuarioCreatedId;

    const entityActualizada = await repo.save(entity);

    return entityActualizada;
  }

  async findOne(id: number): Promise<SuperLinea | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('superLinea')
        .where('superLinea.id = :id', { id })
        .andWhere('superLinea.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`Entidad obtenida: ${JSON.stringify(entity)}`);

      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada');
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

  async findAllListado(): Promise<SuperLinea[]> {
    try {
      const query = this.baseQuery();
      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllListado', error);
    }
  }

  async findByDenominacion(denominacion: string): Promise<SuperLinea | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('superLinea')
        .where('superLinea.denominacion = :denominacion', { denominacion })
        .andWhere('superLinea.deletedAt IS NULL')
        .getOne();

      return entity;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionWith(denominacion: string): Promise<SuperLinea | null> {
    this.logger.log(
      `Buscando denominación (incluyendo borradas): ${denominacion}`,
    );
    try {
      const normalizada = denominacion.trim().toUpperCase();

      const entity = await this.repository
        .createQueryBuilder('superLinea')
        .withDeleted()
        .where('UPPER(superLinea.denominacion) = :denominacion', {
          denominacion: normalizada,
        })
        .getOne();

      if (!entity) {
        this.logger.log(
          `No encontrada super línea (ni activa ni eliminada): ${normalizada}`,
        );
        return null;
      }

      this.logger.log(
        `Encontrada super línea (puede estar activa o eliminada): ID=${entity.id}, denominación=${entity.denominacion}`,
      );
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacionWith', error);
    }
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: SuperLinea[]; total: number }> {
    try {
      const query = this.baseQuery(incluirEliminados);

      if (denominacion) {
        query.andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      QueryBuilderHelper.applyPagination(query, skip, take);

      const [data, total] = await query.getManyAndCount();
      return { data, total };
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacionFiltered', error);
    }
  }

  async findAllFor(denominacion: string): Promise<SuperLinea[]> {
    try {
      const query = this.baseQuery();
      query.andWhere('UPPER(superLinea.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllFor', error);
    }
  }

  async findAllSinSistemaFor(denominacion: string): Promise<SuperLinea[]> {
    try {
      const query = this.repository
        .createQueryBuilder('superLinea')
        .where('superLinea.deletedAt IS NULL')
        .andWhere('superLinea.sistema = :sistema', { sistema: 0 });
      if (denominacion && denominacion.trim() !== '') {
        query.andWhere('UPPER(superLinea.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      return await query.orderBy('superLinea.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async remove(entity: SuperLinea, usuario: Usuario): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);

    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;
    await repo.save(entity);

    return entity;
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      const raw = await this.repository
        .createQueryBuilder('superLinea')
        .leftJoin(
          'usuario',
          'usuarioCreated',
          'usuarioCreated.id = superLinea.usuarioCreatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioUpdated',
          'usuarioUpdated.id = superLinea.usuarioUpdatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioDeleted',
          'usuarioDeleted.id = superLinea.usuarioDeletedId',
        )
        .addSelect([
          'superLinea.id as superlinea_id',
          'superLinea.denominacion as superlinea_denominacion',
          'superLinea.createdAt as superlinea_createdAt',
          'superLinea.updatedAt as superlinea_updatedAt',
          'superLinea.deletedAt as superlinea_deletedAt',
          'usuarioCreated.denominacion as usuarioCreated_nombre',
          'usuarioUpdated.denominacion as usuarioUpdated_nombre',
          'usuarioDeleted.denominacion as usuarioDeleted_nombre',
        ])
        .where('superLinea.id = :id', { id })
        .getRawOne();

      console.debug('RAW RESULTADO:', raw);

      if (!raw) return null;

      return {
        id: raw.superlinea_id ?? 0,
        detalle: raw.superlinea_denominacion
          ? `super línea ${raw.superlinea_denominacion}`
          : 'super línea (sin denominación)',
        createdAt: raw.superlinea_createdAt
          ? FechaUtils.formatFechaHora(raw.superlinea_createdAt)
          : '',
        updatedAt: raw.superlinea_updatedAt
          ? FechaUtils.formatFechaHora(raw.superlinea_updatedAt)
          : '',
        deletedAt: raw.superlinea_deletedAt
          ? FechaUtils.formatFechaHora(raw.superlinea_deletedAt)
          : '',
        usuarioCreated: raw.usuarioCreated_nombre ?? '',
        usuarioUpdated: raw.usuarioUpdated_nombre ?? '',
        usuarioDeleted: raw.usuarioDeleted_nombre ?? '',
      };
    } catch (error) {
      console.error('ERROR EN findByIdConAuditoria:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }
}