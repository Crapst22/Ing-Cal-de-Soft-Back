import { DenominacionDto } from '../denominacion.dto';
import { DtoValidatorHelper } from '../../test-helpers/dto-validator.helper';

describe('DenominacionDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con una denominación como string', async () => {
      const data = {
        denominacion: 'Test Denominación',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido sin denominación (es opcional)', async () => {
      const data = {};

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con denominación vacía', async () => {
      const data = {
        denominacion: '',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con caracteres especiales', async () => {
      const data = {
        denominacion: 'Test @#$% & Special',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con números', async () => {
      const data = {
        denominacion: 'Test 12345',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con acentos y ñ', async () => {
      const data = {
        denominacion: 'Año España Ñoño Ácido',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con espacios múltiples', async () => {
      const data = {
        denominacion: 'Test    Multiple    Spaces',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería ser válido con texto muy largo', async () => {
      const data = {
        denominacion: 'a'.repeat(10000),
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });
  });

  describe('Validación con errores', () => {
    it('debería fallar si denominación no es un string', async () => {
      const data = {
        denominacion: 123,
      };

      await DtoValidatorHelper.expectFieldError(
        DenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con boolean', async () => {
      const data = {
        denominacion: true,
      };

      await DtoValidatorHelper.expectFieldError(
        DenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con objeto', async () => {
      const data = {
        denominacion: { value: 'test' },
      };

      await DtoValidatorHelper.expectFieldError(
        DenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con array', async () => {
      const data = {
        denominacion: ['test', 'test2'],
      };

      await DtoValidatorHelper.expectFieldError(
        DenominacionDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con null cuando se envía explícitamente', async () => {
      const data = {
        denominacion: null,
      };

      await DtoValidatorHelper.expectFieldError(
        DenominacionDto,
        data,
        'denominacion',
      );
    });
  });

  describe('Casos extremos', () => {
    it('debería manejar strings con saltos de línea', async () => {
      const data = {
        denominacion: 'Línea 1\nLínea 2\nLínea 3',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería manejar strings con tabs', async () => {
      const data = {
        denominacion: 'Test\tcon\ttabs',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería manejar emojis', async () => {
      const data = {
        denominacion: 'Test 😀 🎉 🚀',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería manejar caracteres Unicode', async () => {
      const data = {
        denominacion: '中文 日本語 한국어',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });

    it('debería manejar solo espacios en blanco', async () => {
      const data = {
        denominacion: '     ',
      };

      await DtoValidatorHelper.expectValidDto(DenominacionDto, data);
    });
  });
});
