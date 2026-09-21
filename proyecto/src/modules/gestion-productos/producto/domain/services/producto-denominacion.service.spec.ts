import { ProductoDenominacionService } from './producto-denominacion.service';

describe('ProductoDenominacionService', () => {
  const service = new ProductoDenominacionService();

  const marca = { id: 1, denominacion: 'CAROYENSE' } as any;
  const linea = { id: 1, denominacion: 'Aceites' } as any;
  const presentacionPack = {
    id: 1,
    tipo: 'pack',
    quantity: 6,
    volumen: 500,
    unidad: 'ml',
  } as any;
  const presentacionVolumen = {
    id: 2,
    tipo: 'volume',
    quantity: null,
    volumen: 1,
    unidad: 'l',
  } as any;

  describe('generarDenominacion', () => {
    it('compone Marca + Línea + Presentación en minúsculas', () => {
      const resultado = service.generarDenominacion({
        marca,
        linea,
        presentacion: presentacionPack,
      });

      expect(resultado).toBe('caroyense aceites pack x6 de 500ml');
    });

    it('incluye la denominación de la presentación de volumen', () => {
      const resultado = service.generarDenominacion({
        marca,
        linea,
        presentacion: presentacionVolumen,
      });

      expect(resultado).toBe('caroyense aceites 1l');
    });

    it('omite la presentación cuando el producto no tiene una', () => {
      const resultado = service.generarDenominacion({
        marca,
        linea,
        presentacion: null,
      });

      expect(resultado).toBe('caroyense aceites');
    });

    it('colapsa espacios consecutivos', () => {
      const resultado = service.generarDenominacion({
        marca: { id: 1, denominacion: '  MAXI   TUR  ' } as any,
        linea: { id: 1, denominacion: 'Limpieza  ' } as any,
        presentacion: null,
      });

      expect(resultado).toBe('maxi tur limpieza');
    });
  });

  describe('resolverDenominacion', () => {
    it('respeta la denominación manual si viene explícita', () => {
      const resultado = service.resolverDenominacion({
        manual: 'Aceite de Girasol 1L',
        marca,
        linea,
        presentacion: presentacionVolumen,
      });

      expect(resultado).toBe('aceite de girasol 1l');
    });

    it('autogenera cuando no viene denominación', () => {
      const resultado = service.resolverDenominacion({
        manual: undefined,
        marca,
        linea,
        presentacion: presentacionVolumen,
      });

      expect(resultado).toBe('caroyense aceites 1l');
    });
  });
});