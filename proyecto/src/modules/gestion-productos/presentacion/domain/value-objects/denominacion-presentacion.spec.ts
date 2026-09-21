import {
  formatearUnidad,
  formatearVolumen,
  normalizarUnidad,
  generarDenominacionPresentacion,
} from './denominacion-presentacion';

describe('denominacion-presentacion (VO de Presentación)', () => {
  describe('formatearUnidad', () => {
    it('recorta espacios de la unidad', () => {
      expect(formatearUnidad('  ml  ')).toBe('ml');
    });

    it('devuelve string vacío para null o undefined', () => {
      expect(formatearUnidad(null)).toBe('');
      expect(formatearUnidad(undefined)).toBe('');
    });
  });

  describe('formatearVolumen', () => {
    it('devuelve string vacío cuando no hay volumen', () => {
      expect(formatearVolumen(null)).toBe('');
      expect(formatearVolumen(undefined)).toBe('');
    });

    it('normaliza el número eliminando ceros decimales', () => {
      expect(formatearVolumen(500)).toBe('500');
      expect(formatearVolumen(1)).toBe('1');
      expect(formatearVolumen(1.5)).toBe('1.5');
      expect(formatearVolumen(0.25)).toBe('0.25');
    });
  });

  describe('normalizarUnidad', () => {
    it('normaliza unidades válidas a minúsculas', () => {
      expect(normalizarUnidad('ML')).toBe('ml');
      expect(normalizarUnidad(' L ')).toBe('l');
      expect(normalizarUnidad('CM3')).toBe('cm3');
    });

    it('mantiene recortada una unidad desconocida', () => {
      expect(normalizarUnidad(' otra ')).toBe('otra');
    });

    it('devuelve string vacío para null/undefined', () => {
      expect(normalizarUnidad(null)).toBe('');
      expect(normalizarUnidad(undefined)).toBe('');
    });
  });

  describe('generarDenominacionPresentacion', () => {
    it('genera una denominación de tipo volumen', () => {
      expect(generarDenominacionPresentacion('volume', null, 1, 'l')).toBe(
        '1l',
      );
    });

    it('combina volumen y unidad aunque la unidad venga con espacios', () => {
      expect(generarDenominacionPresentacion('volume', null, 500, ' ml ')).toBe(
        '500ml',
      );
    });

    it('usa "Volumen" cuando falta el volumen', () => {
      expect(generarDenominacionPresentacion('volume', null, null, 'l')).toBe(
        'Volumen',
      );
      expect(generarDenominacionPresentacion('volume')).toBe('Volumen');
    });

    it('usa "Volumen" cuando falta la unidad', () => {
      expect(generarDenominacionPresentacion('volume', null, 1)).toBe(
        'Volumen',
      );
    });

    it('pack sin cantidad ni volumen', () => {
      expect(generarDenominacionPresentacion('pack')).toBe('Pack');
    });

    it('pack solo con cantidad', () => {
      expect(generarDenominacionPresentacion('pack', 6)).toBe('Pack x6');
    });

    it('pack solo con volumen', () => {
      expect(generarDenominacionPresentacion('pack', null, 1, 'l')).toBe(
        'Pack de 1l',
      );
    });

    it('pack con cantidad y volumen', () => {
      expect(
        generarDenominacionPresentacion('pack', 6, 500, 'ml'),
      ).toBe('Pack x6 de 500ml');
    });

    it('pack ignora cantidades no positivas', () => {
      expect(
        generarDenominacionPresentacion('pack', 0, 500, 'ml'),
      ).toBe('Pack de 500ml');
      expect(generarDenominacionPresentacion('pack', -3, null, null)).toBe(
        'Pack',
      );
    });
  });
});