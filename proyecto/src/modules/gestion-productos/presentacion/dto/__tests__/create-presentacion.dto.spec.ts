import 'reflect-metadata';
import { CreatePresentacionDto } from '../create-presentacion.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('CreatePresentacionDto', () => {
  describe('Validación exitosa', () => {
    it('acepta una presentación de tipo volumen', async () => {
      await DtoValidatorHelper.expectValidDto(CreatePresentacionDto, {
        tipo: 'volume',
        volumen: 1,
        unidad: 'l',
        usuarioCreatedId: 1,
      });
    });

    it('acepta una presentación de tipo pack con cantidad', async () => {
      await DtoValidatorHelper.expectValidDto(CreatePresentacionDto, {
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioCreatedId: 1,
      });
    });

    it('normaliza el tipo a minúsculas', async () => {
      await DtoValidatorHelper.expectValidDto(CreatePresentacionDto, {
        tipo: 'PACK',
        quantity: 6,
        usuarioCreatedId: 1,
      });
    });

    it('transforma quantity y volumen string a números', async () => {
      await DtoValidatorHelper.expectValidDto(CreatePresentacionDto, {
        tipo: 'pack',
        quantity: '6',
        volumen: '0.5',
        unidad: 'l',
        usuarioCreatedId: 1,
      });
    });
  });

  describe('Validación del campo tipo', () => {
    it('rechaza un tipo inválido', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'litro', usuarioCreatedId: 1 },
        'tipo',
      );
    });

    it('rechaza un tipo ausente', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { usuarioCreatedId: 1 },
        'tipo',
      );
    });
  });

  describe('Validación de cantidad y volumen', () => {
    it('rechaza una cantidad menor a 1', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'pack', quantity: 0, usuarioCreatedId: 1 },
        'quantity',
      );
    });

    it('rechaza un volumen negativo', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'volume', volumen: -1, unidad: 'l', usuarioCreatedId: 1 },
        'volumen',
      );
    });
  });

  describe('Validación de la unidad', () => {
    it('rechaza una unidad de más de 20 caracteres', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'u'.repeat(21), usuarioCreatedId: 1 },
        'unidad',
      );
    });

    it('rechaza una unidad que no es texto', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 123 as any, usuarioCreatedId: 1 },
        'unidad',
      );
    });
  });

  describe('Validación de usuarioCreatedId', () => {
    it('rechaza usuarioCreatedId ausente', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'l' },
        'usuarioCreatedId',
      );
    });

    it('rechaza usuarioCreatedId no entero', async () => {
      await DtoValidatorHelper.expectFieldError(
        CreatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'l', usuarioCreatedId: 'abc' },
        'usuarioCreatedId',
      );
    });
  });
});