import { SuperLinea } from '../domain/entities/superlinea.entity';
import { SuperLineaMapper } from './superlinea.mapper';

describe('SuperLineaMapper', () => {
  it('debería mapear la entidad a DTO sin fecha de eliminación', () => {
    const entity: SuperLinea = {
      id: 1,
      denominacion: 'Aceites',
      observacion: undefined,
      sistema: 0,
      deletedAt: undefined,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      lineas: [],
    } as SuperLinea;

    const dto = SuperLineaMapper.toDto(entity);

    expect(dto).toEqual({
      id: 1,
      denominacion: 'Aceites',
      observacion: '',
      sistema: 0,
      deletedAt: null,
    });
  });

  it('debería mapear observación y fecha de eliminación si existen', () => {
    const entity: SuperLinea = {
      id: 2,
      denominacion: 'Bazar',
      observacion: 'Todo para el hogar',
      sistema: 1,
      deletedAt: new Date('2026-02-01T10:00:00.000Z'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      lineas: [],
    } as SuperLinea;

    const dto = SuperLineaMapper.toDto(entity);

    expect(dto).toEqual({
      id: 2,
      denominacion: 'Bazar',
      observacion: 'Todo para el hogar',
      sistema: 1,
      deletedAt: '2026-02-01T10:00:00.000Z',
    });
  });
});