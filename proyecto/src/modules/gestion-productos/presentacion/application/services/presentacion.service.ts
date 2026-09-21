import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository.interface';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { PresentacionDto } from '../../dto/presentacion.dto';
import { PresentacionMapper } from '../../mappers/presentacion.mapper';
import { PoliticaEliminacionPresentacion } from '../../domain/services/politica-eliminacion-presentacion.service';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import {
  TipoPresentacion,
  generarDenominacionPresentacion,
} from '../../utils/presentacion.util';

@Injectable()
export class PresentacionService {
  private readonly logger = new Logger(PresentacionService.name);
  constructor(
    @Inject('IPresentacionRepository')
    private readonly repository: IPresentacionRepository,
    private readonly usuarioService: UsuarioService,
    private readonly validacionesService: PoliticaEliminacionPresentacion,
  ) {}

  private readonly ENTITY_NAME = 'Presentación';

  private nombreDe(entity: Presentacion): string {
    return generarDenominacionPresentacion(
      entity.tipo,
      entity.quantity,
      entity.volumen,
      entity.unidad,
    );
  }

  private validarConsistenciaTipo(
    tipo: TipoPresentacion,
    quantity?: number | null,
    volumen?: number | null,
    unidad?: string | null,
  ): void {
    if (tipo === 'volume') {
      if (volumen == null) {
        throw new BadRequestException(
          'El volumen es obligatorio para presentaciones de tipo volumen.',
        );
      }
      if (!unidad) {
        throw new BadRequestException(
          'La unidad es obligatoria para presentaciones de tipo volumen.',
        );
      }
    }

    if (tipo === 'pack' && volumen != null && !unidad) {
      throw new BadRequestException(
        'Debe indicar la unidad cuando se carga un volumen en un pack.',
      );
    }
  }

  async create(dto: CreatePresentacionDto) {
    this.logger.log(`Creando una nueva ${this.ENTITY_NAME}...`);
    this.validarConsistenciaTipo(dto.tipo, dto.quantity, dto.volumen, dto.unidad);

    const entity = await this.repository.create(dto);

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      this.nombreDe(entity),
      'creada',
    );
  }

  async update(id: number, dto: UpdatePresentacionDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    const presentacion = await this.findEntityById(id);
    ensureNotSistemaEntity(presentacion, this.ENTITY_NAME);

    const tipo = dto.tipo ?? presentacion.tipo;
    const quantity =
      dto.quantity !== undefined ? dto.quantity : (presentacion.quantity ?? null);
    const volumen =
      dto.volumen !== undefined ? dto.volumen : (presentacion.volumen ?? null);
    const unidad =
      dto.unidad !== undefined ? dto.unidad : (presentacion.unidad ?? null);

    this.validarConsistenciaTipo(tipo, quantity, volumen, unidad);

    const entity = await this.repository.update(id, {
      ...dto,
      tipo,
      quantity,
      volumen,
      unidad,
    });

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      this.nombreDe(entity),
      'editada',
    );
  }

  async findAllFor(
    denominacion: string,
  ): Promise<{ data: PresentacionDto[]; total: number }> {
    const result = await this.repository.findAllFor(denominacion);
    const data: PresentacionDto[] = result.map((presentacion) =>
      PresentacionMapper.toDto(presentacion),
    );
    return {
      data,
      total: 1,
    };
  }

  async findAllListado(): Promise<Presentacion[]> {
    return this.repository.findAllListado();
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: PresentacionDto[]; total: number }> {
    this.logger.log(
      `Buscando ${this.ENTITY_NAME}s: ${denominacion} skip=${skip}, take=${take}`,
    );
    const result = await this.repository.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
    const data: PresentacionDto[] = result.data.map((presentacion) =>
      PresentacionMapper.toDto(presentacion),
    );
    return {
      data,
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async findDtoById(id: number) {
    const entity = await this.findEntityById(id);
    return PresentacionMapper.toDto(entity);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async remove(id: number, usuarioId: number) {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }

    ensureNotSistemaEntity(entity, this.ENTITY_NAME);

    const tieneProductosActivos =
      await this.validacionesService.tieneProductosActivosParaPresentacion(id);

    if (tieneProductosActivos) {
      throw new ConflictException(
        'No se puede eliminar la presentación porque está asociada a productos activos.',
      );
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }
    await this.repository.remove(entity, usuario);

    return MessageFrontUtils.createSimple(
      this.ENTITY_NAME,
      this.nombreDe(entity),
      'eliminada',
    );
  }

  async findByIdConAuditoria(id: number) {
    const entity = await this.repository.findByIdConAuditoria(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }
}