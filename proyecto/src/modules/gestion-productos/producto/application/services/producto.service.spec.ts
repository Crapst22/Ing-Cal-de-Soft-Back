import { Test, TestingModule } from '@nestjs/testing';
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
});