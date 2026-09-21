import { BadRequestException } from '@nestjs/common';
import { ProductoIntrinsicValidationService } from './producto-intrinsic-validation.service';

describe('ProductoIntrinsicValidationService (CR-007 - Regla de dominio precio > 0)', () => {
  let service: ProductoIntrinsicValidationService;

  beforeEach(() => {
    service = new ProductoIntrinsicValidationService();
  });

  it('debe rechazar un precio nuevo <= 0 (cero o negativo)', () => {
    const preciosInvalidos = [0, -0.01, -1, -100];

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
