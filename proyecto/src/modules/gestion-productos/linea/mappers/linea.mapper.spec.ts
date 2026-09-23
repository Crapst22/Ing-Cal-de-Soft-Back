import { Linea } from '../domain/entities/linea.entity';
import { LineaMapper } from './linea.mapper';

describe('LineaMapper', () => {
  it('debería mapear la entidad a DTO sin fecha de eliminación', () => {
    const entity: Linea = {
      id: 1,
      denominacion: 'Aceites',
      observacion: undefined,
      sistema: 0,
      deletedAt: undefined,
      superLineaId: 3,
      utilizaStockMinimo: false,
      stockMinimo: 0,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      productos: [],
    } as Linea;

    const dto = LineaMapper.toDto(entity);

    expect(dto).toEqual({
      id: 1,
      denominacion: 'Aceites',
      stockMinimo: 0,
      superLineaId: 3,
      utilizaStockMinimo: false,
      observacion: '',
      sistema: 0,
      deletedAt: null,
    });
  });

  it('debería mapear observación y fecha de eliminación si existen', () => {
    const entity: Linea = {
      id: 2,
      denominacion: 'Bazar',
      observacion: 'Todo para el hogar',
      sistema: 1,
      deletedAt: new Date('2026-02-01T10:00:00.000Z'),
      superLineaId: undefined,
      utilizaStockMinimo: true,
      stockMinimo: 10,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      productos: [],
    } as Linea;

    const dto = LineaMapper.toDto(entity);

    expect(dto).toEqual({
      id: 2,
      denominacion: 'Bazar',
      stockMinimo: 10,
      superLineaId: undefined,
      utilizaStockMinimo: true,
      observacion: 'Todo para el hogar',
      sistema: 1,
      deletedAt: '2026-02-01T10:00:00.000Z',
    });
  });
});