import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ProveedorService } from 'src/modules/organizacion/proveedor/application/services/proveedor.service';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';
import { AuditoriaMapper } from 'src/modules/gestion-sistema/auditoria/mappers/auditoria.mapper';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { Producto } from '../../domain/entities/producto.entity';
import { IProductoRepository } from '../../domain/interfaces/producto.repository-interface';
import { CreateProductoDto } from '../../dto/create-producto.dto';
import { GetProductoDto } from '../../dto/get-producto.dto';
import { UpdateProductoDto } from '../../dto/update-producto.dto';
import { ActualizarPreciosMasivoDto } from '../../dto/actualizar-precios-masivo.dto';
import { UpdatePrecioDto } from '../../dto/update-precio.dto';
import { ProductoMapper } from '../../mappers/producto.mapper';
import { LineaService } from 'src/modules/gestion-productos/linea/application/services/linea.service';
import { MarcaService } from 'src/modules/gestion-productos/marca/application/services/marca.service';
import { ProductoIntrinsicValidationService } from '../../domain/services/producto-intrinsic-validation.service';
import { ProductoValidationService } from '../../domain/services/producto-validation.service';
import { ProductoDenominacionService } from '../../domain/services/producto-denominacion.service';
import { ProductoRelatedEntitiesValidator } from '../../infraestructure/validators/producto-related-entities.validator';
import { ProductoUniquenessValidator } from '../../infraestructure/validators/producto-uniqueness.validator';
import { UsuarioValidator } from 'src/modules/common/utils/validation/usuario-validator';
import { ProductoDeletePolicy } from '../policies/producto-delete.policy';
import { HistorialPrecioMapper } from '../../mappers/historial-precio.mapper';
import { PresentacionService } from '../../../presentacion/application/services/presentacion.service';
@Injectable()
export class ProductoService {
  private readonly logger = new Logger(ProductoService.name);
  constructor(
    @Inject('IProductoRepository')
    private readonly repository: IProductoRepository,
    private readonly lineaService: LineaService,

    @Inject(forwardRef(() => MarcaService))
    private readonly marcaService: MarcaService,
    private readonly proveedorService: ProveedorService,
    private readonly usuarioService: UsuarioService,

    //  Domain Services
    private readonly intrinsicValidationService: ProductoIntrinsicValidationService,
    private readonly validationService: ProductoValidationService,
    private readonly denominacionService: ProductoDenominacionService,

    // Infrastructure Validators
    private readonly relatedEntitiesValidator: ProductoRelatedEntitiesValidator,
    private readonly uniquenessValidator: ProductoUniquenessValidator,
    private readonly usuarioValidator: UsuarioValidator,

    private readonly productoDeletePolicy: ProductoDeletePolicy,

    private readonly presentacionService: PresentacionService,

  ) { }

  private readonly ENTITY_NAME = 'Producto';

  async create(dto: CreateProductoDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );

    // Orquestar todas las validaciones
    const { marca, linea, presentacion, usuario } =
      await this.validarYPrepararCreacion(dto);


    const entity = await this.repository.create(
      dto,
      linea,
      marca,
      usuario,
      presentacion ?? null,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateProductoDto) {
    this.logger.log(`Actualizandox  ${this.ENTITY_NAME} con ID: ${id}`);

    const { marca, linea, presentacion, usuario } =
      await this.validarYPrepararActualizacion(id, dto);

    const entity = await this.repository.update(
      id,
      dto,
      linea,
      marca,
      usuario,
      presentacion ?? null,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }

  async actualizarPreciosMasivo(dto: ActualizarPreciosMasivoDto) {
    this.logger.log(
      `Iniciando actualización masiva de precios - Tipo: ${dto.tipoAumento}, Valor: ${dto.valor}, Línea: ${dto.lineaId ?? 'GLOBAL'}`,
    );

    // 1. Validar existencia del usuario
    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioId,
    );

    // 2. Si se especificó lineaId, validar que exista
    let denominacionDestino = 'Todos los productos';
    if (dto.lineaId) {
      const linea = await this.lineaService.findEntityById(dto.lineaId);
      denominacionDestino = `Línea '${linea.denominacion}'`;
    }

    // 3. Ejecutar la actualización en el repositorio
    const totalActualizados = await this.repository.actualizarPreciosMasivo(
      dto.tipoAumento,
      dto.valor,
      usuario,
      dto.lineaId,
    );

    this.logger.log(
      `Actualización masiva completada: ${totalActualizados} productos modificados en ${denominacionDestino}`,
    );

    return MessageFrontUtils.createActualizacionPrecioMasiva(
      `${denominacionDestino} (${totalActualizados} productos actualizados)`,
    );
  }

