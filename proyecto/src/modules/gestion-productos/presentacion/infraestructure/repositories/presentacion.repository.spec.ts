import { Test, TestingModule } from '@nestjs/testing';
import { PresentacionRepository } from './presentacion.repository';
import { PresentacionPersistenceAdapter } from './presentacion.persistence-adapter';

describe('PresentacionRepository', () => {
  let repository: PresentacionRepository;
  let persistence: jest.Mocked<
    Pick<
      PresentacionPersistenceAdapter,
      | 'create'
      | 'findBy'
      | 'findAllListado'
      | 'findAllFor'
      | 'findByIdConAuditoria'
      | 'findOne'
      | 'update'
      | 'remove'
    >
  >;

  const mockPersistence = {
    create: jest.fn(),
    findBy: jest.fn(),
    findAllListado: jest.fn(),
    findAllFor: jest.fn(),
    findByIdConAuditoria: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentacionRepository,
        {
          provide: PresentacionPersistenceAdapter,
          useValue: mockPersistence,
        },
      ],
    }).compile();

    repository = module.get<PresentacionRepository>(PresentacionRepository);
    persistence = mockPersistence;
  });

  it('debería estar definido', () => {
    expect(repository).toBeDefined();
  });

  it('delega create en el persistence adapter', async () => {
    const dto = { tipo: 'pack', usuarioCreatedId: 1 } as any;
    mockPersistence.create.mockResolvedValue({ id: 1 });

    const result = await repository.create(dto);

    expect(persistence.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1 });
  });

  it('delega findBy en el persistence adapter', async () => {
    mockPersistence.findBy.mockResolvedValue({ data: [], total: 0 });

    const result = await repository.findBy('pack', 0, 10, false);

    expect(persistence.findBy).toHaveBeenCalledWith('pack', 0, 10, false);
    expect(result).toEqual({ data: [], total: 0 });
  });

  it('delega findAllListado en el persistence adapter', async () => {
    mockPersistence.findAllListado.mockResolvedValue([{ id: 1 }]);

    const result = await repository.findAllListado();

    expect(persistence.findAllListado).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('delega findAllFor en el persistence adapter', async () => {
    mockPersistence.findAllFor.mockResolvedValue([{ id: 1 }]);

    const result = await repository.findAllFor('pack');

    expect(persistence.findAllFor).toHaveBeenCalledWith('pack');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('delega findByIdConAuditoria en el persistence adapter', async () => {
    mockPersistence.findByIdConAuditoria.mockResolvedValue({ id: 1 });

    const result = await repository.findByIdConAuditoria(1);

    expect(persistence.findByIdConAuditoria).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('delega findOne en el persistence adapter', async () => {
    mockPersistence.findOne.mockResolvedValue({ id: 1 });

    const result = await repository.findOne(1);

    expect(persistence.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('delega update en el persistence adapter', async () => {
    const dto = { volumen: 1000, usuarioUpdatedId: 1 } as any;
    mockPersistence.update.mockResolvedValue({ id: 1 });

    const result = await repository.update(1, dto);

    expect(persistence.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: 1 });
  });

  it('delega remove en el persistence adapter', async () => {
    const data = { id: 1 } as any;
    const usuario = { id: 7 } as any;
    mockPersistence.remove.mockResolvedValue({ id: 1 });

    const result = await repository.remove(data, usuario);

    expect(persistence.remove).toHaveBeenCalledWith(data, usuario);
    expect(result).toEqual({ id: 1 });
  });
});