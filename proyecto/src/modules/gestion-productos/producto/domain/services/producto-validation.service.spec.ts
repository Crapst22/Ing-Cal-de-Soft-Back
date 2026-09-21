import { BadRequestException } from '@nestjs/common';
import { ProductoValidationService } from './producto-validation.service';

describe('ProductoValidationService', () => {
  const service = new ProductoValidationService();

  it('no lanza cuando marca y línea no son del sistema', () => {
    expect(() =>
      service.validarEntidadesRelacionadas(
        { id: 1, sistema: 0 } as any,
        { id: 2, sistema: 0 } as any,
      ),
    ).not.toThrow();
  });

  it('lanza BadRequest cuando la marca es del sistema', () => {
    expect(() =>
      service.validarEntidadesRelacionadas(
        { id: 1, sistema: 1 } as any,
        { id: 2, sistema: 0 } as any,
      ),
    ).toThrow(BadRequestException);
  });

  it('lanza BadRequest cuando la línea es del sistema', () => {
    expect(() =>
      service.validarEntidadesRelacionadas(
        { id: 1, sistema: 0 } as any,
        { id: 2, sistema: 1 } as any,
      ),
    ).toThrow(BadRequestException);
  });
});