import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { LineaController } from './linea.controller';
import { LineaService } from '../services/linea.service';
import { CreateLineaDto } from '../../dto/create-linea.dto';
import { UpdateLineaDto } from '../../dto/update-linea.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';

describe('LineaController', () => {
  let controller: LineaController;
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
      controllers: [LineaController],
      providers: [
        { provide: LineaService, useValue: serviceMock },
        { provide: AuthGuard, useValue: { canActivate: async () => true } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: async () => true })
      .compile();

    controller = module.get<LineaController>(LineaController);
    service = module.get(LineaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería delegar la creación al servicio', () => {
      const dto: CreateLineaDto = {
        denominacion: 'Aceites',
        superLineaId: 3,
        utilizaStockMinimo: false,
        usuarioCreatedId: 1,
      } as CreateLineaDto;

      service.create.mockReturnValue({ mensaje: 'Linea creada' });

      const result = controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ mensaje: 'Linea creada' });
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
      const dto: UpdateLineaDto = {
        denominacion: 'Bazar',
        superLineaId: 4,
        utilizaStockMinimo: false,
        usuarioUpdatedId: 2,
      } as UpdateLineaDto;

      service.update.mockReturnValue({ mensaje: 'Linea editada' });

      const result = controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ mensaje: 'Linea editada' });
    });
  });

  describe('remove', () => {
    it('debería delegar la eliminación al servicio', () => {
      service.remove.mockReturnValue({ mensaje: 'Linea eliminada' });

      const result = controller.remove(1, 1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ mensaje: 'Linea eliminada' });
    });
  });

  describe('findByIdConAuditoria', () => {
    it('debería delegar la consulta de auditoría', async () => {
      service.findByIdConAuditoria.mockReturnValue({ id: 1, detalle: 'línea' });

      const result = await controller.findByIdConAuditoria(1);

      expect(service.findByIdConAuditoria).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, detalle: 'línea' });
    });
  });
});