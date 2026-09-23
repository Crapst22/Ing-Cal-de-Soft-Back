import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { PresentacionController } from './presentacion.controller';
import { PresentacionService } from '../services/presentacion.service';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';

describe('PresentacionController', () => {
  let controller: PresentacionController;
  let service: PresentacionService;

  const mockService = {
    create: jest.fn(),
    findAllFor: jest.fn(),
    findBy: jest.fn(),
    findDtoById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByIdConAuditoria: jest.fn(),
  };

  const rolesPorRuta = {
    create: ['Root', 'Administrador', 'Empleado'],
    findAllPresentacionesFor: [
      'Root',
      'Administrador',
      'Empleado',
      'Repartidor',
      'Repositor',
      'Vendedor',
    ],
    findByDenominacionFiltered: [
      'Root',
      'Administrador',
      'Empleado',
      'Vendedor',
      'Repartidor',
      'Repositor',
    ],
    findOne: ['Root', 'Administrador', 'Empleado'],
    update: ['Root', 'Administrador', 'Empleado'],
    remove: ['Root', 'Administrador', 'Empleado'],
    findByIdConAuditoria: ['Root', 'Administrador', 'Empleado'],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentacionController],
      providers: [{ provide: PresentacionService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PresentacionController>(PresentacionController);
    service = module.get<PresentacionService>(PresentacionService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delega en el servicio con el DTO recibido', async () => {
      const dto = {
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioCreatedId: 1,
      } as any;
      mockService.create.mockResolvedValue({ mensaje: 'Presentación creada' });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ mensaje: 'Presentación creada' });
    });

    it('propaga errores del servicio', async () => {
      mockService.create.mockRejectedValue(new Error('Error de persistencia'));

      await expect(controller.create({} as any)).rejects.toThrow(
        'Error de persistencia',
      );
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.create);
      expect(roles).toEqual(rolesPorRuta.create);
    });
  });

  describe('findAllPresentacionesFor', () => {
    it('llama al servicio con la denominación recibida', async () => {
      mockService.findAllFor.mockResolvedValue({ data: [], total: 0 });

      await controller.findAllPresentacionesFor({ denominacion: 'pack' } as any);

      expect(service.findAllFor).toHaveBeenCalledWith('pack');
    });

    it('usa denominación vacía por defecto', async () => {
      mockService.findAllFor.mockResolvedValue({ data: [], total: 0 });

      await controller.findAllPresentacionesFor({} as any);

      expect(service.findAllFor).toHaveBeenCalledWith('');
    });

    it('usa el pipe de normalización de denominación', () => {
      const metadata = Reflect.getMetadata(
        '__pipes__',
        controller.findAllPresentacionesFor,
      );
      expect(metadata).toContain(NormalizeDenominacionSearchPipe);
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.findAllPresentacionesFor);
      expect(roles).toEqual(rolesPorRuta.findAllPresentacionesFor);
    });
  });

  describe('findByDenominacionFiltered', () => {
    it('delega con denominación, skip, take e incluirEliminados', async () => {
      mockService.findBy.mockResolvedValue({ data: [], total: 10 });

      await controller.findByDenominacionFiltered({
        denominacion: 'pack',
        skip: 2,
        take: 5,
        incluirEliminados: true,
      } as any);

      expect(service.findBy).toHaveBeenCalledWith('pack', 2, 5, true);
    });

    it('usa defaults cuando faltan parámetros de paginación', async () => {
      mockService.findBy.mockResolvedValue({ data: [], total: 10 });

      await controller.findByDenominacionFiltered({} as any);

      expect(service.findBy).toHaveBeenCalledWith('', undefined, undefined, undefined);
    });

    it('usa el pipe de normalización de denominación', () => {
      const metadata = Reflect.getMetadata(
        '__pipes__',
        controller.findByDenominacionFiltered,
      );
      expect(metadata).toContain(NormalizeDenominacionSearchPipe);
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata(
        'roles',
        controller.findByDenominacionFiltered,
      );
      expect(roles).toEqual(rolesPorRuta.findByDenominacionFiltered);
    });
  });

  describe('findOne', () => {
    it('delega en findDtoById', async () => {
      mockService.findDtoById.mockResolvedValue({ id: 1, denominacion: '1l' });

      const result = await controller.findOne(1);

      expect(service.findDtoById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, denominacion: '1l' });
    });

    it('propaga errores del servicio', async () => {
      mockService.findDtoById.mockRejectedValue(new Error('no encontrado'));

      await expect(controller.findOne(99)).rejects.toThrow('no encontrado');
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.findOne);
      expect(roles).toEqual(rolesPorRuta.findOne);
    });
  });

  describe('update', () => {
    it('delega en el servicio con id y DTO', async () => {
      const dto = { volumen: 1000, usuarioUpdatedId: 1 } as any;
      mockService.update.mockResolvedValue({ mensaje: 'Presentación editada' });

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ mensaje: 'Presentación editada' });
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.update);
      expect(roles).toEqual(rolesPorRuta.update);
    });
  });

  describe('remove', () => {
    it('delega en el servicio con id y usuarioId', async () => {
      mockService.remove.mockResolvedValue({ mensaje: 'Presentación eliminada' });

      const result = await controller.remove(1, 7);

      expect(service.remove).toHaveBeenCalledWith(1, 7);
      expect(result).toEqual({ mensaje: 'Presentación eliminada' });
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.remove);
      expect(roles).toEqual(rolesPorRuta.remove);
    });
  });

  describe('findByIdConAuditoria', () => {
    it('delega en el servicio y devuelve la auditoría', async () => {
      mockService.findByIdConAuditoria.mockResolvedValue({
        id: 1,
        detalle: 'Presentación 1l',
      });

      const result = await controller.findByIdConAuditoria(1);

      expect(service.findByIdConAuditoria).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, detalle: 'Presentación 1l' });
    });

    it('está protegida con los roles correctos', () => {
      const roles = Reflect.getMetadata('roles', controller.findByIdConAuditoria);
      expect(roles).toEqual(rolesPorRuta.findByIdConAuditoria);
    });
  });
});