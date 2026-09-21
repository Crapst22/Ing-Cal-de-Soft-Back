import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoIntrinsicValidationService } from '../../domain/services/producto-intrinsic-validation.service';
import { ProductoValidationService } from '../../domain/services/producto-validation.service';
import { ProductoDenominacionService } from '../../domain/services/producto-denominacion.service';
import { ProductoRelatedEntitiesValidator } from '../../infraestructure/validators/producto-related-entities.validator';
import { ProductoUniquenessValidator } from '../../infraestructure/validators/producto-uniqueness.validator';
import { UsuarioValidator } from 'src/modules/common/utils/validation/usuario-validator';
import { ProductoDeletePolicy } from '../policies/producto-delete.policy';
import { PresentacionService } from '../../../presentacion/application/services/presentacion.service';
import { LineaService } from '../../../linea/application/services/linea.service';
import { MarcaService } from '../../../marca/application/services/marca.service';
import { ProveedorService } from 'src/modules/organizacion/proveedor/application/services/proveedor.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';

describe('ProductoService', () => {
  let service: ProductoService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByIds: jest.fn(),
    findByRapido: jest.fn(),
    findBy: jest.fn(),
    findByDenominacionCodigoProveedorFiltered: jest.fn(),
    existsProductosActivosByMarca: jest.fn(),
    existsProductosActivosByLinea: jest.fn(),
    remove: jest.fn(),
    findByIdConAuditoria: jest.fn(),
    existsByDenominacion: jest.fn(),
    updateEntity: jest.fn(),
  };
  const mockLineaService = { findAllFor: jest.fn(), findEntityById: jest.fn() };
  const mockMarcaService = { findAllFor: jest.fn(), findEntityById: jest.fn() };
  const mockProveedorService = {};
  const mockUsuarioService = { findOne: jest.fn() };
  const mockIntrinsicValidationService = { validarDatosBasicos: jest.fn() };
  const mockValidationService = { validarEntidadesRelacionadas: jest.fn() };
  const mockDenominacionService = {
    resolverDenominacion: jest.fn(),
    generarDenominacion: jest.fn(),
  };
  const mockRelatedEntitiesValidator = {
    validarYObtenerEntidadesRelacionadas: jest.fn(),
  };
  const mockUniquenessValidator = {
    validarDenominacionUnica: jest.fn(),
    validarCodigoProveedorUnico: jest.fn(),
  };
  const mockUsuarioValidator = { validarUsuarioExiste: jest.fn() };
  const mockProductoDeletePolicy = {};
  const mockPresentacionService = { findAllFor: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDenominacionService.resolverDenominacion.mockImplementation(
      ({ manual, marca, linea, presentacion }) =>
        manual || `${marca.denominacion.toLowerCase()} ${linea.denominacion.toLowerCase()}${presentacion ? ' pack' : ''}`,
    );
    mockRelatedEntitiesValidator.validarYObtenerEntidadesRelacionadas.mockResolvedValue({
      marca: { id: 1, denominacion: 'MarcaX' },
      linea: { id: 1, denominacion: 'LineaY' },
      presentacion: null,
    });
    mockUsuarioValidator.validarUsuarioExiste.mockResolvedValue({ id: 1 });
    mockRepository.create.mockResolvedValue({
      id: 1,
      denominacion: 'marcax lineay',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        { provide: 'IProductoRepository', useValue: mockRepository },
        { provide: LineaService, useValue: mockLineaService },
        { provide: MarcaService, useValue: mockMarcaService },
        { provide: ProveedorService, useValue: mockProveedorService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        {
          provide: ProductoIntrinsicValidationService,
          useValue: mockIntrinsicValidationService,
        },
        {
          provide: ProductoValidationService,
          useValue: mockValidationService,
        },
        {
          provide: ProductoDenominacionService,
          useValue: mockDenominacionService,
        },
        {
          provide: ProductoRelatedEntitiesValidator,
          useValue: mockRelatedEntitiesValidator,
        },
        {
          provide: ProductoUniquenessValidator,
          useValue: mockUniquenessValidator,
        },
        { provide: UsuarioValidator, useValue: mockUsuarioValidator },
        { provide: ProductoDeletePolicy, useValue: mockProductoDeletePolicy },
        { provide: PresentacionService, useValue: mockPresentacionService },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('autogenera la denominación cuando no viene explícita', async () => {
      const dto: any = {
        denominacion: undefined,
        marcaId: 1,
        lineaId: 1,
        alicuotaIva: 1,
        codigoProveedor: '123',
        usuarioCreatedId: 1,
      };

      await service.create(dto);

      expect(mockDenominacionService.resolverDenominacion).toHaveBeenCalledTimes(1);
      expect(mockDenominacionService.resolverDenominacion).toHaveBeenCalledWith(
        expect.objectContaining({
          manual: undefined,
          marca: expect.any(Object),
          linea: expect.any(Object),
          presentacion: null,
        }),
      );
      expect(dto.denominacion).toBe('marcax lineay');
      expect(mockIntrinsicValidationService.validarDatosBasicos).toHaveBeenCalledWith(
        expect.objectContaining({ denominacion: 'marcax lineay' }),
      );
      expect(
        mockUniquenessValidator.validarDenominacionUnica,
      ).toHaveBeenCalledWith('marcax lineay');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('respeta la denominación manual enviada por el cliente', async () => {
      mockDenominacionService.resolverDenominacion.mockImplementation(
        ({ manual }) => manual,
      );
      mockRepository.create.mockResolvedValue({
        id: 2,
        denominacion: 'Aceite de girasol 1l',
      });

      const dto: any = {
        denominacion: 'Aceite de girasol 1l',
        marcaId: 1,
        lineaId: 1,
        alicuotaIva: 1,
        usuarioCreatedId: 1,
      };

      await service.create(dto);

      expect(
        mockUniquenessValidator.validarDenominacionUnica,
      ).toHaveBeenCalledWith('Aceite de girasol 1l');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForPresentaciones', () => {
    it('delega en PresentacionService y conserva la denominación ya mapeada', async () => {
      mockPresentacionService.findAllFor.mockResolvedValue({
        data: [
          { id: 1, denominacion: 'Pack x6 de 500ml' },
          { id: 2, denominacion: '1l' },
        ],
        total: 2,
      });

      const result = await service.findAllForPresentaciones('pack');

      expect(mockPresentacionService.findAllFor).toHaveBeenCalledWith('pack');
      expect(result).toEqual({
        data: [
          { id: 1, denominacion: 'Pack x6 de 500ml' },
          { id: 2, denominacion: '1l' },
        ],
        total: 2,
      });
    });
  });

  describe('update', () => {
    it('actualiza un producto existente', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'producto viejo',
        lineaId: 1,
        marcaId: 1,
        alicuotaIva: 21,
        presentacionId: null,
      });
      mockRepository.update.mockResolvedValue({
        id: 1,
        denominacion: 'Aceite nuevo',
      });

      const dto: any = {
        denominacion: 'Aceite nuevo',
        marcaId: 1,
        lineaId: 1,
        usuarioUpdatedId: 1,
      };

      const result = await service.update(1, dto);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        mensaje: 'Producto editada con éxito con denominacion: Aceite nuevo',
      });
    });

    it('lanza NotFound si el producto no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(99, { usuarioUpdatedId: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza InternalServerError si el producto está en estado inválido', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'x',
        lineaId: null,
        marcaId: 1,
      });

      await expect(
        service.update(1, { usuarioUpdatedId: 1 } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findDtoById / findEntityById', () => {
    it('mapea a DTO cuando existe', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'producto',
        linea: { id: 1, denominacion: 'Aceites' },
        marca: { id: 1, denominacion: 'Caroyense' },
        presentacion: null,
      });

      const dto = await service.findDtoById(1);

      expect(dto.id).toBe(1);
      expect(dto.denominacion).toBe('producto');
    });

    it('lanza NotFound si no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findDtoById(1)).rejects.toThrow(NotFoundException);
      await expect(service.findEntityById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('búsquedas', () => {
    const productoMinimo = {
      id: 1,
      denominacion: 'x',
      codigoProveedor: 'P',
      stock: 1,
    };

    it('mapea findByRapido', async () => {
      mockRepository.findByRapido.mockResolvedValue({
        data: [productoMinimo],
        total: 1,
      });

      const result = await service.findByRapido('x', false, 0, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('mapea findBy', async () => {
      mockRepository.findBy.mockResolvedValue({
        data: [productoMinimo],
        total: 5,
      });

      const result = await service.findBy(
        'x',
        '',
        false,
        '',
        0,
        0,
        0,
        false,
        0,
        10,
      );

      expect(result.total).toBe(5);
    });

    it('mapea findByDenominacionCodigoProveedorFiltered', async () => {
      mockRepository.findByDenominacionCodigoProveedorFiltered.mockResolvedValue({
        data: [productoMinimo],
        total: 1,
      });

      const result = await service.findByDenominacionCodigoProveedorFiltered('x');

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('remove', () => {
    it('no permite eliminar productos del sistema', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'x',
        sistema: 1,
      });

      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFound si el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'x',
        sistema: 0,
      });
      mockUsuarioService.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('elimina y devuelve el mensaje', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        denominacion: 'Aceite',
        sistema: 0,
      });
      mockUsuarioService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.remove.mockResolvedValue({ id: 1 });

      const result = await service.remove(1, 1);

      expect(mockRepository.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        mensaje: 'Producto eliminada con éxito con denominacion: Aceite',
      });
    });
  });

  describe('delegaciones y stock', () => {
    it('busca marca y línea desde el producto', async () => {
      mockMarcaService.findEntityById.mockResolvedValue({ id: 1 });
      mockLineaService.findEntityById.mockResolvedValue({ id: 2 });

      expect(await service.buscarMarcaDesdeProducto(1)).toEqual({ id: 1 });
      expect(await service.buscarLineaDesdeProducto(2)).toEqual({ id: 2 });
    });

    it('delega findAllForMarcas y findAllForLineas', async () => {
      mockMarcaService.findAllFor.mockResolvedValue([]);
      mockLineaService.findAllFor.mockResolvedValue([]);

      await service.findAllForMarcas('m');
      await service.findAllForLineas('l');

      expect(mockMarcaService.findAllFor).toHaveBeenCalledWith('m');
      expect(mockLineaService.findAllFor).toHaveBeenCalledWith('l');
    });

    it('delega existsProductosActivos y findByIds', async () => {
      mockRepository.existsProductosActivosByMarca.mockResolvedValue(true);
      mockRepository.existsProductosActivosByLinea.mockResolvedValue(false);
      mockRepository.findByIds.mockResolvedValue([{ id: 1 }]);

      expect(await service.existsProductosActivosByMarca(1)).toBe(true);
      expect(await service.existsProductosActivosByLinea(1)).toBe(false);
      expect(await service.findByIds([1])).toEqual([{ id: 1 }]);
    });

    it('incrementa y decrementa stock', async () => {
      mockRepository.findOne.mockImplementation(() => ({ id: 1, stock: 5 }));
      mockRepository.updateEntity.mockResolvedValue({});

      expect(await service.incrementarStock({} as any, 1, 3)).toBe(8);
      expect(await service.decrementarStock({} as any, 1, 2)).toBe(3);
    });

    it('lanza error al ajustar stock de un producto inexistente', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.incrementarStock({} as any, 1, 3)).rejects.toThrow(
        'no encontrado',
      );
    });

    it('lanza NotFound en findByIdConAuditoria si no existe', async () => {
      mockRepository.findByIdConAuditoria.mockResolvedValue(null);

      await expect(service.findByIdConAuditoria(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});