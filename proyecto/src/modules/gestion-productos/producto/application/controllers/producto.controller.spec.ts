import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from '../services/producto.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

describe('ProductoController', () => {
  let controller: ProductoController;

  const mockService = {
    create: jest.fn(),
    findAllForMarcas: jest.fn(),
    findAllForLineas: jest.fn(),
    findAllForPresentaciones: jest.fn(),
    findByRapido: jest.fn(),
    findBy: jest.fn(),
    buscarMarcaDesdeProducto: jest.fn(),
    buscarLineaDesdeProducto: jest.fn(),
    findDtoById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByIdConAuditoria: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        { provide: ProductoService, useValue: mockService },
        { provide: AuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: 'IUsuarioRepository', useValue: {} },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delega en el servicio', async () => {
    mockService.create.mockResolvedValue({ mensaje: 'ok' });

    const dto = { denominacion: 'aceite 1l' } as any;
    await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega en el servicio', async () => {
    mockService.update.mockResolvedValue({ mensaje: 'ok' });

    await controller.update(1, { usuarioUpdatedId: 1 } as any);

    expect(mockService.update).toHaveBeenCalledWith(1, {
      usuarioUpdatedId: 1,
    });
  });

  it('findOne delega en findDtoById', async () => {
    mockService.findDtoById.mockResolvedValue({ id: 1 });

    const result = await controller.findOne(1);

    expect(mockService.findDtoById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('remove delega con id y usuarioId', async () => {
    mockService.remove.mockResolvedValue({ mensaje: 'ok' });

    await controller.remove(1, 7);

    expect(mockService.remove).toHaveBeenCalledWith(1, 7);
  });

  it('findByIdConAuditoria delega en el servicio', async () => {
    mockService.findByIdConAuditoria.mockResolvedValue({ id: 1 });

    const result = await controller.findByIdConAuditoria(1);

    expect(result).toEqual({ id: 1 });
  });

  it('findAllMarcasFor usa denominación por defecto vacía', async () => {
    mockService.findAllForMarcas.mockResolvedValue([]);

    await controller.findAllMarcasFor({} as any);

    expect(mockService.findAllForMarcas).toHaveBeenCalledWith('');
  });

  it('findAllLineasFor pasa la denominación', async () => {
    mockService.findAllForLineas.mockResolvedValue([]);

    await controller.findAllLineasFor({ denominacion: 'aceite' } as any);

    expect(mockService.findAllForLineas).toHaveBeenCalledWith('aceite');
  });

  it('findAllPresentacionesFor pasa la denominación', async () => {
    mockService.findAllForPresentaciones.mockResolvedValue({ data: [], total: 0 });

    await controller.findAllPresentacionesFor({ denominacion: 'pack' } as any);

    expect(mockService.findAllForPresentaciones).toHaveBeenCalledWith('pack');
  });

  it('searchRapido delega con los parámetros del DTO', async () => {
    mockService.findByRapido.mockResolvedValue({ data: [], total: 0 });

    await controller.searchRapido({
      codigo: 'x',
      exacto: false,
      skip: 0,
      take: 10,
    } as any);

    expect(mockService.findByRapido).toHaveBeenCalledWith('x', false, 0, 10);
  });

  it('search delega con todos los parámetros del DTO', async () => {
    mockService.findBy.mockResolvedValue({ data: [], total: 0 });

    await controller.search({
      denominacion: 'aceite',
      codigoProveedor: '',
      codProveedorExacto: false,
      codigoReferencia: '',
      marcaId: 1,
      lineaId: 2,
      proveedorId: 0,
      conStock: false,
      skip: 0,
      take: 10,
    } as any);

    expect(mockService.findBy).toHaveBeenCalledWith(
      'aceite',
      '',
      false,
      '',
      1,
      2,
      0,
      false,
      0,
      10,
    );
  });

  it('getMarcaDelProducto y geLineaDelProducto delegan', async () => {
    mockService.buscarMarcaDesdeProducto.mockResolvedValue({ id: 1 });
    mockService.buscarLineaDesdeProducto.mockResolvedValue({ id: 2 });

    expect(await controller.getMarcaDelProducto(1)).toEqual({ id: 1 });
    expect(await controller.geLineaDelProducto(2)).toEqual({ id: 2 });
  });
});