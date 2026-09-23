import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SuperLineaService } from './superlinea.service';
import { ISuperLineaRepository } from '../../domain/interfaces/superlinea.repository.interface';
import { PoliticaEliminacionSuperLinea } from '../../domain/services/politica-eliminacion-superlinea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';
import { SuperLinea } from '../../domain/entities/superlinea.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

describe('SuperLineaService', () => {
  let service: SuperLineaService;
  let repository: jest.Mocked<Partial<ISuperLineaRepository>>;
  let usuarioService: { findOne: jest.Mock };
  let validacionesService: { tieneLineasActivasParaSuperLinea: jest.Mock };

  const superLineaActiva: SuperLinea = {
    id: 1,
    denominacion: 'Aceites',
    observacion: undefined,
    sistema: 0,
    deletedAt: undefined,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    lineas: [],
  } as SuperLinea;

  const superLineaSistema: SuperLinea = {
    ...superLineaActiva,
    sistema: 1,
  } as SuperLinea;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      findByDenominacionFiltered: jest.fn(),
      findByDenominacionWith: jest.fn(),
      findAllFor: jest.fn(),
      findAllListado: jest.fn(),
      findAllSinSistemaFor: jest.fn(),
      findByDenominacion: jest.fn(),
      findByIdConAuditoria: jest.fn(),
      remove: jest.fn(),
    } as jest.Mocked<Partial<ISuperLineaRepository>>;

    usuarioService = { findOne: jest.fn() };
    validacionesService = { tieneLineasActivasParaSuperLinea: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperLineaService,
        {
          provide: 'ISuperLineaRepository',
          useValue: repository,
        },
        {
          provide: UsuarioService,
          useValue: usuarioService,
        },
        {
          provide: PoliticaEliminacionSuperLinea,
          useValue: validacionesService,
        },
      ],
    }).compile();

    service = module.get<SuperLineaService>(SuperLineaService);
  });

  describe('create', () => {
    it('debería crear una SuperLínea con denominación válida (PUA-01)', async () => {
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockResolvedValue(superLineaActiva);

      const dto: CreateSuperLineaDto = {
        denominacion: 'Aceites',
        observacion: 'Aceites comestibles',
        usuarioCreatedId: 1,
      } as CreateSuperLineaDto;

      const result = await service.create(dto);

      expect(repository.findByDenominacionWith).toHaveBeenCalledWith(
        'ACEITES',
      );
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        mensaje: 'SuperLinea creada con éxito con denominacion: Aceites',
      });
    });
  });

  describe('create con denominación duplicada', () => {
    it('debería rechazar una SuperLínea con denominación duplicada (PUA-02)', async () => {
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(
        superLineaActiva,
      );

      const dto: CreateSuperLineaDto = {
        denominacion: 'aceites',
        usuarioCreatedId: 1,
      } as CreateSuperLineaDto;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow(
        'Denominación ya en uso o esta eliminada.',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería editar una SuperLínea con una denominación libre', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(null);
      (repository.update as jest.Mock).mockResolvedValue({
        ...superLineaActiva,
        denominacion: 'Bazar',
      });

      const dto: UpdateSuperLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
      } as UpdateSuperLineaDto;

      const result = await service.update(1, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        mensaje: 'SuperLinea editada con éxito con denominacion: Bazar',
      });
    });

    it('debería rechazar editar un registro de sistema', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaSistema);

      const dto: UpdateSuperLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
      } as UpdateSuperLineaDto;

      await expect(service.update(1, dto)).rejects.toThrow(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('debería rechazar cambiar a una denominación ya en uso', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue({
        ...superLineaActiva,
        id: 5,
      });

      const dto: UpdateSuperLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
      } as UpdateSuperLineaDto;

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findByDenominacionFiltered', () => {
    it('debería retornar resultados paginados', async () => {
      (repository.findByDenominacionFiltered as jest.Mock).mockResolvedValue({
        data: [superLineaActiva],
        total: 1,
      });

      const result = await service.findByDenominacionFiltered(
        'ace',
        0,
        10,
        false,
      );

      expect(
        repository.findByDenominacionFiltered,
      ).toHaveBeenCalledWith('ace', 0, 10, false);
      expect(result).toEqual({
        data: [expect.objectContaining({ id: 1, denominacion: 'Aceites' })],
        total: 1,
      });
    });

    it('debería usar parámetros por defecto', async () => {
      (repository.findByDenominacionFiltered as jest.Mock).mockResolvedValue({
        data: [],
        total: 0,
      });

      const result = await service.findByDenominacionFiltered('ace');

      expect(
        repository.findByDenominacionFiltered,
      ).toHaveBeenCalledWith('ace', 0, 10, false);
      expect(result.total).toBe(0);
    });
  });

  describe('findAllFor', () => {
    it('debería retornar todas las que coinciden', async () => {
      (repository.findAllFor as jest.Mock).mockResolvedValue([
        superLineaActiva,
      ]);

      const result = await service.findAllFor('ac');

      expect(result).toEqual({
        data: [expect.objectContaining({ id: 1 })],
        total: 1,
      });
    });
  });

  describe('findDtoById', () => {
    it('debería retornar el DTO de una SuperLínea existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);

      const result = await service.findDtoById(1);

      expect(result).toEqual(
        expect.objectContaining({ id: 1, denominacion: 'Aceites' }),
      );
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findDtoById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findEntityById', () => {
    it('debería retornar la entidad existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);

      const result = await service.findEntityById(1);

      expect(result).toEqual(superLineaActiva);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findEntityById(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdConAuditoria', () => {
    it('debería retornar la auditoría', async () => {
      const auditoria: AuditoriaDto = {
        id: 1,
        detalle: 'super línea Aceites',
        createdAt: '2026-01-01 00:00:00',
        updatedAt: '',
        deletedAt: '',
        usuarioCreated: 'admin',
        usuarioUpdated: '',
        usuarioDeleted: '',
      };
      (repository.findByIdConAuditoria as jest.Mock).mockResolvedValue(
        auditoria,
      );

      const result = await service.findByIdConAuditoria(1);

      expect(result).toEqual(auditoria);
    });

    it('debería lanzar NotFoundException si no hay auditoría', async () => {
      (repository.findByIdConAuditoria as jest.Mock).mockResolvedValue(null);

      await expect(service.findByIdConAuditoria(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllListado', () => {
    it('debería retornar el listado', async () => {
      (repository.findAllListado as jest.Mock).mockResolvedValue([
        superLineaActiva,
      ]);

      const result = await service.findAllListado();

      expect(result).toEqual([superLineaActiva]);
    });
  });

  describe('remove', () => {
    it('debería eliminar lógicamente sin líneas activas (PUA-04)', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);
      validacionesService.tieneLineasActivasParaSuperLinea.mockResolvedValue(
        false,
      );
      usuarioService.findOne.mockResolvedValue({ id: 1, denominacion: 'admin' });

      const result = await service.remove(1, 1);

      expect(validacionesService.tieneLineasActivasParaSuperLinea).toHaveBeenCalledWith(
        1,
      );
      expect(repository.remove).toHaveBeenCalledWith(
        superLineaActiva,
        expect.objectContaining({ id: 1 }),
      );
      expect(result).toEqual({
        mensaje: 'SuperLinea eliminada con éxito con denominacion: Aceites',
      });
    });

    it('debería rechazar la eliminación con líneas activas (PUA-03)', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);
      validacionesService.tieneLineasActivasParaSuperLinea.mockResolvedValue(
        true,
      );

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
      await expect(service.remove(1, 1)).rejects.toThrow(
        'No se puede eliminar la super línea porque está asociada a líneas activas.',
      );
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la SuperLínea no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaActiva);
      validacionesService.tieneLineasActivasParaSuperLinea.mockResolvedValue(
        false,
      );
      usuarioService.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 99)).rejects.toThrow(NotFoundException);
    });

    it('debería rechazar eliminar un registro de sistema', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(superLineaSistema);

      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});