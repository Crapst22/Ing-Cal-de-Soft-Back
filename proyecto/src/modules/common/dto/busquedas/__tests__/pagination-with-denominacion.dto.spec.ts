import { PaginationWithDenominacionDto } from '../pagination-with-denominacion.dto';
import { DtoValidatorHelper } from '../../../test-helpers/dto-validator.helper';

describe('PaginationWithDenominacionDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con valores por defecto', async () => {
      const data = {};

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería ser válido con todos los campos', async () => {
      const data = {
        denominacion: 'Test',
        skip: 10,
        take: 20,
        incluirEliminados: true,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar skip como 0', async () => {
      const data = {
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar take mínimo de 1', async () => {
      const data = {
        skip: 0,
        take: 1,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería transformar strings numéricos', async () => {
      const data = {
        skip: '20',
        take: '50',
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería transformar string boolean a boolean', async () => {
      const data = {
        incluirEliminados: 'true',
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar denominacion opcional', async () => {
      const data = {
        denominacion: 'Cliente Test',
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar denominacion con espacios', async () => {
      const data = {
        denominacion: 'Test con espacios múltiples',
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar valores grandes para paginación', async () => {
      const data = {
        skip: 10000,
        take: 100,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });
  });

  describe('Validación del campo skip', () => {
    it('debería fallar si skip es negativo', async () => {
      const data = {
        skip: -1,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
        'skip debe ser un número entero positivo o 0',
      );
    });

    it('debería fallar si skip no es un número', async () => {
      const data = {
        skip: 'not a number',
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
      );
    });

    it('debería fallar si skip es decimal', async () => {
      const data = {
        skip: 10.5,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
      );
    });

    it('debería fallar si skip es boolean', async () => {
      const data = {
        skip: true,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
      );
    });

    it('debería fallar si skip es array', async () => {
      const data = {
        skip: [10],
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
      );
    });

    it('debería fallar si skip es objeto', async () => {
      const data = {
        skip: { value: 10 },
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'skip',
      );
    });
  });

  describe('Validación del campo take', () => {
    it('debería fallar si take es 0', async () => {
      const data = {
        skip: 0,
        take: 0,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'take',
        'take debe ser un número entero mayor que 0',
      );
    });

    it('debería fallar si take es negativo', async () => {
      const data = {
        skip: 0,
        take: -1,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'take',
      );
    });

    it('debería fallar si take no es un número', async () => {
      const data = {
        skip: 0,
        take: 'not a number',
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'take',
      );
    });

    it('debería fallar si take es decimal', async () => {
      const data = {
        skip: 0,
        take: 10.5,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'take',
      );
    });

    it('debería aceptar take = 1', async () => {
      const data = {
        skip: 0,
        take: 1,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar take muy grande', async () => {
      const data = {
        skip: 0,
        take: 1000,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });
  });

  describe('Validación del campo denominacion', () => {
    it('debería aceptar denominacion vacía', async () => {
      const data = {
        denominacion: '',
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería fallar si denominacion no es string', async () => {
      const data = {
        denominacion: 123,
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion es array', async () => {
      const data = {
        denominacion: ['test'],
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion es objeto', async () => {
      const data = {
        denominacion: { value: 'test' },
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería aceptar denominacion muy larga', async () => {
      const data = {
        denominacion: 'a'.repeat(1000),
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar denominacion con caracteres especiales', async () => {
      const data = {
        denominacion: 'Test @#$% & Ñoño',
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });
  });

  describe('Validación del campo incluirEliminados', () => {
    it('debería aceptar true', async () => {
      const data = {
        incluirEliminados: true,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería aceptar false', async () => {
      const data = {
        incluirEliminados: false,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería transformar string "true" a boolean', async () => {
      const data = {
        incluirEliminados: 'true',
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería fallar con string que no sea "true"', async () => {
      const data = {
        incluirEliminados: 'yes',
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'incluirEliminados',
      );
    });

    it('debería fallar con número', async () => {
      const data = {
        incluirEliminados: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationWithDenominacionDto,
        data,
        'incluirEliminados',
      );
    });
  });

  describe('Casos extremos', () => {
    it('debería manejar valores por defecto correctamente', async () => {
      const data = {};

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería manejar solo denominacion', async () => {
      const data = {
        denominacion: 'Solo búsqueda',
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería manejar paginación sin filtro', async () => {
      const data = {
        skip: 100,
        take: 50,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería manejar todos los campos juntos', async () => {
      const data = {
        denominacion: 'Búsqueda completa',
        skip: 20,
        take: 30,
        incluirEliminados: true,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });

    it('debería manejar valores numéricos extremos', async () => {
      const data = {
        skip: Number.MAX_SAFE_INTEGER,
        take: Number.MAX_SAFE_INTEGER,
      };

      await DtoValidatorHelper.expectValidDto(
        PaginationWithDenominacionDto,
        data,
      );
    });
  });
});
