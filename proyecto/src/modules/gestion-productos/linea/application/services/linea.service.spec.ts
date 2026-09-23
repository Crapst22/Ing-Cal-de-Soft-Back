import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LineaService } from './linea.service';
import { PoliticaEliminacionLinea } from '../../domain/services/politica-eliminacion-linea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { SuperLineaService } from '../../../superlinea/application/services/superlinea.service';
import { ILineaRepository } from '../../domain/interfaces/linea.repository.interface';
import { CreateLineaDto } from '../../dto/create-linea.dto';
import { UpdateLineaDto } from '../../dto/update-linea.dto';
import { Linea } from '../../domain/entities/linea.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

describe('LineaService', () => {
  let service: LineaService;
  let repository: jest.Mocked<Partial<ILineaRepository>>;
  let validacionesService: { tieneProductosActivosParaLinea: jest.Mock };
  let usuarioService: { findOne: jest.Mock };
  let superLineaService: { findDtoById: jest.Mock };

  const lineaActiva: Linea = {
    id: 1,
    denominacion: 'Aceites',
    observacion: undefined,
    sistema: 0,
    deletedAt: undefined,
    superLineaId: undefined,
    utilizaStockMinimo: false,
    stockMinimo: 0,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    productos: [],
  } as Linea;

  const lineaSistema: Linea = {
    ...lineaActiva,
    sistema: 1,
  } as Linea;

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
      existsLineasActivasBySuperLinea: jest.fn(),
      remove: jest.fn(),
    } as jest.Mocked<Partial<ILineaRepository>>;

    validacionesService = { tieneProductosActivosParaLinea: jest.fn() };
    usuarioService = { findOne: jest.fn() };
    superLineaService = { findDtoById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineaService,
        {
          provide: 'ILineaRepository',
          useValue: repository,
        },
        {
          provide: PoliticaEliminacionLinea,
          useValue: validacionesService,
        },
        {
          provide: UsuarioService,
          useValue: usuarioService,
        },
        {
          provide: SuperLineaService,
          useValue: superLineaService,
        },
      ],
    }).compile();

    service = module.get<LineaService>(LineaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una Línea con superlínea válida', async () => {
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(null);
      superLineaService.findDtoById.mockResolvedValue({ id: 3 });
      (repository.create as jest.Mock).mockResolvedValue({
        ...lineaActiva,
        superLineaId: 3,
      });

      const dto: CreateLineaDto = {
        denominacion: 'Aceites',
        superLineaId: 3,
        utilizaStockMinimo: false,
        usuarioCreatedId: 1,
      } as CreateLineaDto;

      const result = await service.create(dto);

      expect(superLineaService.findDtoById).toHaveBeenCalledWith(3);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        mensaje: 'Linea creada con éxito con denominacion: Aceites',
      });
    });

    it('debería rechazar una Línea con denominación duplicada', async () => {
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(
        lineaActiva,
      );

      const dto: CreateLineaDto = {
        denominacion: 'Aceites',
        utilizaStockMinimo: false,
        usuarioCreatedId: 1,
      } as CreateLineaDto;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('debería rechazar una Línea asociada a una SuperLínea inexistente (PUA-05)', async () => {
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(null);
      superLineaService.findDtoById.mockRejectedValue(
        new NotFoundException('SuperLinea con ID 99999 no encontrado.'),
      );

      const dto: CreateLineaDto = {
        denominacion: 'Aceites',
        superLineaId: 99999,
        utilizaStockMinimo: false,
        usuarioCreatedId: 1,
      } as CreateLineaDto;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería editar una Línea y validar la superlínea', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue(null);
      superLineaService.findDtoById.mockResolvedValue({ id: 3 });
      (repository.update as jest.Mock).mockResolvedValue({
        ...lineaActiva,
        superLineaId: 3,
      });

      const dto: UpdateLineaDto = {
        superLineaId: 3,
        usuarioUpdatedId: 2,
        utilizaStockMinimo: false,
      } as UpdateLineaDto;

      const result = await service.update(1, dto);

      expect(superLineaService.findDtoById).toHaveBeenCalledWith(3);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        mensaje: 'Linea editada con éxito con denominacion: Aceites',
      });
    });

    it('debería rechazar cambiar a una denominación ya en uso', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      (repository.findByDenominacionWith as jest.Mock).mockResolvedValue({
        ...lineaActiva,
        id: 5,
      });

      const dto: UpdateLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
        utilizaStockMinimo: false,
      } as UpdateLineaDto;

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('debería rechazar editar un registro de sistema', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaSistema);

      const dto: UpdateLineaDto = {
        denominacion: 'Bazar',
        usuarioUpdatedId: 2,
        utilizaStockMinimo: false,
      } as UpdateLineaDto;

      await expect(service.update(1, dto)).rejects.toThrow(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('debería rechazar asociar una SuperLínea inexistente al editar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      superLineaService.findDtoById.mockRejectedValue(
        new NotFoundException('SuperLinea con ID 99999 no encontrado.'),
      );

      const dto: UpdateLineaDto = {
        superLineaId: 99999,
        usuarioUpdatedId: 2,
        utilizaStockMinimo: false,
      } as UpdateLineaDto;

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findByDenominacionFiltered', () => {
    it('debería retornar resultados paginados', async () => {
      (repository.findByDenominacionFiltered as jest.Mock).mockResolvedValue({
        data: [lineaActiva],
        total: 1,
      });

      const result = await service.findByDenominacionFiltered(
        'ace',
        0,
        10,
        false,
      );

      expect(repository.findByDenominacionFiltered).toHaveBeenCalledWith(
        'ace',
        0,
        10,
        false,
      );
      expect(result).toEqual({
        data: [expect.objectContaining({ id: 1, denominacion: 'Aceites' })],
        total: 1,
      });
    });
  });

  describe('findAllFor', () => {
    it('debería retornar las líneas que coinciden', async () => {
      (repository.findAllFor as jest.Mock).mockResolvedValue([lineaActiva]);

      const result = await service.findAllFor('ac');

      expect(result).toEqual({
        data: [expect.objectContaining({ id: 1 })],
        total: 1,
      });
    });
  });

  describe('findByIdConAuditoria', () => {
    it('debería retornar la auditoría', async () => {
      const auditoria: AuditoriaDto = {
        id: 1,
        detalle: 'línea Aceites',
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

  describe('findDtoById', () => {
    it('debería retornar el DTO de una línea existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);

      const result = await service.findDtoById(1);

      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findDtoById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findEntityById', () => {
    it('debería retornar la entidad existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);

      const result = await service.findEntityById(1);

      expect(result).toEqual(lineaActiva);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findEntityById(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllListado', () => {
    it('debería retornar el listado', async () => {
      (repository.findAllListado as jest.Mock).mockResolvedValue([lineaActiva]);

      const result = await service.findAllListado();

      expect(result).toEqual([lineaActiva]);
    });
  });

  describe('remove', () => {
    it('debería eliminar una Línea sin productos activos', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      usuarioService.findOne.mockResolvedValue({ id: 1 });
      validacionesService.tieneProductosActivosParaLinea.mockResolvedValue(
        false,
      );

      const result = await service.remove(1, 1);

      expect(validacionesService.tieneProductosActivosParaLinea).toHaveBeenCalledWith(
        1,
      );
      expect(repository.remove).toHaveBeenCalledWith(
        lineaActiva,
        expect.objectContaining({ id: 1 }),
      );
      expect(result).toEqual({
        mensaje: 'Linea eliminada con éxito con denominacion: Aceites',
      });
    });

    it('debería rechazar la eliminación con productos activos', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      usuarioService.findOne.mockResolvedValue({ id: 1 });
      validacionesService.tieneProductosActivosParaLinea.mockResolvedValue(true);

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la Línea no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaActiva);
      usuarioService.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 99)).rejects.toThrow(NotFoundException);
    });

    it('debería rechazar eliminar un registro de sistema', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(lineaSistema);

      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});