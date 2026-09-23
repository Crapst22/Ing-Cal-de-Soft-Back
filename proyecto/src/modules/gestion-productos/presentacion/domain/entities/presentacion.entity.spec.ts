import { getMetadataArgsStorage } from 'typeorm';
import { Presentacion } from './presentacion.entity';

describe('Presentacion (entidad)', () => {
  it('crea una instancia con las propiedades asignadas', () => {
    const fecha = new Date('2026-01-01T00:00:00Z');
    const entity = new Presentacion();
    entity.id = 3;
    entity.tipo = 'pack';
    entity.quantity = 6;
    entity.volumen = 500;
    entity.unidad = 'ml';
    entity.sistema = 1;
    entity.createdAt = fecha;
    entity.updatedAt = fecha;
    entity.deletedAt = undefined;
    entity.usuarioCreatedId = 1;

    expect(entity.id).toBe(3);
    expect(entity.tipo).toBe('pack');
    expect(entity.quantity).toBe(6);
    expect(entity.volumen).toBe(500);
    expect(entity.unidad).toBe('ml');
    expect(entity.sistema).toBe(1);
    expect(entity.deletedAt).toBeUndefined();
  });

  describe('transformer del campo volumen', () => {
    function getVolumenTransformer() {
      const column = getMetadataArgsStorage().columns.find(
        (c) => c.target === Presentacion && c.propertyName === 'volumen',
      );
      if (!column || !column.options.transformer) {
        throw new Error('No se encontró el transformer de volumen');
      }
      return column.options.transformer;
    }

    it('convierte el valor a string para persistir (to)', () => {
      const transformer = getVolumenTransformer() as {
        to: (v: unknown) => unknown;
        from: (v: unknown) => unknown;
      };

      expect(transformer.to(500)).toBe('500');
      expect(transformer.to(0.5)).toBe('0.5');
      expect(transformer.to(3)).toBe('3');
      expect(transformer.to(null)).toBeNull();
      expect(transformer.to(undefined)).toBeNull();
      expect(transformer.to('')).toBeNull();
    });

    it('convierte el valor de la base a número al leer (from)', () => {
      const transformer = getVolumenTransformer() as {
        to: (v: unknown) => unknown;
        from: (v: unknown) => unknown;
      };

      expect(transformer.from('500')).toBe(500);
      expect(transformer.from('0.500')).toBe(0.5);
      expect(transformer.from(null)).toBeNull();
    });
  });

  it('permite valores nullable en quantity, volumen y unidad', () => {
    const entity = new Presentacion();
    entity.quantity = null;
    entity.volumen = null;
    entity.unidad = null;

    expect(entity.quantity).toBeNull();
    expect(entity.volumen).toBeNull();
    expect(entity.unidad).toBeNull();
  });
});