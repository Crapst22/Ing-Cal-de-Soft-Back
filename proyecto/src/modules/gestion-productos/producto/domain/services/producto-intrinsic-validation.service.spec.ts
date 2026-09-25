import { BadRequestException } from '@nestjs/common';
import { ProductoIntrinsicValidationService } from './producto-intrinsic-validation.service';

describe('ProductoIntrinsicValidationService', () => {
  const service = new ProductoIntrinsicValidationService();

  const datosValidos = {
    denominacion: 'aceite de girasol 1l',
    marcaId: 1,
    lineaId: 1,
    alicuotaIva: 21,
  };

  it('no lanza con datos válidos', () => {
    expect(() => service.validarDatosBasicos(datosValidos)).not.toThrow();
  });

  it('acepta alícuota sin especificar', () => {
    expect(() =>
      service.validarDatosBasicos({
        denominacion: 'aceite',
        marcaId: 1,
        lineaId: 1,
      }),
    ).not.toThrow();
  });

  describe('denominacion', () => {
    it('rechaza denominación vacía o con solo espacios', () => {
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, denominacion: '' }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, denominacion: '   ' }),
      ).toThrow(BadRequestException);
    });

    it('rechaza denominaciones de más de 255 caracteres', () => {
      expect(() =>
        service.validarDatosBasicos({
          ...datosValidos,
          denominacion: 'a'.repeat(256),
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('ids', () => {
    it('rechaza marcaId inválido', () => {
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, marcaId: 0 }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, marcaId: undefined as any }),
      ).toThrow(BadRequestException);
    });

    it('rechaza lineaId inválido', () => {
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, lineaId: 0 }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, lineaId: undefined as any }),
      ).toThrow(BadRequestException);
    });
  });

  describe('precios', () => {
    it('rechaza precios negativos', () => {
      expect(() =>
        service.validarDatosBasicos({
          ...datosValidos,
          precioMayorista: -1,
        }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, precioCliente: -1 }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, precioOcasional: -1 }),
      ).toThrow(BadRequestException);
    });

    it('rechaza mayorista mayor que cliente', () => {
      expect(() =>
        service.validarDatosBasicos({
          ...datosValidos,
          precioMayorista: 200,
          precioCliente: 100,
        }),
      ).toThrow(BadRequestException);
    });

    it('rechaza cliente mayor que ocasional', () => {
      expect(() =>
        service.validarDatosBasicos({
          ...datosValidos,
          precioCliente: 200,
          precioOcasional: 100,
        }),
      ).toThrow(BadRequestException);
    });

    it('rechaza mayorista mayor que ocasional', () => {
      expect(() =>
        service.validarDatosBasicos({
          ...datosValidos,
          precioMayorista: 300,
          precioOcasional: 200,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('alicuotaIva', () => {
    it('rechaza alícuota fuera de rango 0-100', () => {
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, alicuotaIva: -1 }),
      ).toThrow(BadRequestException);
      expect(() =>
        service.validarDatosBasicos({ ...datosValidos, alicuotaIva: 101 }),
      ).toThrow(BadRequestException);
    });
  });
});
describe('ProductoIntrinsicValidationService (CR-007 - Regla de dominio precio > 0)', () => {
  let service: ProductoIntrinsicValidationService;

  beforeEach(() => {
    service = new ProductoIntrinsicValidationService();
  });

  it('debe rechazar un precio nuevo <= 0 (cero o negativo)', () => {
    const preciosInvalidos = [0, -0.01, -1, -100, Number.NaN, Number.POSITIVE_INFINITY];

    for (const precio of preciosInvalidos) {
      expect(() => service.validarPrecioNuevo(precio)).toThrow(
        BadRequestException,
      );
    }
  });

  it('debe aceptar un precio nuevo estrictamente mayor a 0', () => {
    const preciosValidos = [0.01, 1, 100.5, 2500];

    for (const precio of preciosValidos) {
      expect(() => service.validarPrecioNuevo(precio)).not.toThrow();
    }
  });
});
