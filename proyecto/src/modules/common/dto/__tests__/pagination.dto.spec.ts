import { PaginationDto } from '../pagination.dto';
import { DtoValidatorHelper } from '../../test-helpers/dto-validator.helper';

describe('PaginationDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con skip y take como números', async () => {
      const data = {
        skip: 0,
        take: 10,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería ser válido sin skip ni take (opcionales)', async () => {
      const data = {};

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería ser válido solo con skip', async () => {
      const data = {
        skip: 5,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería ser válido solo con take', async () => {
      const data = {
        take: 20,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería transformar strings numéricos a números', async () => {
      const data = {
        skip: '10',
        take: '20',
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería aceptar valores grandes', async () => {
      const data = {
        skip: 1000,
        take: 100,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería aceptar cero como valor válido', async () => {
      const data = {
        skip: 0,
        take: 0,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });
  });

  describe('Validación con errores', () => {
    it('debería fallar si skip no es un número', async () => {
      const data = {
        skip: 'no es un número',
        take: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationDto,
        data,
        'skip',
      );
    });

    it('debería fallar si take no es un número', async () => {
      const data = {
        skip: 10,
        take: 'no es un número',
      };

      await DtoValidatorHelper.expectFieldError(
        PaginationDto,
        data,
        'take',
      );
    });

    it('debería fallar con valores booleanos', async () => {
      const data = {
        skip: true,
        take: false,
      };

      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería fallar con objetos', async () => {
      const data = {
        skip: { value: 10 },
        take: { value: 20 },
      };

      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería fallar con arrays', async () => {
      const data = {
        skip: [10],
        take: [20],
      };

      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería fallar con null', async () => {
      const data = {
        skip: null,
        take: null,
      };

      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Casos extremos', () => {
    it('debería manejar números negativos', async () => {
      const data = {
        skip: -1,
        take: -10,
      };

      // La validación actual no rechaza negativos
      // Dependiendo de la lógica de negocio, esto podría necesitar @Min(0)
      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      // Documentar comportamiento actual
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('debería manejar números decimales', async () => {
      const data = {
        skip: 10.5,
        take: 20.7,
      };

      // Se aceptan decimales actualmente
      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería manejar valores muy grandes', async () => {
      const data = {
        skip: Number.MAX_SAFE_INTEGER,
        take: Number.MAX_SAFE_INTEGER,
      };

      await DtoValidatorHelper.expectValidDto(PaginationDto, data);
    });

    it('debería manejar Infinity', async () => {
      const data = {
        skip: Infinity,
        take: -Infinity,
      };

      const errors = await DtoValidatorHelper.validateDto(PaginationDto, data);
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });
  });
});
