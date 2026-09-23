import {
  EntityNotFoundException,
} from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { PresentacionPersistenceAdapter } from './presentacion.persistence-adapter';

jest.mock('../../../../common/decorators/transactional.decoratos', () => ({
  Transactional: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
    descriptor,
}));

describe('PresentacionPersistenceAdapter', () => {
  let adapter: PresentacionPersistenceAdapter;
  let mockRepo: any;
  let uowRepo: any;
  let queryBuilder: any;

  const pack = {
    id: 1,
    tipo: 'pack',
    quantity: 6,
    volumen: 500,
    unidad: 'ml',
    sistema: 0,
    deletedAt: null,
    createdAt: new Date('2026-01-01T10:00:00'),
    updatedAt: new Date('2026-01-02T10:00:00'),
  } as any;

  const volume = {
    id: 2,
    tipo: 'volume',
    quantity: null,
    volumen: 2,
    unidad: 'l',
    sistema: 0,
    deletedAt: null,
    createdAt: new Date('2026-01-01T11:00:00'),
    updatedAt: new Date('2026-01-01T11:00:00'),
  } as any;

  beforeEach(() => {
    queryBuilder = {
      withDeleted: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    mockRepo = {
      createQueryBuilder: jest.fn(() => queryBuilder),
      findOne: jest.fn(),
      create: jest.fn((data: any) => ({ ...data })),
      save: jest.fn(async (entity: any) => ({ ...entity, id: 1 })),
    };

    uowRepo = {
      findOne: jest.fn(),
      create: jest.fn((data: any) => ({ ...data })),
      save: jest.fn(async (entity: any) => ({ ...entity, id: 1 })),
    };

    const mockUow = { getRepository: jest.fn(() => uowRepo) };
    const mockDataSource = { manager: {} };

    adapter = new PresentacionPersistenceAdapter(
      mockRepo,
      mockDataSource as any,
      mockUow as any,
    );
  });

  describe('create', () => {
    it('crea la entidad con valores por defecto y el usuario creador', async () => {
      const result = await adapter.create({
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioCreatedId: 7,
      } as any);

      expect(uowRepo.create).toHaveBeenCalledWith({
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioCreatedId: 7,
      });
      expect(result.id).toBe(1);
    });

    it('convierte nulos undefined en null explícito', async () => {
      await adapter.create({
        tipo: 'volume',
        usuarioCreatedId: 7,
      } as any);

      expect(uowRepo.create).toHaveBeenCalledWith({
        tipo: 'volume',
        quantity: null,
        volumen: null,
        unidad: null,
        usuarioCreatedId: 7,
      });
    });

    it('lanza DatabaseConnectionException si falla la persistencia', async () => {
      uowRepo.save.mockRejectedValue(new Error('db caída'));

      await expect(
        adapter.create({ tipo: 'pack', usuarioCreatedId: 7 } as any),
      ).rejects.toThrow(DatabaseConnectionException);
    });
  });

  describe('findBy', () => {
    it('ordena por denominación y pagina sin filtro', async () => {
      queryBuilder.getMany.mockResolvedValue([pack, volume]);

      const result = await adapter.findBy('', 0, 10, false);

      expect(result.data.map((e) => e.id)).toEqual([2, 1]);
      expect(result.total).toBe(2);
    });

    it('filtra por denominación sin distinguir mayúsculas', async () => {
      queryBuilder.getMany.mockResolvedValue([pack, volume]);

      const result = await adapter.findBy('pack', 0, 10, false);

      expect(result.data.map((e) => e.id)).toEqual([1]);
      expect(result.total).toBe(1);
    });

    it('aplica paginación con skip y take', async () => {
      queryBuilder.getMany.mockResolvedValue([pack, volume]);

      const result = await adapter.findBy('', 1, 1, false);

      expect(result.data.map((e) => e.id)).toEqual([1]);
      expect(result.total).toBe(2);
    });

    it('lanza DatabaseConnectionException ante un error', async () => {
      queryBuilder.getMany.mockRejectedValue(new Error('query fallida'));

      await expect(adapter.findBy('', 0, 10, false)).rejects.toThrow(
        DatabaseConnectionException,
      );
    });
  });

  describe('findAllListado', () => {
    it('devuelve las entidades ordenadas por denominación', async () => {
      queryBuilder.getMany.mockResolvedValue([pack, volume]);

      const result = await adapter.findAllListado();

      expect(result.map((e) => e.id)).toEqual([2, 1]);
    });

    it('lanza DatabaseConnectionException ante un error', async () => {
      queryBuilder.getMany.mockRejectedValue(new Error('query fallida'));

      await expect(adapter.findAllListado()).rejects.toThrow(
        DatabaseConnectionException,
      );
    });
  });

  describe('findAllFor', () => {
    it('filtra por denominación y ordena', async () => {
      queryBuilder.getMany.mockResolvedValue([pack, volume]);

      const result = await adapter.findAllFor('pack');

      expect(result.map((e) => e.id)).toEqual([1]);
    });
  });

  describe('findByIdConAuditoria', () => {
    it('arma el detalle de auditoría con la denominación', async () => {
      mockRepo.findOne.mockResolvedValue(volume);

      const result = await adapter.findByIdConAuditoria(2);

      expect(result).toMatchObject({
        id: 2,
        detalle: 'Presentación 2l',
      });
      expect(result?.createdAt).toContain('01/01/2026');
    });

    it('devuelve null cuando la presentación no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await adapter.findByIdConAuditoria(99);

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('busca sin eliminados y devuelve la entidad', async () => {
      mockRepo.findOne.mockResolvedValue(pack);

      const result = await adapter.findOne(1);

      expect(result?.id).toBe(1);
    });

    it('lanza EntityNotFoundException cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(adapter.findOne(99)).rejects.toThrow(EntityNotFoundException);
    });

    it('lanza DatabaseConnectionException ante un error', async () => {
      mockRepo.findOne.mockRejectedValue(new Error('db caída'));

      await expect(adapter.findOne(1)).rejects.toThrow(DatabaseConnectionException);
    });
  });

  describe('update', () => {
    it('actualiza solo los campos recibidos', async () => {
      uowRepo.findOne.mockResolvedValue({ ...pack });

      const result = await adapter.update(1, {
        volumen: 1000,
        usuarioUpdatedId: 9,
      } as any);

      expect(uowRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          tipo: 'pack',
          quantity: 6,
          volumen: 1000,
          unidad: 'ml',
          usuarioUpdatedId: 9,
        }),
      );
      expect(result.id).toBe(1);
    });

    it('lanza EntityNotFoundException si no existe', async () => {
      uowRepo.findOne.mockResolvedValue(null);

      await expect(
        adapter.update(99, { usuarioUpdatedId: 9 } as any),
      ).rejects.toThrow(EntityNotFoundException);
    });
  });

  describe('remove', () => {
    it('marca deletedAt y usuarioDeletedId antes de guardar', async () => {
      const result = await adapter.remove({ ...volume } as Presentacion, {
        id: 5,
      } as any);

      expect(uowRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 2,
          usuarioDeletedId: 5,
          deletedAt: expect.any(Date),
        }),
      );
      expect(result).toBeDefined();
    });

    it('lanza DatabaseConnectionException ante un error', async () => {
      uowRepo.save.mockRejectedValue(new Error('db caída'));

      await expect(
        adapter.remove(volume, { id: 5 } as any),
      ).rejects.toThrow(DatabaseConnectionException);
    });
  });
});