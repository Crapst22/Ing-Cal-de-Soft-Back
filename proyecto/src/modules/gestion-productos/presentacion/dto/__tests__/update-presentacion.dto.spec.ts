import 'reflect-metadata';
import { UpdatePresentacionDto } from '../update-presentacion.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('UpdatePresentacionDto', () => {
  describe('Validación exitosa', () => {
    it('acepta un cuerpo de edición completo', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        tipo: 'pack',
        quantity: 6,
        volumen: 500,
        unidad: 'ml',
        usuarioUpdatedId: 1,
      });
    });

    it('acepta solo los campos que se quieren modificar', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        volumen: 1000,
        usuarioUpdatedId: 1,
      });
    });

    it('acepta un cuerpo mínimo con solo el usuario', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        usuarioUpdatedId: 1,
      });
    });

    it('normaliza el tipo a minúsculas', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        tipo: 'PACK',
        usuarioUpdatedId: 1,
      });
    });

    it('transforma quantity y volumen string a números', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        tipo: 'pack',
        quantity: '6',
        volumen: '0.5',
        unidad: 'l',
        usuarioUpdatedId: 1,
      });
    });
  });

  describe('Validación del campo tipo', () => {
    it('rechaza un tipo inválido', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'litro', usuarioUpdatedId: 1 },
        'tipo',
      );
    });

    it('no exige el tipo (es opcional en edición)', async () => {
      await DtoValidatorHelper.expectValidDto(UpdatePresentacionDto, {
        usuarioUpdatedId: 1,
      });
    });
  });

  describe('Validación de cantidad y volumen', () => {
    it('rechaza una cantidad menor a 1', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'pack', quantity: 0, usuarioUpdatedId: 1 },
        'quantity',
      );
    });

    it('rechaza un volumen negativo', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'volume', volumen: -1, unidad: 'l', usuarioUpdatedId: 1 },
        'volumen',
      );
    });
  });

  describe('Validación de la unidad', () => {
    it('rechaza una unidad de más de 20 caracteres', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'u'.repeat(21), usuarioUpdatedId: 1 },
        'unidad',
      );
    });

    it('rechaza una unidad que no es texto', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 123 as any, usuarioUpdatedId: 1 },
        'unidad',
      );
    });
  });

  describe('Validación de usuarioUpdatedId', () => {
    it('rechaza usuarioUpdatedId ausente', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'l' },
        'usuarioUpdatedId',
      );
    });

    it('rechaza usuarioUpdatedId no entero', async () => {
      await DtoValidatorHelper.expectFieldError(
        UpdatePresentacionDto,
        { tipo: 'volume', volumen: 1, unidad: 'l', usuarioUpdatedId: 'abc' },
        'usuarioUpdatedId',
      );
    });
  });

  describe('Caso extremo', () => {
    it('falla con un objeto vacío porque falta usuarioUpdatedId', async () => {
      const errors = await DtoValidatorHelper.validateDto(UpdatePresentacionDto, {});
      expect(errors.length).toBeGreaterThan(0);
      const props = errors.map((error) => error.property);
      expect(props).toEqual(expect.arrayContaining(['usuarioUpdatedId']));
    });
  });
});