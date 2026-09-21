import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PresentacionService } from './presentacion.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { PoliticaEliminacionPresentacion } from '../../domain/services/politica-eliminacion-presentacion.service';

describe('PresentacionService', () => {
  let service: PresentacionService;

  const mockRepository = {
    create: jest.fn(),
    findBy: jest.fn(),
    findAllFor: jest.fn(),
    findAllListado: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByIdConAuditoria: jest.fn(),
  };
  const mockUsuarioService = { findOne: jest.fn() };
  const mockValidacionesService = {
    tieneProductosActivosParaPresentacion: jest.fn(),
  };

  const entidadPack = {
    id: 1,
    tipo: 'pack',
    quantity: 6,
    volumen: 500,
    unidad: 'ml',
    sistema: 0,
    deletedAt: null,
  } as any;

  const entidadVolumen = {
    id: 2,
    tipo: 'volume',
    quantity: null,
    volumen: 1,
    unidad: 'l',
    sistema: 0,
    deletedAt: null,
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentacionService,
        { provide: 'IPresentacionRepository', useValue: mockRepository },
        { provide: UsuarioService, useValue: mockUsuarioService },
        {
          provide: PoliticaEliminacionPresentacion,
          useValue: mockValidacionesService,
        },
      ],
    }).compile();

    service = module.get<PresentacionService>(PresentacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea una presentación pack devolviendo el mensaje con su denominación automática', async () => {
      mockRepository.create.mockResolvedValue(entidadPack);

      const result = await service.create({
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioCreatedId: 1,
      } as any);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        mensaje: 'Presentación creada con éxito con denominacion: Pack x6 de 500ml',
      });
    });

    it('rechaza un tipo volumen sin volumen', async () => {
      await expect(
        service.create({ tipo: 'volume', usuarioCreatedId: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza un tipo volumen sin unidad', async () => {
      await expect(
        service.create({ tipo: 'volume', volumen: 1, usuarioCreatedId: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza un pack con volumen pero sin unidad', async () => {
      await expect(
        service.create({ tipo: 'pack', volumen: 1, usuarioCreatedId: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('actualiza mezclando campos y recalcula la denominación', async () => {
      mockRepository.findOne.mockResolvedValue(entidadPack);
      mockRepository.update.mockResolvedValue({
        ...entidadPack,
        volumen: 1000,
        unidad: 'ml',
      });

      const result = await service.update(1, {
        volumen: 1000,
        unidad: 'ml',
        usuarioUpdatedId: 1,
      } as any);

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          tipo: 'pack',
          quantity: 6,
          volumen: 1000,
          unidad: 'ml',
        }),
      );
      expect(result).toEqual({
        mensaje: 'Presentación editada con éxito con denominacion: Pack x6 de 1000ml',
      });
    });

    it('lanza NotFound cuando la presentación no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(99, { usuarioUpdatedId: 1 } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('no permite modificar presentaciones del sistema', async () => {
      mockRepository.findOne.mockResolvedValue({ ...entidadPack, sistema: 1 });

      await expect(
        service.update(1, { volumen: 1000, usuarioUpdatedId: 1 } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('valida la consistencia de tipo en update', async () => {
      mockRepository.findOne.mockResolvedValue(entidadVolumen);

      await expect(
        service.update(2, { tipo: 'volume', volumen: null, usuarioUpdatedId: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllFor', () => {
    it('mapea a DTO con denominación calculada', async () => {
      mockRepository.findAllFor.mockResolvedValue([entidadPack, entidadVolumen]);

      const result = await service.findAllFor('pack');

      expect(result.data).toHaveLength(2);
      expect(result.data[0].denominacion).toBe('Pack x6 de 500ml');
      expect(result.data[1].denominacion).toBe('1l');
    });
  });

  describe('findAllListado', () => {
    it('delega en el repositorio', async () => {
      mockRepository.findAllListado.mockResolvedValue([entidadPack]);

      const result = await service.findAllListado();

      expect(result).toEqual([entidadPack]);
    });
  });

  describe('findBy', () => {
    it('mapea a DTO y calcula el total', async () => {
      mockRepository.findBy.mockResolvedValue({ data: [entidadPack], total: 1 });

      const result = await service.findBy('pack');

      expect(mockRepository.findBy).toHaveBeenCalledWith('pack', 0, 10, false);
      expect(result.data[0].denominacion).toBe('Pack x6 de 500ml');
      expect(result.total).toBe(1);
    });
  });

  describe('findDtoById / findEntityById', () => {
    it('encuentra por id y mapea a DTO', async () => {
      mockRepository.findOne.mockResolvedValue(entidadVolumen);

      const dto = await service.findDtoById(2);

      expect(dto.denominacion).toBe('1l');
    });

    it('lanza NotFound cuando no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findEntityById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('lanza NotFound cuando no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });

    it('no permite eliminar presentaciones del sistema', async () => {
      mockRepository.findOne.mockResolvedValue({ ...entidadPack, sistema: 1 });

      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('lanza Conflict si está asociada a productos activos', async () => {
      mockRepository.findOne.mockResolvedValue(entidadPack);
      mockValidacionesService.tieneProductosActivosParaPresentacion.mockResolvedValue(
        true,
      );

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
    });

    it('lanza NotFound si el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue(entidadPack);
      mockValidacionesService.tieneProductosActivosParaPresentacion.mockResolvedValue(
        false,
      );
      mockUsuarioService.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('elimina y devuelve el mensaje con la denominación', async () => {
      mockRepository.findOne.mockResolvedValue(entidadVolumen);
      mockValidacionesService.tieneProductosActivosParaPresentacion.mockResolvedValue(
        false,
      );
      mockUsuarioService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.remove.mockResolvedValue(entidadVolumen);

      const result = await service.remove(2, 1);

      expect(mockRepository.remove).toHaveBeenCalled();
      expect(result).toEqual({
        mensaje: 'Presentación eliminada con éxito con denominacion: 1l',
      });
    });
  });

  describe('findByIdConAuditoria', () => {
    it('lanza NotFound cuando no existe', async () => {
      mockRepository.findByIdConAuditoria.mockResolvedValue(null);

      await expect(service.findByIdConAuditoria(99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devuelve la auditoría', async () => {
      mockRepository.findByIdConAuditoria.mockResolvedValue({
        id: 1,
        detalle: 'Presentación 1l',
      });

      const result = await service.findByIdConAuditoria(1);

      expect(result.detalle).toBe('Presentación 1l');
    });
  });
});