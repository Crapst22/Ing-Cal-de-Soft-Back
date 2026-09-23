import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { SuperLineaController } from './superlinea.controller';
import { SuperLineaService } from '../services/superlinea.service';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';

describe('SuperLineaController', () => {
  let controller: SuperLineaController;
  let service: { [key: string]: jest.Mock };

  const serviceMock = {
    create: jest.fn(),
    findByDenominacionFiltered: jest.fn(),
    findDtoById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByIdConAuditoria: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperLineaController],
      providers: [
        { provide: SuperLineaService, useValue: serviceMock },
        { provide: AuthGuard, useValue: { canActivate: async () => true } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: async () => true })
      .compile();

    controller = module.get<SuperLineaController>(SuperLineaController);
    service = module.get(SuperLineaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería delegar la creación al servicio', () => {
      const dto: CreateSuperLineaDto = {
        denominacion: 'Aceites',
        usuarioCreatedId: 1,
      } as CreateSuperLineaDto;

      service.create.mockReturnValue({ mensaje: 'SuperLinea creada' });

      const result = controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ mensaje: 'SuperLinea creada' });
    });
  });

  describe('findByDenominacionFiltered', () => {
    it('debería delegar la búsqueda con los parámetros del query', () => {
      const query: PaginationWithDenominacionDto = {
        denominacion: 'ace',
        skip: 0,
        take: 10,
        incluirEliminados: false,
      } as PaginationWithDenominacionDto;

      service.findByDenominacionFiltered.mockReturnValue({
        data: [],
        total: 0,
      });

      const result = controller.findByDenominacionFiltered(query);

      expect(service.findByDenominacionFiltered).toHaveBeenCalledWith(
        'ace',
        0,
        10,
        false,
      );
      expect(result).toEqual({ data: [], total: 0 });
    });

    it('debería usar cadena vacía si no se envía denominación', () => {
      controller.findByDenominacionFiltered({} as PaginationWithDenominacionDto);

      expect(service.findByDenominacionFiltered).toHaveBeenCalledWith(
        '',
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('debería delegar la consulta por id', () => {
      service.findDtoById.mockReturnValue({ id: 1, denominacion: 'Aceites' });

      const result = controller.findOne(1);

      expect(service.findDtoById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, denominacion: 'Aceites' });
    });
  });

  describe('update', () => {
    it('debería delegar la edición al servicio', () => {
      const dto: UpdateSuperLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
      } as UpdateSuperLineaDto;

      service.update.mockReturnValue({ mensaje: 'SuperLinea editada' });

      const result = controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ mensaje: 'SuperLinea editada' });
    });
  });

  describe('remove', () => {
    it('debería delegar la eliminación al servicio', () => {
      service.remove.mockReturnValue({ mensaje: 'SuperLinea eliminada' });

      const result = controller.remove(1, 1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ mensaje: 'SuperLinea eliminada' });
    });
  });

  describe('findByIdConAuditoria', () => {
    it('debería delegar la consulta de auditoría', async () => {
      service.findByIdConAuditoria.mockReturnValue({
        id: 1,
        detalle: 'super línea Aceites',
      });

      const result = await controller.findByIdConAuditoria(1);

      expect(service.findByIdConAuditoria).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, detalle: 'super línea Aceites' });
    });
  });
});