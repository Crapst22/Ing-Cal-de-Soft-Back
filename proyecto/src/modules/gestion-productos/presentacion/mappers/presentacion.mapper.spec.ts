import { PresentacionMapper } from './presentacion.mapper';

describe('PresentacionMapper', () => {
  it('mapea la entidad a DTO con denominación calculada', () => {
    const dto = PresentacionMapper.toDto({
      id: 1,
      tipo: 'pack',
      quantity: 6,
      volumen: 500,
      unidad: 'ml',
      sistema: 0,
      deletedAt: new Date('2026-01-01T00:00:00Z'),
    } as any);

    expect(dto.id).toBe(1);
    expect(dto.tipo).toBe('pack');
    expect(dto.quantity).toBe(6);
    expect(dto.volumen).toBe(500);
    expect(dto.unidad).toBe('ml');
    expect(dto.denominacion).toBe('Pack x6 de 500ml');
    expect(dto.deletedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('convierte nulos y deletedAt null', () => {
    const dto = PresentacionMapper.toDto({
      id: 2,
      tipo: 'volume',
      quantity: null,
      volumen: 1,
      unidad: 'l',
      sistema: 1,
      deletedAt: null,
    } as any);

    expect(dto.denominacion).toBe('1l');
    expect(dto.quantity).toBeNull();
    expect(dto.sistema).toBe(1);
    expect(dto.deletedAt).toBeNull();
  });
});