  async actualizarPrecio(id: number, dto: UpdatePrecioDto) {
    this.intrinsicValidationService.validarPrecioNuevo(dto.precio);

    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioId,
    );

    await this.repository.actualizarPrecio(id, dto, usuario);

    return MessageFrontUtils.create('Precio del producto actualizado con éxito');
  }

  async findByRapido(
    codigo: string,
    exacto: boolean,
    skip: number,
    take: number,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.warn(`service`);
    const result = await this.repository.findByRapido(
      codigo,
      exacto,
      skip,
      take,
    );
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }


  async findBy(
    denominacion: string,
    codigoProveedor: string,
    codProveedorExacto: boolean,
    codigoReferencia: string,
    marca_id: number,
    linea_id: number,
    proveedor_id: number,
    conStock: boolean,
    skip: number,
    take: number,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.warn(`service`);
    const result = await this.repository.findBy(
      denominacion,
      codigoProveedor,
      codProveedorExacto,
      codigoReferencia,
      marca_id,
      linea_id,
      proveedor_id,
      conStock,
      skip,
      take,
    );
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }


  async buscarMarcaDesdeProducto(id: number) {
    return this.marcaService.findEntityById(id);
  }

  async buscarLineaDesdeProducto(id: number) {
    return this.lineaService.findEntityById(id);
  }

  async findByIdConAuditoria(id: number) {
    const entity = await this.repository.findByIdConAuditoria(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return AuditoriaMapper.mapProductoToDto(entity);
  }

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    this.logger.log(`b1x`);
    return ProductoMapper.toDto(entity);
  }

  async findHistorialPrecios(skip = 0, take = 100, productoId?: number) {
    const result = await this.repository.findHistorialPrecios(
      skip,
      take,
      productoId,
    );
    return {
      data: result.data.map((historial) =>
        HistorialPrecioMapper.toDto(historial),
      ),
      total: PaginacionUtils.totalItems(result.total),
    };
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
    const entity = await this.findEntityById(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }
    

    ensureNotSistemaEntity(entity, 'Producto');

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }

    await this.repository.remove(entity, usuario);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'eliminada',
    );
  }


  async findAllForLineas(denominacion: string) {
    return this.lineaService.findAllFor(denominacion);
  }

  async findAllForMarcas(denominacion: string) {
    return this.marcaService.findAllFor(denominacion);
  }

  async findAllForPresentaciones(denominacion: string) {
    return this.presentacionService.findAllFor(denominacion);
  }
  
  async obtenerSugerencias(texto: string, take: number) {
    this.logger.log(
      `  Sugerencias para "${texto}"  take=${take}`,
    );
    return this.repository.obtenerSugerencias(texto, take);
  }

  async buscarProductosPorTexto(
    texto: string,
    skip: number,
    take: number,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.log(
      `  Buscando productos por texto "${texto}"  skip=${skip}, take=${take}`,
    );
    const result = await this.repository.buscarPorTexto(texto, skip, take);
    return {
      data: result.data.map((producto) =>
        ProductoMapper.toBusquedaDto(producto),
      ),
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async findByDenominacionCodigoProveedorFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.log(
      `  Buscando en srvice producto o ${denominacion}  skip=${skip}, take=${take}`,
    );
    const result =
      await this.repository.findByDenominacionCodigoProveedorFiltered(
        denominacion,
        skip,
        take,
      );
    this.logger.log(result);
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async existsProductosActivosByMarca(marcaId: number): Promise<boolean> {
    return this.repository.existsProductosActivosByMarca(marcaId);
  }
  async existsProductosActivosByLinea(lineaId: number): Promise<boolean> {
    return this.repository.existsProductosActivosByLinea(lineaId);
  }


  async findByIds(ids: number[]): Promise<Producto[]> {
    return this.repository.findByIds(ids);
  }

  async incrementarStock(
    uow: IUnitOfWork,
    productoId: number,
    cantidad: number,
    origen?: string,
  ): Promise<number> {
    return this.ajustarStockInterno(uow, productoId, cantidad, origen);
  }

  async decrementarStock(
    uow: IUnitOfWork,
    productoId: number,
    cantidad: number,
    origen?: string,
  ): Promise<number> {
    return this.ajustarStockInterno(uow, productoId, -cantidad, origen);
  }

  private async ajustarStockInterno(
    uow: IUnitOfWork,
    productoId: number,
    delta: number,
    origen?: string,
  ): Promise<number> {
    const producto = await this.repository.findOne(productoId);
    if (!producto) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    const stockActual = producto.stock ?? 0;
    const nuevoStock = stockActual + delta;

    // Política opcional
    // if (nuevoStock < 0) throw ...

    producto.stock = nuevoStock;
    await this.repository.updateEntity(uow, producto);

    this.logger.log(
      `[StockService] ${origen ?? 'Desconocido'} → ${stockActual} → ${nuevoStock}`,
    );

    return nuevoStock;
  }

  /**
   * Orquesta todas las validaciones necesarias para crear un producto
   * @private
   */
  private async validarYPrepararCreacion(dto: CreateProductoDto) {
    // 1. Validar entidades relacionadas existen (Infrastructure - DB).
    // Se cargan primero porque la denominación automática depende de Marca + Línea + Presentación.
    const { marca, linea, presentacion } =
      await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(
        dto.marcaId,
        dto.lineaId,
        dto.presentacionId,
      );

    // 2. Validar reglas de negocio sobre entidades (Domain)
    this.validationService.validarEntidadesRelacionadas(marca, linea);

    // 3. Denominación: regla de negocio (Domain).
    // Si no viene explícita se autogenera "Marca + Línea + Presentación".
    // Las validaciones siguientes se aplican sobre el valor final resuelto.
    const denominacion = this.denominacionService.resolverDenominacion({
      manual: dto.denominacion,
      marca,
      linea,
      presentacion,
    });
    dto.denominacion = denominacion;

    // 4. Validar datos intrínsecos (Domain - sin DB)
    this.intrinsicValidationService.validarDatosBasicos({
      denominacion,
      marcaId: dto.marcaId,
      lineaId: dto.lineaId,
      alicuotaIva: dto.alicuotaIva,
    });

    // 5. Validar unicidad (Infrastructure - DB)
    await this.uniquenessValidator.validarDenominacionUnica(denominacion);

    if (dto.codigoProveedor) {
      await this.uniquenessValidator.validarCodigoProveedorUnico(
        dto.codigoProveedor,
        0,
      );
    }

    // 6. Validar usuario existe (Infrastructure)
    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioCreatedId,
    );

    return { marca, linea, presentacion, usuario };
  }
  /**
   * Orquesta todas las validaciones necesarias para actualizar un producto
   * @private
   */
  private async validarYPrepararActualizacion(
    id: number,
    dto: UpdateProductoDto,
  ) {
    // Obtener producto actual
    const productoActual = await this.repository.findOne(id);
    if (!productoActual)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );

    if (
      productoActual.lineaId == null ||
      productoActual.marcaId == null
    ) {
      throw new InternalServerErrorException('Producto en estado inválido');
    }

    //  Validar datos intrínsecos
    this.intrinsicValidationService.validarDatosBasicos({
      denominacion: dto.denominacion ?? productoActual.denominacion,
      marcaId: dto.marcaId ?? productoActual.marcaId,
      lineaId: dto.lineaId ?? productoActual.lineaId,
      alicuotaIva: dto.alicuotaIva ?? productoActual.alicuotaIva,

    });

    // Validar unicidad (excluyendo el ID actual)
    if (dto.denominacion) {
      await this.uniquenessValidator.validarDenominacionUnica(
        dto.denominacion,
        id,
      );
    }

    // Validar entidades relacionadas
    const { marca, linea, presentacion } =
      await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(
        dto.marcaId ?? productoActual.marcaId,
        dto.lineaId ?? productoActual.lineaId,
        dto.presentacionId ?? productoActual.presentacionId,
      );

    //  Validar reglas de negocio
    this.validationService.validarEntidadesRelacionadas(marca, linea);

    // 5 Validar usuario
    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioUpdatedId,
    );

    return { marca, linea, presentacion, usuario };
  }


}
