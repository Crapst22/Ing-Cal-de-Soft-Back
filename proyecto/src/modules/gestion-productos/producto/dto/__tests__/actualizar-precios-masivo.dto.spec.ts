import { ActualizarPreciosMasivoDto } from '../actualizar-precios-masivo.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';
import { TipoAumento } from '../../../../common/enums/tipo-aumento.emun';

describe('ActualizarPreciosMasivoDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con aumento por porcentaje global', async () => {
      const data = {
        tipoAumento: TipoAumento.PORCENTAJE,
        valor: 15.5,
        usuarioId: 1,
        motivo: 'Actualización anual',
      };

      await DtoValidatorHelper.expectValidDto(ActualizarPreciosMasivoDto, data);
    });

    it('debería ser válido con aumento por monto fijo y línea específica', async () => {
      const data = {
        tipoAumento: TipoAumento.MONTO_FIJO,
        valor: 500,
        lineaId: 2,
        usuarioId: 1,
        motivo: 'Ajuste por costos',
      };

      await DtoValidatorHelper.expectValidDto(ActualizarPreciosMasivoDto, data);
    });
  });

  describe('Validación de errores', () => {
    it('debería fallar si falta el motivo', async () => {
      const data = { tipoAumento: TipoAumento.PORCENTAJE, valor: 10, usuarioId: 1 };
      await DtoValidatorHelper.expectFieldError(ActualizarPreciosMasivoDto, data, 'motivo');
    });
    it('debería fallar si falta tipoAumento', async () => {
      const data = {
        valor: 10,
        usuarioId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'tipoAumento',
      );
    });

    it('debería fallar si tipoAumento no es un enum válido', async () => {
      const data = {
        tipoAumento: 99,
        valor: 10,
        usuarioId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'tipoAumento',
      );
    });

    it('debería fallar si falta valor', async () => {
      const data = {
        tipoAumento: TipoAumento.PORCENTAJE,
        usuarioId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'valor',
      );
    });

    it('debería fallar si valor es menor o igual a 0', async () => {
      const data = {
        tipoAumento: TipoAumento.PORCENTAJE,
        valor: 0,
        usuarioId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'valor',
      );
    });

    it('debería fallar si falta usuarioId', async () => {
      const data = {
        tipoAumento: TipoAumento.PORCENTAJE,
        valor: 10,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'usuarioId',
      );
    });

    it('debería fallar si lineaId no es un entero', async () => {
      const data = {
        tipoAumento: TipoAumento.PORCENTAJE,
        valor: 10,
        lineaId: 'invalido',
        usuarioId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        ActualizarPreciosMasivoDto,
        data,
        'lineaId',
      );
    });
  });
});
